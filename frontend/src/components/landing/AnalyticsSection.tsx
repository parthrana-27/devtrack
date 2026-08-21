import { motion } from 'framer-motion';

export default function AnalyticsSection() {
  return (
    <section id="analytics" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Turn Project Activity<br />Into Clarity.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Live velocity charts, completion rates, and workload distribution.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient glow inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-blue/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              {[
                { label: "Sprint Completion", value: "84%", color: "text-emerald" },
                { label: "Active Issues", value: "23", color: "text-white" },
                { label: "Velocity (pts)", value: "142", color: "text-cyan-blue" }
              ].map((stat, i) => (
                <div key={i} className="bg-graphite/50 border border-white/5 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 h-64">
              <div className="col-span-2 bg-graphite/50 border border-white/5 rounded-xl p-4 flex flex-col">
                <p className="text-xs text-gray-500 font-medium mb-4">Sprint Velocity Trend</p>
                <div className="flex-1 flex items-end justify-between gap-2">
                  {[30, 45, 60, 40, 75, 90, 85].map((h, i) => (
                    <div key={i} className="w-full bg-cyan-blue/10 rounded-t relative group">
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-blue/80 to-electric-violet/80 rounded-t" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-graphite/50 border border-white/5 rounded-xl p-4 flex flex-col">
                <p className="text-xs text-gray-500 font-medium mb-4">Issue Distribution</p>
                <div className="flex-1 flex flex-col gap-3 justify-center">
                  {[
                    { label: 'Backend', w: 'w-3/4', color: 'bg-electric-violet' },
                    { label: 'Frontend', w: 'w-1/2', color: 'bg-cyan-blue' },
                    { label: 'Infra', w: 'w-1/4', color: 'bg-yellow-400' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400">{item.label}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: item.w.replace('w-', '') === '3/4' ? '75%' : item.w.replace('w-', '') === '1/2' ? '50%' : '25%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full ${item.color}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
