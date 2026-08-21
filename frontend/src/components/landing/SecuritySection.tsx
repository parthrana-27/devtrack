import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Key, Users } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section id="security" className="py-24 relative overflow-hidden border-y border-white/5 bg-charcoal/20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-violet/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Projects.<br />Your Permissions.</h2>
          <p className="text-xl text-gray-400 mb-8">
            DevTrack integrates enterprise-grade security using JWT authentication and Spring Security, ensuring complete data isolation and Role-Based Access Control.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: <Key className="w-5 h-5 text-electric-violet" />, title: "JWT Auth" },
              { icon: <ShieldCheck className="w-5 h-5 text-emerald" />, title: "Spring Security" },
              { icon: <Users className="w-5 h-5 text-cyan-blue" />, title: "RBAC Controls" },
              { icon: <Lock className="w-5 h-5 text-yellow-400" />, title: "Data Isolation" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-300">{item.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-graphite border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Visual hierarchy of permissions */}
            <div className="space-y-4">
              {[
                { role: "ORGANIZATION OWNER", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", width: "w-full" },
                { role: "PROJECT MANAGER", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", width: "w-11/12" },
                { role: "DEVELOPER", color: "text-cyan-blue", bg: "bg-cyan-blue/10", border: "border-cyan-blue/20", width: "w-4/5" },
                { role: "TESTER", color: "text-emerald", bg: "bg-emerald/10", border: "border-emerald/20", width: "w-3/4" },
                { role: "GUEST", color: "text-gray-400", bg: "bg-white/5", border: "border-white/10", width: "w-1/2" },
              ].map((role, i) => (
                <motion.div 
                  key={role.role}
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: "100%", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex"
                >
                  <div className={`${role.width} ${role.bg} ${role.border} border p-3 rounded-lg flex items-center justify-between`}>
                    <span className={`text-xs font-bold tracking-wider ${role.color}`}>{role.role}</span>
                    <Lock className={`w-4 h-4 ${role.color} opacity-50`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
