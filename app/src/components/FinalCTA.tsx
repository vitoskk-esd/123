import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { AppleButton } from './primitives';

export default function FinalCTA() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center"
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)',
          }}
        />

        <h2 className="relative text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
          Хватит рутины.
          <br />
          Начните расти.
        </h2>
        <p className="relative mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6]">
          Присоединяйтесь к тысячам основателей, операционных директоров и
          команд, которые относятся к рутине как к инструменту — а не как к
          обязанности.
        </p>
        <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <AppleButton label="Download Synapse" />
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-white/15 text-white text-sm font-medium px-5 py-3 hover:bg-white/5"
          >
            Обсудить с командой
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
