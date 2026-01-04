import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Send, Dumbbell, Utensils, TrendingUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [footerLinks, setFooterLinks] = useState([]);

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const settings = await base44.entities.SiteSettings.filter({ setting_key: 'main' });
      if (settings.length > 0) {
        setSiteSettings(settings[0]);
        const sortedFooter = (settings[0].footer_pages || getDefaultFooter()).sort((a, b) => a.order - b.order);
        setFooterLinks(sortedFooter);
      } else {
        setFooterLinks(getDefaultFooter());
      }
    } catch (error) {
      setFooterLinks(getDefaultFooter());
    }
  };

  const getDefaultFooter = () => [
    { page_name: 'Clubs', label: 'Our Clubs', order: 1 },
    { page_name: 'Classes', label: 'Classes', order: 2 },
    { page_name: 'Packages', label: 'Packages', order: 3 },
    { page_name: 'Blogs', label: 'Blog', order: 4 },
    { page_name: 'About', label: 'About Us', order: 5 },
    { page_name: 'ClassSchedule', label: 'Class Schedule', order: 6 }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-black mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get fitness tips, exclusive offers, and updates delivered to your inbox</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 md:w-80"
              />
              <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                {subscribed ? '✓ Subscribed!' : <><Send className="w-4 h-4 mr-2" /> Subscribe</>}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div>
            <div className="text-3xl font-black tracking-tight text-yellow-400 mb-4">
              FITHIVE
            </div>
            <p className="text-gray-400 mb-6">
              Your premier fitness destination World Wide. Transform your body, elevate your mind.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.page_name}>
                  <Link to={createPageUrl(link.page_name)} className="text-gray-400 hover:text-yellow-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h3 className="text-lg font-bold mb-4">AI Tools</h3>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('WorkoutPlanner')} className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Workout Planner
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('MealPlanner')} className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Meal Planner
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('ProgressTracker')} className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Progress Tracker
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Challenges')} className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Challenges
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('Contact')} className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('FAQs')} className="text-gray-400 hover:text-yellow-400 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('PrivacyPolicy')} className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('TermsOfService')} className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Mirpur DOHS, Pallabi<br />Dhaka 1216, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+8801341869125</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">contact@geekssort.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2025 FitHive. All rights reserved.</p>
            <p>Developed by <a href="https://geekssort.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors">GeekSSort</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}