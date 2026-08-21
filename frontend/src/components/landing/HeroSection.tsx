import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Database, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
              Ship Faster. <br className="hidden md:block" />Track Smarter.
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            DevTrack is a high-performance project management platform built for modern engineering teams — combining intelligent issue tracking, collaborative workflows, and real-time project visibility in one powerful workspace.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="flex items-center gap-2 bg-electric-violet hover:bg-electric-violet/90 text-white px-8 py-4 rounded-full font-medium transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              Start Building Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-medium transition-all w-full sm:w-auto justify-center">
              <Play className="w-4 h-4" />
              Explore Demo
            </button>
          </motion.div>
        </div>

        {/* Floating Dashboard Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent z-20 h-full w-full pointer-events-none" />
          
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative z-10 bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden"
          >
            {/* Dashboard Mockup Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="h-4 w-32 bg-white/5 rounded" />
            </div>

            {/* Kanban Columns Mockup */}
            <div className="grid grid-cols-4 gap-4 opacity-70">
              {[1, 2, 3, 4].map((col) => (
                <div key={col} className="bg-black/20 rounded-xl p-3 min-h-[300px]">
                  <div className="h-4 w-20 bg-white/10 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-20 bg-white/5 rounded border border-white/5" />
                    {col % 2 === 0 && <div className="h-24 bg-white/5 rounded border border-white/5" />}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -right-12 top-20 z-30 bg-graphite border border-electric-violet/30 p-4 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md hidden md:flex"
          >
            <div className="p-2 bg-electric-violet/20 rounded-lg">
              <Zap className="w-5 h-5 text-electric-violet" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Event Stream</p>
              <p className="text-sm font-semibold">Kafka Processing</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            className="absolute -left-12 bottom-32 z-30 bg-graphite border border-cyan-blue/30 p-4 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md hidden md:flex"
          >
            <div className="p-2 bg-cyan-blue/20 rounded-lg">
              <Database className="w-5 h-5 text-cyan-blue" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Cache Layer</p>
              <p className="text-sm font-semibold">Redis Sub-10ms</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
