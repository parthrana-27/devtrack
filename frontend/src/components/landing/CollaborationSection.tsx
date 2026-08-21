import { motion } from 'framer-motion';

export default function CollaborationSection() {
  return (
    <section className="py-24 relative border-y border-white/5 bg-charcoal/20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">One Workspace.<br />Every Conversation.</h2>
          <p className="text-xl text-gray-400 mb-8">
            Keep teams synchronized through contextual comments, activity streams, assignments, and event-driven updates right on the issue.
          </p>
          <ul className="space-y-4">
            {['Rich Text Descriptions', 'Real-Time Activity Feed', 'Inline Mentions & Notifications', 'File Attachments'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-electric-violet" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-obsidian border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Issue Header Mock */}
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400">PAY-142</span>
              <span className="text-xs bg-electric-violet/20 text-electric-violet px-2 py-1 rounded">In Review</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Implement OAuth2 via GitHub</h3>
            <p className="text-sm text-gray-400">The current auth flow requires users to create passwords. We need to support GitHub SSO.</p>
          </div>

          {/* Activity Stream Mock */}
          <div className="p-6 space-y-6 bg-graphite/30">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Activity</div>
            
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-blue/20 shrink-0 border border-cyan-blue/30" />
              <div>
                <p className="text-sm text-gray-300 mb-1"><span className="text-white font-medium">Alex</span> changed status to <span className="text-electric-violet">In Review</span></p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-electric-violet/20 shrink-0 border border-electric-violet/30" />
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-2"><span className="text-white font-medium">Sarah</span> commented</p>
                <div className="bg-charcoal border border-white/10 p-3 rounded-lg text-sm text-gray-300">
                  <span className="text-cyan-blue font-medium">@alex</span> API integration is ready for review. I've attached the Postman collection.
                </div>
                <p className="text-xs text-gray-500 mt-2">1 hour ago</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
