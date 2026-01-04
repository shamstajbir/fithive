import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

const defaultSlides = [
  {
    title: 'FITHIVE PORTO',
    subtitle: "IT'S OPEN!",
    media_type: 'image',
    desktop_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80&fit=crop',
    cta_text: 'DISCOVER THE CLUB',
    cta_link: '/clubs'
  },
  {
    title: 'FITHIVE LISBON',
    subtitle: 'NOW OPEN',
    media_type: 'image',
    desktop_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1920&q=80&fit=crop',
    cta_text: 'DISCOVER THE CLUB',
    cta_link: '/clubs'
  },
  {
    title: 'TRAIN EVERYDAY',
    subtitle: 'JOIN NOW',
    media_type: 'image',
    desktop_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80&fit=crop',
    cta_text: 'DISCOVER THE CLUB',
    cta_link: '/clubs'
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const loadBanners = async () => {
    try {
      const banners = await base44.entities.SiteBanner.filter({ is_active: true }, 'position');
      if (banners.length > 0) {
        setSlides(banners);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  };

  const getMediaUrl = (banner) => {
    const width = window.innerWidth;
    if (width >= 1920 && banner.desktop_url) return banner.desktop_url;
    if (width >= 1024 && banner.laptop_url) return banner.laptop_url;
    if (width >= 768 && banner.tablet_url) return banner.tablet_url;
    if (banner.mobile_url) return banner.mobile_url;
    return banner.desktop_url || banner.laptop_url || banner.tablet_url || banner.mobile_url;
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {slides[currentSlide].media_type === 'video' ? (
            <video
              src={getMediaUrl(slides[currentSlide])}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <picture>
              {slides[currentSlide].mobile_url && (
                <source media="(max-width: 640px)" srcSet={slides[currentSlide].mobile_url} />
              )}
              {slides[currentSlide].tablet_url && (
                <source media="(min-width: 641px) and (max-width: 1024px)" srcSet={slides[currentSlide].tablet_url} />
              )}
              {slides[currentSlide].desktop_url && (
                <source media="(min-width: 1920px)" srcSet={slides[currentSlide].desktop_url} />
              )}
              <img
                src={slides[currentSlide].desktop_url || slides[currentSlide].laptop_url || slides[currentSlide].tablet_url || slides[currentSlide].mobile_url}
                alt={slides[currentSlide].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </picture>
          )}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>



      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-yellow-400 text-xs md:text-sm tracking-[0.3em] mb-4 uppercase"
          >
            {slides[currentSlide].subtitle || 'FITNESS'}
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white text-4xl md:text-6xl lg:text-8xl font-black tracking-tight text-center mb-2"
          >
            {slides[currentSlide].title}
          </motion.h1>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/70 text-lg md:text-xl mb-8 text-center"
        >
          FIND OUT MORE
        </motion.p>

        {slides[currentSlide].cta_text && slides[currentSlide].cta_link && (
          <Link to={slides[currentSlide].cta_link}>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/50 rounded-full text-white text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 group"
            >
              {slides[currentSlide].cta_text}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        )}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1 transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6 z-30">
        <button className="flex flex-col gap-1.5 p-2">
          <span className="w-8 h-0.5 bg-white"></span>
          <span className="w-8 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
        
        <div className="text-yellow-400 font-black text-2xl tracking-tight">
          FITHIVE
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-yellow-400 rounded-full"
              style={{ height: `${8 + Math.sin(i * 0.8) * 8}px` }}
            />
          ))}
        </div>
      </nav>

      {/* Location Badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-20 left-6 z-30"
      >
        <div className="px-6 py-2 border border-white/30 rounded-full text-white text-xs tracking-wider">
          BOAVISTA
        </div>
      </motion.div>
    </section>
  );
}