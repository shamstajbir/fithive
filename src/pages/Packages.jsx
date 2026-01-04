import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GymLoader from '@/components/GymLoader';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const packagesData = await base44.entities.Package.filter({ is_active: true }, 'order', 20);
      setPackages(packagesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading packages:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <GymLoader message="Loading packages..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero */}
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">Choose Your Package</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Build your perfect fitness plan with flexible pricing
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {packages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No packages available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`relative rounded-3xl p-8 transition-all duration-300 ${
                    pkg.is_popular
                      ? 'bg-gradient-to-br from-black via-gray-900 to-black text-white shadow-2xl scale-105 border-2 border-yellow-400'
                      : 'bg-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {pkg.is_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-6 py-2 bg-yellow-400 text-black text-xs font-black rounded-full flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className={`text-3xl font-black mb-2 ${pkg.is_popular ? 'text-white' : 'text-gray-900'}`}>
                      {pkg.name}
                    </h3>
                    {pkg.description && (
                      <p className={`text-lg ${pkg.is_popular ? 'text-gray-300' : 'text-gray-600'}`}>
                        {pkg.description}
                      </p>
                    )}
                  </div>

                  {pkg.features?.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {pkg.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            pkg.is_popular ? 'bg-yellow-400' : 'bg-gray-800'
                          }`}>
                            <Check className={`w-4 h-4 ${pkg.is_popular ? 'text-black' : 'text-white'}`} />
                          </div>
                          <span className={`text-sm font-medium ${pkg.is_popular ? 'text-white' : 'text-gray-900'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {pkg.add_ons?.length > 0 && (
                    <div className="mb-6 pt-6 border-t border-gray-200">
                      <h4 className={`font-bold text-sm mb-3 ${pkg.is_popular ? 'text-gray-300' : 'text-gray-700'}`}>
                        Available Add-ons:
                      </h4>
                      <div className="space-y-2">
                        {pkg.add_ons.slice(0, 3).map((addon, i) => (
                          <div key={i} className={`text-xs ${pkg.is_popular ? 'text-gray-400' : 'text-gray-600'}`}>
                            + {addon.name} (€{addon.price}/mo)
                          </div>
                        ))}
                        {pkg.add_ons.length > 3 && (
                          <div className={`text-xs ${pkg.is_popular ? 'text-gray-400' : 'text-gray-600'}`}>
                            + {pkg.add_ons.length - 3} more add-ons
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={`mb-6 pt-6 border-t ${pkg.is_popular ? 'border-yellow-400/30' : 'border-gray-200'}`}>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-black ${pkg.is_popular ? 'text-yellow-400' : 'text-gray-900'}`}>
                        €{pkg.price}
                      </span>
                      <span className={`text-lg ${pkg.is_popular ? 'text-gray-400' : 'text-gray-500'}`}>
                        /{pkg.duration}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={async () => {
                      await base44.integrations.Core.SendEmail({
                        from_name: 'FitHive',
                        to: 'baizidikhan@gmail.com',
                        subject: '💪 Package Interest - FitHive',
                        body: `
                          <h2>New Package Interest</h2>
                          <p>A user showed interest in the following package:</p>
                          <p><strong>Package:</strong> ${pkg.name}</p>
                          <p><strong>Price:</strong> €${pkg.price}/${pkg.duration}</p>
                          <p><strong>Description:</strong> ${pkg.description || 'N/A'}</p>
                          <hr>
                          <p><small>Time: ${new Date().toLocaleString()}</small></p>
                          <p><small>Note: User will be redirected to Contact page</small></p>
                        `
                      });
                      window.location.href = createPageUrl('Contact');
                    }}
                    className={`w-full py-6 text-lg font-bold ${
                      pkg.is_popular 
                        ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}>
                      Get Started
                    </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}