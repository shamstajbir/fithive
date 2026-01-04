import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calculator, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BMICalculator from '@/components/BMICalculator';
import { base44 } from '@/api/base44Client';

export default function Header({ currentPageName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBMI, setShowBMI] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    loadSiteSettings();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadSiteSettings = async () => {
    try {
      const settings = await base44.entities.SiteSettings.filter({ setting_key: 'main' });
      if (settings.length > 0) {
        setSiteSettings(settings[0]);
        const sortedNav = (settings[0].navbar_pages || getDefaultNav()).sort((a, b) => a.order - b.order);
        setNavLinks(sortedNav);
      } else {
        setNavLinks(getDefaultNav());
      }
    } catch (error) {
      setNavLinks(getDefaultNav());
    }
  };

  const getDefaultNav = () => [
    { page_name: 'Clubs', label: 'Clubs', order: 1 },
    { page_name: 'Classes', label: 'Classes', order: 2 },
    { page_name: 'Packages', label: 'Packages', order: 3 },
    { page_name: 'App', label: 'App', order: 4 },
    { page_name: 'About', label: 'About', order: 5 }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          currentPageName === 'UserDashboard' ? 'bg-black py-4' :
          scrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to={createPageUrl('Home')}
            className="text-2xl font-black tracking-tight text-yellow-400"
          >
            FITHIVE
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <button
              onClick={() => setShowBMI(true)}
              className="flex items-center gap-1 lg:gap-2 text-white text-xs lg:text-sm font-medium tracking-wider hover:text-yellow-400 transition-colors"
            >
              <Calculator className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden lg:inline">BMI CALCULATOR</span>
              <span className="lg:hidden">BMI</span>
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.page_name}
                to={createPageUrl(link.page_name)}
                className="text-white text-xs lg:text-sm font-medium tracking-wider hover:text-yellow-400 transition-colors"
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link to={createPageUrl('MyBookings')}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 lg:px-6 py-2 lg:py-3 border border-white text-white rounded-full text-xs lg:text-sm font-bold tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                MY BOOKINGS
              </motion.button>
            </Link>
            <a href="https://mubafitness.com/" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 lg:px-6 py-2 lg:py-3 bg-yellow-400 text-black rounded-full text-xs lg:text-sm font-bold tracking-wider hover:bg-yellow-500 transition-colors flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                SHOP
              </motion.button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black z-40 pt-24"
          >
            <div className="flex flex-col items-center gap-8 p-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.page_name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={createPageUrl(link.page_name)}
                    onClick={() => setIsOpen(false)}
                    className="text-white text-3xl font-bold tracking-wider hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setShowBMI(true);
                  setIsOpen(false);
                }}
                className="mt-8 px-8 py-4 border-2 border-white text-white rounded-full text-lg font-bold tracking-wider"
              >
                BMI CALCULATOR
              </motion.button>
              <Link to={createPageUrl('MyBookings')}>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-bold tracking-wider"
                >
                  MY BOOKINGS
                </motion.button>
              </Link>
              <a href="https://mubafitness.com/" target="_blank" rel="noopener noreferrer">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-4 bg-yellow-400 text-black rounded-full text-lg font-bold tracking-wider flex items-center gap-2 justify-center"
                >
                  <ShoppingBag className="w-5 h-5" />
                  SHOP
                </motion.button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BMI Calculator Modal */}
      <BMICalculator isOpen={showBMI} onClose={() => setShowBMI(false)} />
    </>
  );
}