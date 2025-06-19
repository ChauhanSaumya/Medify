
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => (
  <section className="relative overflow-hidden pt-20">
    <div className="absolute inset-0 creative-gradient opacity-80"></div>
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%202000%201500%22%3E%3Cdefs%3E%3Cpath%20fill%3D%22none%22%20stroke-width%3D%222.5%22%20stroke-opacity%3D%220.1%22%20id%3D%22a%22%20d%3D%22M0.74,1500.21l1499.64-0.12L1500,0.24l-0.08,1499.73l-0.1,0.24L0.74,1500.21z%22%20stroke%3D%22%23FFFFFF%22/%3E%3C/defs%3E%3Cg%20transform%3D%22translate(0,0)%22%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%20y%3D%22-1500%22/%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%20y%3D%220%22/%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%20y%3D%221500%22/%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%20y%3D%223000%22/%3E%3C/g%3E%3Cg%20transform%3D%22translate(1500,0)%22%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%20y%3D%22-1500%22/%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%20y%3D%220%22/%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%20y%3D%221500%22/%3E%3Cuse%20xlink%3Ahref%3D%22%23a%22%20y%3D%223000%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Essential Health Card
        </motion.h1>
        <motion.p 
          className="mt-6 text-lg md:text-xl text-white/90 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Instantly create a secure, scannable health card for emergencies and regular doctor visits. All your vital health information, accessible when it matters most.
        </motion.p>
    </div>
  </section>
);

export default HeroSection;
