import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

export default function GymLoader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-4"
      >
        <Dumbbell className="w-12 h-12 text-yellow-400" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-600 font-semibold"
      >
        {message}
      </motion.p>
    </div>
  );
}