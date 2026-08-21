import { motion } from 'framer-motion';

export default function PerformanceSection() {
  const metrics = [
    { value: "99.9%", label: "API Availability" },
    { value: "<10ms", label: "Cached Reads via Redis" },
    { value: "10K+", label: "Events Processed / Sec" },
    { value: "24/7", label: "Project Visibility" }
  ];

  return (
    <section className="py-24 relative bg-obsidian">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2">
                {metric.value}
              </h3>
              <p className="text-sm md:text-base text-gray-400 font-medium">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
