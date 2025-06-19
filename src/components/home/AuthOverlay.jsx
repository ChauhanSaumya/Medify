
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import MedifyLogo from '@/components/MedifyLogo';
import { LogIn } from 'lucide-react';

const AuthOverlay = ({ navigate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center"
    >
      <MedifyLogo className="justify-center mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Unlock Your Health Card</h2>
      <p className="text-gray-600 mb-6">
        Please log in or sign up to create, manage, and securely store your Medify health card.
      </p>
      <Button 
        size="lg" 
        className="w-full creative-gradient text-white text-lg py-3"
        onClick={() => navigate('/auth')}
      >
        <LogIn className="w-5 h-5 mr-2" />
        Login / Sign Up
      </Button>
    </motion.div>
  </motion.div>
);

export default AuthOverlay;
