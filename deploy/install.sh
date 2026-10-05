#!/usr/bin/env bash
# Установка ИИ-агента на чистый сервер Ubuntu 22.04+/Debian 12 одной командой (от root):
#
#   curl -fsSL https://raw.githubusercontent.com/vitoskk-esd/123/claude/peaceful-edison-ybc66m/deploy/install.sh \
#     | sudo bash -s -- go.example.ru
#
# Аргумент — домен для счётчика переходов (его A-запись должна указывать на этот сервер).
# Без домена агент тоже работает, но клики не считаются. Повторный запуск обновляет агента.
set -euo pipefail

DOMAIN="${1:-}"
REPO="${REPO:-https://github.com/vitoskk-esd/123.git}"
BRANCH="${BRANCH:-claude/peaceful-edison-ybc66m}"
DIR="${DIR:-/opt/bank-agent}"
PORT="${PORT:-8080}"

[ "$(id -u)" -eq 0 ] || { echo "Запустите от root (sudo)"; exit 1; }

echo "==> Пакеты"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y python3 python3-venv git curl ca-certificates

echo "==> Код агента в $DIR"
if [ -d "$DIR/.git" ]; then
  git -C "$DIR" fetch origin "$BRANCH"
  git -C "$DIR" checkout -B "$BRANCH" "origin/$BRANCH"
else
  git clone --branch "$BRANCH" --depth 50 "$REPO" "$DIR"
fi
python3 -m venv "$DIR/.venv"
"$DIR/.venv/bin/pip" install -q --upgrade pip
"$DIR/.venv/bin/pip" install -q "anthropic>=0.80"

cd "$DIR"
set_env() {  # set_env КЛЮЧ ЗНАЧЕНИЕ — обновить или добавить строку в .env
  if grep -q "^$1=" .env; then sed -i "s#^$1=.*#$1=$2#" .env; else echo "$1=$2" >> .env; fi
}
[ -f .env ] || cp .env.example .env
[ -n "$DOMAIN" ] && set_env BANK_TRACKER_URL "https://$DOMAIN"
set_env BANK_TRACKER_HOST 127.0.0.1   # наружу счётчик смотрит только через Caddy с HTTPS
[ -f data/bank/products.json ] || .venv/bin/python -m bank_agent init alfa-credit

echo "==> Ключи и площадки (Enter — пропустить вопрос)"
if (exec < /dev/tty) 2>/dev/null; then
  .venv/bin/python -m bank_agent setup < /dev/tty
else
  echo "Нет терминала для вопросов — запустите позже: cd $DIR && .venv/bin/python -m bank_agent setup"
fi

# Агент работает от отдельного пользователя без прав root.
id bankagent >/dev/null 2>&1 || useradd --system --home-dir "$DIR" --shell /usr/sbin/nologin bankagent
chown -R bankagent:bankagent "$DIR"
chmod 600 .env

echo "==> Служба systemd"
cat > /etc/systemd/system/bank-agent.service <<UNIT
[Unit]
Description=Bank promo AI agent
After=network-online.target
Wants=network-online.target

[Service]
User=bankagent
WorkingDirectory=$DIR
ExecStart=$DIR/.venv/bin/python -m bank_agent serve
Restart=always
RestartSec=10
Environment=BANK_TRACKER_PORT=$PORT

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now bank-agent
systemctl restart bank-agent

if [ -n "$DOMAIN" ]; then
  echo "==> HTTPS для $DOMAIN (Caddy сам получит сертификат)"
  if ! command -v caddy >/dev/null; then
    apt-get install -y caddy || {
      apt-get install -y debian-keyring debian-archive-keyring apt-transport-https gnupg
      curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key \
        | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
      curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt \
        > /etc/apt/sources.list.d/caddy-stable.list
      apt-get update -y && apt-get install -y caddy
    }
  fi
  if command -v ufw >/dev/null && ufw status | grep -q active; then ufw allow 80,443/tcp; fi
  cat > /etc/caddy/Caddyfile <<CADDY
$DOMAIN {
	reverse_proxy 127.0.0.1:$PORT
}
CADDY
  systemctl enable --now caddy
  systemctl reload caddy || systemctl restart caddy
fi

echo
sudo -u bankagent .venv/bin/python -m bank_agent check || true
echo
echo "Готово. Агент работает как служба bank-agent."
echo "  Логи:       journalctl -u bank-agent -f"
echo "  Отчёт:      cd $DIR && sudo -u bankagent .venv/bin/python -m bank_agent report"
echo "  Настройки:  cd $DIR && sudo -u bankagent .venv/bin/python -m bank_agent setup && systemctl restart bank-agent"
echo "  Обновить:   запустите эту же команду установки ещё раз"
[ -n "$DOMAIN" ] && echo "  Проверка счётчика: curl -s https://$DOMAIN/health   (должно ответить ok)"
