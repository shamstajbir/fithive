import React from 'react';
import { motion } from 'framer-motion';

const amenities = [
  'Heated Indoor Swimming Pool',
  'Sauna, Turkish Bath and Jacuzzi',
  'Weight and cardio room',
  'Private Pilates Studio',
  'Group Classes',
];

export default function AmenitiesSection() {
  return (
    <section className="bg-black text-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Title */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-light mb-4"
            >
              What you can find at FitHive Clubs
            </motion.h2>
          </div>

          {/* Right - Amenities List */}
          <div>
            <ul className="space-y-4">
              {amenities.map((amenity, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 text-lg md:text-xl"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                  {amenity}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Big Text */}
        <div className="mt-24 overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <motion.span
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-5xl md:text-8xl lg:text-9xl font-black text-yellow-400"
            >
              Fitness
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="text-5xl md:text-8xl lg:text-9xl font-light text-white/20"
            >
              Go
            </motion.span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 -mt-4">
            <motion.span
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="text-5xl md:text-8xl lg:text-9xl font-light text-white/20"
            >
              Strong
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
              className="text-5xl md:text-8xl lg:text-9xl font-black text-yellow-400"
            >
              Get
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}