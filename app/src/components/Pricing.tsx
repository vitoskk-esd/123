import { useState } from 'react';
import { PricingNoiseFilter } from './primitives';

type Plan = {
  tier: string;
  price: string;
  yearlyPrice?: string;
  desc: string;
  features: string[];
  pro?: boolean;
};

const PLANS: Plan[] = [
  {
    tier: 'Старт',
    price: 'Бесплатно',
    desc: 'Для команд, которые делают первые шаги в автоматизации с Synapse.',
    features: [
      'До 3 сценариев автоматизации в облаке',
      'Экспорт презентаций до 1080p',
      'Базовые инструменты редактирования',
      'Бесплатные шаблоны и иконки',
      'Доступ через веб и мобильное приложение',
    ],
  },
  {
    tier: 'Бизнес',
    price: '$9,99/мес',
    yearlyPrice: '$99,99/год',
    desc: 'Для фрилансеров и небольших команд, которым нужно больше свободы и гибкости.',
    features: [
      'До 50 сценариев автоматизации в облаке',
      'Экспорт презентаций до 4K',
      'Продвинутый набор инструментов редактирования',
      'Совместная работа команды (до 5 участников)',
      'Доступ к премиум-библиотеке шаблонов',
    ],
  },
  {
    tier: 'Про',
    price: '$19,99/мес',
    yearlyPrice: '$199,99/год',
    desc: 'Для студий, агентств и профессиональных команд, работающих с брендами.',
    features: [
      'Неограниченное количество сценариев',
      'Экспорт до 8K + анимации',
      'Инструменты генерации контента на ИИ',
      'Неограниченное количество участников команды',
      'Кастомизация под бренд',
    ],
    pro: true,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="c3-pricing-section">
      <PricingNoiseFilter />

      <div className="c3-watermark-container">
        <div className="c3-watermark-main">
          <span className="c3-watermark-line-1">Ваша рутина.</span>
          <span className="c3-watermark-line-2">Автоматизирована</span>
        </div>
      </div>

      <div className="c3-grid">
        {PLANS.map((plan) => (
          <div key={plan.tier} className={`c3-card ${plan.pro ? 'c3-card-pro' : ''}`}>
            <p className="c3-tier-small">{plan.tier}</p>
            <p className="c3-tier-large">{yearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}</p>
            <p className="c3-desc">{plan.desc}</p>
            <ul className="c3-list">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span className="c3-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button type="button" className="c3-btn">
              Выбрать план
            </button>
          </div>
        ))}
      </div>

      <div className="c3-toggle-wrap">
        <span className="text-sm text-white/70">Годовая оплата</span>
        <button
          type="button"
          className={`c3-toggle ${yearly ? 'active' : ''}`}
          onClick={() => setYearly((v) => !v)}
          aria-pressed={yearly}
          aria-label="Переключить годовую оплату"
        >
          <span className="c3-toggle-knob" />
        </button>
      </div>
    </section>
  );
}
