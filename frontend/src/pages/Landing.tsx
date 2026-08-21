import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import TechStrip from '../components/landing/TechStrip';
import CoreFeatures from '../components/landing/CoreFeatures';
import ArchitectureShowcase from '../components/landing/ArchitectureShowcase';
import KanbanExperience from '../components/landing/KanbanExperience';
import CollaborationSection from '../components/landing/CollaborationSection';
import PerformanceSection from '../components/landing/PerformanceSection';
import SecuritySection from '../components/landing/SecuritySection';
import AnalyticsSection from '../components/landing/AnalyticsSection';
import SocialProof from '../components/landing/SocialProof';
import FinalCta from '../components/landing/FinalCta';

export default function Landing() {
  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-electric-violet/30 overflow-hidden relative font-sans">
      {/* Abstract Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-violet/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-blue/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      <div className="relative z-10 flex flex-col">
        <Navbar />
        <main>
          <HeroSection />
          <TechStrip />
          <CoreFeatures />
          <ArchitectureShowcase />
          <KanbanExperience />
          <CollaborationSection />
          <PerformanceSection />
          <SecuritySection />
          <AnalyticsSection />
          <SocialProof />
          <FinalCta />
        </main>
      </div>
    </div>
  );
}
