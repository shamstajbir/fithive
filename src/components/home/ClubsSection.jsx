import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const MarqueeText = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-8">
      <div className="flex animate-marquee-slow">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="text-[15vw] md:text-[20vw] font-black tracking-tighter text-transparent mx-8 inline-block"
            style={{ 
              WebkitTextStroke: '2px #000',
              fontFamily: 'system-ui, sans-serif'
            }}
          >
            FITHIVE
          </span>
        ))}
      </div>
    </div>
  );
};

export default function ClubsSection() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const clubsData = await base44.entities.Club.filter({ 
        is_active: true, 
        show_on_homepage: true 
      }, 'order', 6);
      setClubs(clubsData);
    } catch (error) {
      console.error('Error loading clubs:', error);
    }
  };

  if (clubs.length === 0) return null;

  return (
    <section className="bg-white py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl"
        >
          FitHive has clubs located in Coimbra, Leiria, Lisbon, and Porto. Get to know each one!
        </motion.p>
      </div>

      {/* Clubs Grid - Horizontal Scroll on Mobile */}
      <div className="relative">
        <div className="flex overflow-x-auto pb-8 px-6 gap-4 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:max-w-7xl md:mx-auto md:overflow-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {clubs.map((club, index) => (
            <Link
              key={club.id}
              to={createPageUrl('Clubs')}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-48 md:w-full snap-start group cursor-pointer"
              >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-lg">
                <img
                  src={club.website_image || club.images?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&q=80&fit=crop'}
                  alt={club.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-lg font-bold mb-1">{club.name}</h3>
                  <span className="text-yellow-400 text-sm font-medium">{club.location}</span>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <MarqueeText />

      {/* Choose Your Club */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black tracking-tight mb-8"
        >
          Choose your club
        </motion.h2>
        
        <div className="flex flex-wrap gap-4">
          <Link to={createPageUrl('Clubs')}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-black text-white rounded-full font-medium flex items-center gap-3 group"
            >
              View all Clubs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          
          <Link to={createPageUrl('Contact')}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-black text-black rounded-full font-medium flex items-center gap-3 group"
            >
              Schedule a visit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}