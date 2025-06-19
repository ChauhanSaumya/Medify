import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MedifyLogo from '@/components/MedifyLogo';


const NotFoundPage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <MedifyLogo width="w-16" height="h-16" />
      </div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full"
      >
        <AlertTriangle className="w-20 h-20 text-orange-400 mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-3">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 text-base md:text-lg">
          Oops! The page you're looking for doesn't seem to exist. Maybe it was moved, or you typed something wrong.
        </p>
        <Button asChild size="lg" className="creative-gradient text-white font-semibold text-base py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link to="/">
            <Home className="w-5 h-5 mr-2.5" />
            Go Back to Homepage
          </Link>
        </Button>
      </motion.div>
      <p className="mt-12 text-sm text-gray-500">
        If you believe this is an error, please contact support.
      </p>
    </motion.div>
  );
};

export default NotFoundPage;