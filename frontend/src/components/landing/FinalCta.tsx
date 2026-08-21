import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCta() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Immersive glowing background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-electric-violet/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute w-full h-full bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Stop Managing Work.<br />Start Shipping It.
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Bring your projects, issues, teams, and workflows into one high-performance workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/login" className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet/90 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center shadow-[0_0_30px_rgba(139,92,246,0.4)]">
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-charcoal hover:bg-charcoal/80 border border-white/10 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:border-white/20 w-full sm:w-auto justify-center">
              View GitHub
            </a>
          </div>
        </motion.div>
      </div>
      
      {/* Simple Footer */}
      <div className="absolute bottom-0 w-full border-t border-white/5 py-8 mt-24 text-center text-sm text-gray-600">
        <p>© 2026 DevTrack. Designed for developers.</p>
      </div>
    </section>
  );
}
