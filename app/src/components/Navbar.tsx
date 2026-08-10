import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { LogoMark, AppleButton } from './primitives';

const LINKS = ['Решения', 'Тарифы', 'Кейсы', 'Документация', 'Вакансии'];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10"
    >
      <LogoMark />

      <div className="hidden md:flex gap-8">
        {LINKS.map((link, i) => (
          <motion.a
            key={link}
            href="#"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
            className="text-white/70 text-sm font-medium hover:text-white"
          >
            {link}
          </motion.a>
        ))}
      </div>

      <div className="hidden md:block">
        <AppleButton label="Download Synapse" />
      </div>

      <button
        type="button"
        aria-label="Открыть меню"
        className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center"
      >
        <Menu className="w-4 h-4 text-white" />
      </button>
    </motion.nav>
  );
}
