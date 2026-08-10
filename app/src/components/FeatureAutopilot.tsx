import { motion } from 'motion/react';
import { SectionEyebrow } from './primitives';

const CHIPS = ['Автотегирование заявок', 'Отложенные сценарии', 'Тихие уведомления', 'Автоответ в один клик'];

const GROUPS = [
  {
    title: 'Приоритет',
    count: 4,
    color: '#ffffff',
    items: ['Анна Соколова — обзор Q3', 'Давид Лим — согласование договора'],
  },
  {
    title: 'На контроле',
    count: 7,
    color: '#e5e5e5',
    items: ['Маркетинг — ревью дизайна', 'Parser Bot — обсуждение схемы'],
  },
  {
    title: 'Обновления',
    count: 18,
    color: '#a3a3a3',
    items: ['CRM Sync — синхронизация готова', 'GitHub — PR #482 смёржен'],
  },
  {
    title: 'В архиве',
    count: 13,
    color: '#525252',
    items: ['Выплата · Рассылка · Чеки'],
  },
];

export default function FeatureAutopilot() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <SectionEyebrow label="Автопилот" tag="AI-native" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Разбирайте процессы
            <br />в один проход.
          </h2>
          <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
            Synapse читает каждую заявку, понимает намерение и уводит шум прочь
            от сигнала. Занимайтесь тем, что двигает бизнес вперёд, — с
            остальным справится ИИ.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="liquid-glass rounded-2xl p-5">
          <SectionEyebrow label="Сегодня · 42 задачи обработано" />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GROUPS.map((group) => (
              <div key={group.title} className="liquid-glass rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: group.color }} />
                  <p className="text-sm font-medium text-white">{group.title}</p>
                  <span className="text-xs text-white/40">({group.count})</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <li key={item} className="text-xs text-white/50">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
