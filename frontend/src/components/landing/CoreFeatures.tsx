import { motion } from 'framer-motion';
import { CheckCircle2, LayoutDashboard, Users, LineChart } from 'lucide-react';

export default function CoreFeatures() {
  const features = [
    {
      title: "Smart Issue Tracking",
      description: "Create, assign, prioritize, label, search, and track issues through a powerful workflow designed for engineering teams.",
      icon: <CheckCircle2 className="w-6 h-6 text-electric-violet" />,
      visual: (
        <div className="bg-graphite border border-white/5 p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono text-gray-400">PAY-142</span>
            <span className="text-[10px] uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Critical</span>
          </div>
          <p className="text-sm font-medium mb-4">Fix Redis connection pool exhaustion on high load</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-electric-violet/30" />
              <span>Backend</span>
            </div>
            <span>8 pts</span>
          </div>
        </div>
      )
    },
    {
      title: "Interactive Kanban",
      description: "A drag-and-drop Kanban board that gives teams instant visibility into project progress.",
      icon: <LayoutDashboard className="w-6 h-6 text-cyan-blue" />,
      visual: (
        <div className="grid grid-cols-3 gap-2">
          {['To Do', 'In Progress', 'Done'].map((col, i) => (
            <div key={col} className="bg-graphite border border-white/5 p-2 rounded-lg">
              <p className="text-[10px] text-gray-500 mb-2 font-medium">{col}</p>
              <div className="h-10 bg-white/5 rounded mb-1" />
              {i === 1 && <div className="h-12 bg-electric-violet/20 border border-electric-violet/30 rounded" />}
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Real-Time Collaboration",
      description: "Keep teams synchronized through comments, activity streams, assignments, notifications, and event-driven updates.",
      icon: <Users className="w-6 h-6 text-emerald" />,
      visual: (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-blue/30 shrink-0" />
            <div className="bg-graphite border border-white/5 p-3 rounded-lg rounded-tl-none flex-1">
              <p className="text-xs text-gray-400 mb-1"><span className="text-white font-medium">Alex</span> commented</p>
              <p className="text-xs">API integration is ready for review.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-electric-violet/30 shrink-0" />
            <div className="bg-graphite border border-white/5 p-3 rounded-lg rounded-tl-none flex-1">
              <p className="text-xs text-gray-400 mb-1"><span className="text-white font-medium">Sarah</span> reviewed</p>
              <p className="text-xs">Looks solid, merging now.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Project Intelligence",
      description: "Transform project activity into actionable insights with sprint velocity, issue distribution, workload, and project health analytics.",
      icon: <LineChart className="w-6 h-6 text-blue-400" />,
      visual: (
        <div className="bg-graphite border border-white/5 p-4 rounded-lg h-full flex flex-col justify-end gap-2">
          <div className="flex items-end justify-between h-20 gap-2">
            {[40, 70, 45, 90, 65, 80].map((h, i) => (
              <div key={i} className="w-full bg-electric-violet/20 rounded-t" style={{ height: `${h}%` }}>
                <div className="w-full bg-electric-violet/60 rounded-t" style={{ height: '40%' }} />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Engineered for Velocity.</h2>
          <p className="text-xl text-gray-400 max-w-2xl">Everything you need to ship software faster, without the bloated enterprise complexity.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-charcoal/50 border border-white/5 p-8 rounded-2xl group hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {feature.description}
              </p>
              <div className="bg-obsidian/50 rounded-xl p-6 min-h-[160px] border border-white/5 group-hover:border-white/10 transition-colors">
                {feature.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
