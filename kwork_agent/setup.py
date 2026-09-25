"""Мастер первого запуска: одна команда вместо ручной настройки.

    python -m kwork_agent setup

1. Спрашивает ключ Anthropic API и сохраняет его в .env.
2. Открывает браузер — вы входите в Kwork, сессия сохраняется.
3. Если установлен GitHub CLI (`gh`) и вы в нём авторизованы — сам записывает
   секреты в репозиторий и запускает первый прогон агента в GitHub Actions.
   Иначе печатает, что вставить в настройки репозитория вручную.
"""

from __future__ import annotations

import base64
import getpass
import shutil
import subprocess

from .config import CONFIG, ROOT


def _set_env(key: str, value: str) -> None:
    env = ROOT / ".env"
    lines = env.read_text(encoding="utf-8").splitlines() if env.exists() else []
    lines = [l for l in lines if not l.startswith(f"{key}=")] + [f"{key}={value}"]
    env.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _gh(*args: str, stdin: str | None = None) -> bool:
    result = subprocess.run(["gh", *args], input=stdin, text=True, cwd=ROOT, capture_output=True)
    if result.returncode != 0:
        print(f"  gh {' '.join(args[:3])}: {result.stderr.strip()}")
    return result.returncode == 0


def run_setup() -> int:
    import os

    print("=== Настройка Kwork AI-агента ===\n")

    key = os.getenv("ANTHROPIC_API_KEY", "")
    if not key:
        key = getpass.getpass("Ключ Anthropic API (console.anthropic.com → API Keys): ").strip()
        _set_env("ANTHROPIC_API_KEY", key)
        os.environ["ANTHROPIC_API_KEY"] = key
    if "KWORK_DRY_RUN" not in os.environ:
        _set_env("KWORK_DRY_RUN", "1")

    print("\nСейчас откроется браузер. Войдите в свой аккаунт Kwork.")
    from .publisher import KworkBrowser

    browser = KworkBrowser(headless=False)
    try:
        browser.login_interactive()
    finally:
        browser.close()
    state_b64 = base64.b64encode(CONFIG.state_file.read_bytes()).decode()

    if shutil.which("gh") and _gh("auth", "status"):
        print("\nЗаписываю секреты в GitHub…")
        ok = all([
            _gh("secret", "set", "ANTHROPIC_API_KEY", stdin=key),
            _gh("secret", "set", "KWORK_STATE_B64", stdin=state_b64),
            _gh("variable", "set", "KWORK_DRY_RUN", "--body", os.getenv("KWORK_DRY_RUN", "1")),
        ])
        if ok and _gh("workflow", "run", "kwork-agent.yml", "-f", "command=daily"):
            print("\nГотово! Первый прогон запущен: вкладка Actions в репозитории.\n"
                  "Сейчас включён режим проверки (форма заполняется, но не отправляется).\n"
                  "Когда проверите скриншоты — включите публикацию:\n"
                  "  gh variable set KWORK_DRY_RUN --body 0")
            return 0
        print("Не всё получилось через gh — ниже инструкция для ручной настройки.")

    out = CONFIG.data_dir / "KWORK_STATE_B64.txt"
    out.write_text(state_b64, encoding="utf-8")
    print(
        "\nОткройте в GitHub: репозиторий → Settings → Secrets and variables → Actions\n"
        "и добавьте секреты (New repository secret):\n"
        "  ANTHROPIC_API_KEY  — ваш ключ\n"
        f"  KWORK_STATE_B64    — содержимое файла {out}\n"
        f"После этого удалите {out.name} — в нём ваша сессия Kwork.\n"
        "Затем: вкладка Actions → Kwork AI agent → Run workflow."
    )
    return 0
