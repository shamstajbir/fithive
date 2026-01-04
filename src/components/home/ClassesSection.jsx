import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const MarqueeText = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-4 bg-yellow-400">
      <div className="flex animate-marquee-fast">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="text-6xl md:text-8xl font-black tracking-tighter text-black mx-8 inline-block"
          >
            CLASSES
          </span>
        ))}
      </div>
    </div>
  );
};

export default function ClassesSection() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const classesData = await base44.entities.Class.filter({ 
        is_active: true, 
        show_on_homepage: true 
      }, 'order', 4);
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  if (classes.length === 0) return null;

  return (
    <section className="bg-white">
      {/* Marquee Header */}
      <MarqueeText />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-16"
        >
          The most exciting classes, created by top instructors. No matter your goal, we can make it happen.
        </motion.p>

        {/* Classes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {classes.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-xl">
                <img
                  src={classItem.website_image || classItem.image || 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&h=900&q=80&fit=crop'}
                  alt={classItem.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-yellow-400 text-xs md:text-sm tracking-wider mb-1 block uppercase font-bold">
                    {classItem.category}
                  </span>
                  <h3 className="text-white text-xl md:text-3xl font-black">
                    {classItem.name}
                  </h3>
                </div>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
                >
                  <ArrowUpRight className="w-6 h-6 text-black" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}