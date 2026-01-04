import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function PromoPopup() {
  const [banner, setBanner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Delay popup appearance by 2 seconds
    const timer = setTimeout(() => {
      loadBanner();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const loadBanner = async () => {
    try {
      const banners = await base44.entities.PromoBanner.filter({ 
        banner_type: 'popup_modal',
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
          setShowPopup(true);
        }
      }
    } catch (error) {
      console.error('Error loading popup banner:', error);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleClick = () => {
    if (banner?.link_url) {
      window.open(banner.link_url, '_blank');
      handleClose();
    }
  };

  if (!banner) return null;

  return (
    <Dialog open={showPopup} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl p-0 bg-transparent border-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative"
        >
          <button
            onClick={handleClose}
            type="button"
            className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 z-50 transition-all shadow-2xl"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-full flex items-center justify-center bg-white rounded-lg overflow-hidden">
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
                className={`w-full h-auto max-h-[80vh] object-contain ${banner.link_url ? 'cursor-pointer' : ''}`}
                onClick={handleClick}
              />
            </picture>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}