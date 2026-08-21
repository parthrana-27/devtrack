import { motion } from 'framer-motion';

export default function SocialProof() {
  const testimonials = [
    {
      quote: "The Kafka-driven event stream means our team never has to refresh the board. Issue states and comments sync instantly across 40 engineers.",
      role: "Lead Engineer",
      metrics: "Reduced context switching by 40%"
    },
    {
      quote: "Finally a project management tool that feels like it was built for developers. Fast, minimal, and doesn't get in the way of shipping code.",
      role: "CTO",
      metrics: "Increased sprint velocity"
    },
    {
      quote: "The Redis caching layer makes fetching project boards instantaneous. It's the fastest Jira alternative we've ever evaluated.",
      role: "Staff Platform Engineer",
      metrics: "Sub-100ms load times"
    }
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-charcoal/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Designed for Teams That Ship.</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-obsidian border border-white/5 p-8 rounded-2xl flex flex-col"
            >
              <div className="mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-electric-violet" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-8 flex-1">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-white">{t.role}</p>
                <p className="text-sm text-cyan-blue font-medium mt-1">{t.metrics}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
