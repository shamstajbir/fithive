import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PromoTopBar() {
  const [banner, setBanner] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(loadBanner, 100);
    return () => clearTimeout(timer);
  }, []);

  const loadBanner = async () => {
    try {
      const banners = await base44.entities.PromoBanner.filter({ 
        banner_type: 'top_bar',
        is_active: true 
      });

      if (banners.length > 0) {
        const activeBanner = banners.find(b => {
          const now = new Date();
          const start = b.start_date ? new Date(b.start_date) : null;
          const end = b.end_date ? new Date(b.end_date) : null;
          
          if (start && now < start) return false;
          if (end && now > end) return false;
          return true;
        });

        if (activeBanner) {
          setBanner(activeBanner);
        }
      }
    } catch (error) {
      console.error('Error loading top bar banner:', error);
    }
  };

  const handleClick = () => {
    if (banner?.link_url) {
      window.open(banner.link_url, '_blank');
    }
  };

  const handleDismiss = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDismissed(true);
    setTimeout(() => setBanner(null), 300);
  };

  if (!banner || dismissed) return null;

  return (
    <AnimatePresence>
      {banner && !dismissed && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 relative shadow-xl"
          style={{ willChange: 'transform' }}
        >
          <div className="w-full relative">
            <picture>
              {banner.mobile_image_url && (
                <source media="(max-width: 640px)" srcSet={banner.mobile_image_url} />
              )}
              {banner.tablet_image_url && (
                <source media="(min-width: 641px) and (max-width: 1024px)" srcSet={banner.tablet_image_url} />
              )}
              {banner.desktop_image_url && (
                <source media="(min-width: 1920px)" srcSet={banner.desktop_image_url} />
              )}
              <img
                src={banner.image_url}
                alt="Promo"
                className={`w-full h-auto object-contain ${banner.link_url ? 'cursor-pointer' : ''}`}
                style={{ maxHeight: '100px', display: 'block' }}
                onClick={handleClick}
              />
            </picture>
            <button
              onClick={handleDismiss}
              type="button"
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all shadow-2xl"
              aria-label="Close banner"
              style={{ zIndex: 100 }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}