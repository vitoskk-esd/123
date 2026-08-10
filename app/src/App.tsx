import { RootNoiseFilter } from './components/primitives';
import BackgroundLayer from './components/BackgroundLayer';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuBarStrip from './components/MenuBarStrip';
import ConsoleMockup from './components/ConsoleMockup';
import FeatureAutopilot from './components/FeatureAutopilot';
import LogoCloud from './components/LogoCloud';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FinalCTA from './components/FinalCTA';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      <RootNoiseFilter />
      <BackgroundLayer />

      <Navbar />
      <Hero />
      <MenuBarStrip />
      <ConsoleMockup />
      <FeatureAutopilot />
      <LogoCloud />
      <Testimonials />
      <Pricing />
      <FinalCTA />
    </div>
  );
}
