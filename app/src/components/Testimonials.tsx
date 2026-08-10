const QUOTES = [
  {
    quote:
      'Synapse освободил четыре часа в неделю для всей нашей команды. Он читает процессы так, будто автоматизация будущего уже наступила.',
    name: 'Полина Ветрова',
    role: 'Group Product Manager',
    company: 'NORTHLANE',
  },
  {
    quote:
      'Один только автопилот заявок изменил то, как мы обрабатываем обращения. Не представляю, как мы раньше жили без него.',
    name: 'Дмитрий Раевский',
    role: 'Senior Engineering Program Manager',
    company: 'KESTREL',
  },
  {
    quote:
      'Автопилот, который правда понимает контекст. Команда перестала бояться утра понедельника — сценарии уже всё сделали.',
    name: 'Марта Линдквист',
    role: 'Engineering Manager',
    company: 'ORBICA',
  },
];

export default function Testimonials() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
      <div className="grid md:grid-cols-3 gap-6">
        {QUOTES.map((t) => (
          <figure key={t.name} className="liquid-glass rounded-2xl p-6">
            <blockquote className="text-sm text-white/80 leading-[1.6]">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-6 pt-5 border-t border-white/10">
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="text-xs text-white/50">{t.role}</p>
              <p className="text-xs text-white font-semibold tracking-wide uppercase">{t.company}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
