import { motion } from 'framer-motion';
import { Layers, Database, Zap, Shield } from 'lucide-react';

export default function ArchitectureShowcase() {
  return (
    <section id="architecture" className="py-24 relative border-y border-white/5 bg-gradient-to-b from-transparent to-electric-violet/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Built Like Infrastructure.<br />Designed Like a Product.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Designed around scalability, security, performance, and maintainability.</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Pipeline */}
          <div className="flex flex-col items-center gap-8 relative z-10">
            <ArchitectureNode 
              title="React + Vite" 
              subtitle="Frontend Application" 
              icon={<Layers className="text-cyan-blue" />}
              color="border-cyan-blue/30 bg-cyan-blue/10"
            />
            
            <div className="h-16 w-px bg-gradient-to-b from-cyan-blue/50 to-electric-violet/50 relative">
              <motion.div 
                animate={{ y: [0, 64] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-blue shadow-[0_0_10px_#22D3EE]" 
              />
            </div>

            <ArchitectureNode 
              title="Spring Boot REST API" 
              subtitle="Core Backend Services" 
              icon={<Zap className="text-electric-violet" />}
              color="border-electric-violet/30 bg-electric-violet/10"
            />

            <div className="h-16 w-px bg-gradient-to-b from-electric-violet/50 to-emerald/50 relative">
              <motion.div 
                animate={{ y: [0, 64] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-electric-violet shadow-[0_0_10px_#8B5CF6]" 
              />
            </div>

            <ArchitectureNode 
              title="PostgreSQL" 
              subtitle="Persistent Storage" 
              icon={<Database className="text-emerald" />}
              color="border-emerald/30 bg-emerald/10"
            />
          </div>

          {/* Side Infrastructure */}
          <div className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 w-full h-full pointer-events-none">
            {/* Redis */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute left-0 top-[30%] pointer-events-auto"
            >
              <div className="bg-charcoal border border-white/10 p-4 rounded-xl shadow-xl w-48 group hover:border-red-500/50 transition-colors">
                <p className="font-semibold text-red-400 mb-1">Redis</p>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">High-Speed Caching</p>
                <div className="mt-2 text-[10px] text-gray-500 hidden group-hover:block">
                  → Reduced DB load<br/>→ Low-latency access
                </div>
              </div>
            </motion.div>

            {/* Kafka */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute right-0 top-[45%] pointer-events-auto"
            >
              <div className="bg-charcoal border border-white/10 p-4 rounded-xl shadow-xl w-48 group hover:border-blue-500/50 transition-colors">
                <p className="font-semibold text-blue-400 mb-1">Apache Kafka</p>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Event-Driven Messaging</p>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute left-10 top-[65%] pointer-events-auto"
            >
              <div className="bg-charcoal border border-white/10 p-4 rounded-xl shadow-xl w-48 group hover:border-yellow-500/50 transition-colors">
                <p className="font-semibold text-yellow-400 mb-1 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> JWT Auth
                </p>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Secure Authentication</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchitectureNode({ title, subtitle, icon, color }: { title: string, subtitle: string, icon: React.ReactNode, color: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`bg-charcoal border ${color} p-6 rounded-2xl w-full max-w-sm flex items-center gap-4 shadow-xl backdrop-blur-md`}
    >
      <div className="p-3 bg-obsidian rounded-xl border border-white/5 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    </motion.div>
  );
}
