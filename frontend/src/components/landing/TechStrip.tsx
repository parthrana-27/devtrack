import { motion } from 'framer-motion';

export default function TechStrip() {
  const technologies = [
    "Java", "Spring Boot", "PostgreSQL", "Redis", "Apache Kafka", "React", "Vite", "Tailwind CSS"
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-charcoal/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8">
          Built with modern engineering infrastructure
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-gray-400 font-medium text-sm hover:text-white transition-colors cursor-default"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
