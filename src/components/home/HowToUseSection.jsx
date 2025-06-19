
import React from 'react';
import { motion } from 'framer-motion';

const HowToUseSection = () => (
  <motion.section 
    id="how-to-use"
    className="mt-16 bg-white py-16 sm:py-24"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <motion.div 
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900"
          >
            Create Your Card in 4 Simple Steps
          </motion.h2>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.1 } } }}
            className="mt-4 text-lg text-gray-600"
          >
            From data entry to a life-saving tool in minutes.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Fill The Form", desc: "Enter your medical details securely." },
            { step: "2", title: "Live Preview", desc: "See your card update in real-time." },
            { step: "3", title: "Download Card", desc: "Save the QR code to your device." },
            { step: "4", title: "Print & Carry", desc: "Have it ready for any emergency." }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              className="text-center group"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              <div 
                className="relative w-16 h-16 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 transition-colors duration-300 group-hover:bg-green-500 group-hover:text-white"
              >
                {item.step}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </motion.section>
);

export default HowToUseSection;
