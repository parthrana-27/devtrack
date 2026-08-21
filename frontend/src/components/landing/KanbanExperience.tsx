import { motion } from 'framer-motion';

export default function KanbanExperience() {
  const columns = ['Backlog', 'To Do', 'In Progress', 'Code Review', 'Testing', 'Done'];
  
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Your Entire Workflow.<br />At a Glance.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">A drag-and-drop Kanban board that gives teams instant visibility.</p>
        </motion.div>

        <div className="relative">
          {/* Faded edges for the massive board */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 overflow-x-hidden opacity-90 hover:opacity-100 transition-opacity">
            {columns.map((col, index) => (
              <div key={col} className="w-72 shrink-0 bg-charcoal/50 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h4 className="text-sm font-semibold text-gray-300">{col}</h4>
                  <span className="text-xs text-gray-500 bg-obsidian px-2 py-0.5 rounded-full border border-white/5">
                    {index === 2 ? '3' : index === 5 ? '12' : '5'}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Generate 2-3 dummy cards per column */}
                  {[...Array(index === 2 ? 3 : 2)].map((_, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-graphite p-4 rounded-lg border border-white/10 shadow-lg cursor-grab active:cursor-grabbing hover:border-electric-violet/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-gray-400">PAY-{100 + index * 10 + i}</span>
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      </div>
                      <p className="text-sm font-medium mb-4 text-gray-200">
                        {index === 2 ? 'Implement JWT refresh token rotation' : 'Update database connection pooling'}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <span className="text-[10px] uppercase bg-white/5 text-gray-400 px-2 py-1 rounded">Backend</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">5</span>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-blue to-electric-violet" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
