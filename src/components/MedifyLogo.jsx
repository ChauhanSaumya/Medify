import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const MedifyLogo = ({ className = '', showTagline = true, logoColorClass, titleColorClass, taglineColorClass }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Medify Logo"
    >
      <motion.div variants={itemVariants} className={`flex items-center ${logoColorClass}`}>
        <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
      </motion.div>
      <div className="flex flex-col">
        <motion.span variants={itemVariants} className={`text-xl sm:text-2xl font-bold tracking-tight leading-tight ${titleColorClass}`}>
          Medify
        </motion.span>
        {showTagline && (
          <motion.span variants={itemVariants} className={`text-[10px] sm:text-xs leading-tight -mt-0.5 ${taglineColorClass}`}>
            Carry Your Health in a QR Code.
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default MedifyLogo;