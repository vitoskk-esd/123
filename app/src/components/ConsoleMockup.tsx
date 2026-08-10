import { motion } from 'motion/react';
import {
  Sparkles,
  Search,
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: Inbox, label: 'Автоматизации', count: 12, active: true },
  { icon: Star, label: 'Избранное', count: 3 },
  { icon: Send, label: 'Отправлено' },
  { icon: FileText, label: 'Черновики', count: 2 },
  { icon: Archive, label: 'Архив' },
  { icon: Trash2, label: 'Корзина' },
];

const LABELS = [
  { name: 'Продажи', color: '#00d2ff' },
  { name: 'Поддержка', color: '#A4F4FD' },
  { name: 'Маркетинг', color: '#f59e0b' },
  { name: 'Финансы', color: '#10b981' },
];

const MESSAGES = [
  {
    name: 'Synapse AI',
    subject: 'Еженедельный дайджест автоматизаций',
    preview: 'Ваши сценарии выполнили 23 запуска на этой неделе...',
    time: '9:41',
    unread: true,
    active: true,
  },
  {
    name: 'Анна Соколова',
    subject: 'Re: обзор презентации для инвесторов',
    preview: 'Спасибо, что прислали колоду. У меня есть пара мыслей...',
    time: '8:12',
    unread: true,
  },
  {
    name: 'Parser Bot',
    subject: 'Собраны данные по 3 400 товарам',
    preview: 'Парсинг маркетплейса завершён без ошибок.',
    time: 'Вчера',
  },
  {
    name: 'Bot поддержки',
    subject: '142 диалога обработано автоматически',
    preview: 'Средняя оценка ответа — 4.8 из 5.',
    time: 'Вчера',
  },
  {
    name: 'CRM Sync',
    subject: 'Синхронизация с amoCRM завершена',
    preview: '312 новых лидов распределены по менеджерам.',
    time: 'Пн',
  },
  {
    name: 'Synapse Presenter',
    subject: 'Презентация «Q3 Pitch Deck» готова',
    preview: 'Сгенерировано 18 слайдов на основе брифа.',
    time: 'Пн',
  },
];

export default function ConsoleMockup() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl"
      >
        {/* Title bar */}
        <div className="h-10 border-b border-white/10 flex items-center px-4 relative">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-white/50">
            Synapse — Автоматизации
          </span>
        </div>

        <div className="grid grid-cols-12 h-[520px]">
          {/* Sidebar */}
          <div className="col-span-3 border-r border-white/10 bg-black/30 p-4 hidden md:block">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black text-xs font-semibold px-3 py-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Новый сценарий
            </button>

            <nav className="mt-6 flex flex-col gap-1">
              {NAV_ITEMS.map(({ icon: Icon, label, count, active }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs ${
                    active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                  {count && <span className="text-white/40">{count}</span>}
                </div>
              ))}
            </nav>

            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-wider text-white/30 px-2.5">Проекты</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {LABELS.map((label) => (
                  <div key={label.name} className="flex items-center gap-2 px-2.5 py-1 text-xs text-white/60">
                    <span className="w-2 h-2 rounded-full" style={{ background: label.color }} />
                    {label.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity list */}
          <div className="col-span-12 md:col-span-4 border-r border-white/10 overflow-y-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 text-xs text-white/40">
              <Search className="w-3.5 h-3.5" />
              Поиск по активностям
            </div>
            {MESSAGES.map((m) => (
              <div
                key={m.subject}
                className={`px-4 py-3 border-b border-white/5 cursor-pointer ${
                  m.active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${m.unread ? 'font-semibold text-white' : 'text-white/70'}`}>
                    {m.name}
                  </span>
                  <span className="text-[11px] text-white/40">{m.time}</span>
                </div>
                <p className={`text-xs mt-0.5 ${m.unread ? 'text-white/90' : 'text-white/50'}`}>{m.subject}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">{m.preview}</p>
              </div>
            ))}
          </div>

          {/* Reader */}
          <div className="hidden md:flex md:col-span-5 flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <div className="flex items-center gap-1">
                <button type="button" className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                  <Reply className="w-3.5 h-3.5 text-white/60" />
                </button>
                <button type="button" className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                  <Forward className="w-3.5 h-3.5 text-white/60" />
                </button>
                <button type="button" className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                  <Archive className="w-3.5 h-3.5 text-white/60" />
                </button>
                <button type="button" className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5 text-white/60" />
                </button>
              </div>
              <button type="button" className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center">
                <MoreHorizontal className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-base font-semibold text-white">Еженедельный дайджест автоматизаций</h3>
              <div className="flex items-center gap-2 mt-3">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center text-[11px] font-semibold text-white">
                  S
                </span>
                <div className="text-xs">
                  <p className="text-white/90 font-medium">Synapse AI</p>
                  <p className="text-white/40">мне · 9:41</p>
                </div>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/50">
                  Продажи
                </span>
              </div>

              <div className="liquid-glass rounded-lg p-3 mt-5 flex gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#A4F4FD' }} />
                <div>
                  <p className="text-xs font-semibold text-white">Сводка от Synapse</p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">
                    Команда закрыла 23 сценария автоматизации, бот обработал 142 диалога, парсер собрал 3 400
                    карточек товаров. Действий не требуется.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/70 leading-relaxed">
                <p>Привет,</p>
                <p>
                  Вот еженедельный дайджест по всем вашим процессам. Неделя была продуктивной — заметный прогресс
                  по цели квартала.
                </p>
                <p>
                  Двадцать три сценария завершены, сто сорок два диалога обработал бот поддержки, парсер собрал
                  более трёх тысяч карточек товаров. Скорость команды продолжает расти.
                </p>
                <p>Дайте знать, если нужна более подробная разбивка по проектам или направлениям.</p>
                <p className="text-white/50">— Команда Synapse</p>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-xs text-white/60">
                <Paperclip className="w-3.5 h-3.5" />
                отчёт-неделя-32.pdf
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
