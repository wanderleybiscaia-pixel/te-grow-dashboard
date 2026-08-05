import { useState } from 'react';
import { motion } from 'framer-motion';

function LoadingSpinner({ message = 'Processando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="relative w-16 h-16 mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent" />
      </motion.div>
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
