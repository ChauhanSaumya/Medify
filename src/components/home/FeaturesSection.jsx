
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Edit } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    { icon: Shield, title: "Emergency Ready", description: "Critical medical info when seconds count." },
    { icon: Smartphone, title: "QR Code Access", description: "Instant access to health profile via any smartphone." },
    { icon: Edit, title: "Printable & Digital", description: "Keep a physical copy or use it from your phone's screen." }
  ];
  return (
    <section id="features" className="-mt-16 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg border border-gray-200/50 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 creative-gradient text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
