import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Clock, Users, Flame, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GymLoader from '@/components/GymLoader';
import BookingModal from '@/components/BookingModal';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [bookingClass, setBookingClass] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadClasses();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const loadClasses = async () => {
    try {
      const classesData = await base44.entities.Class.filter({ is_active: true }, 'order', 50);
      setClasses(classesData);
      
      const uniqueCategories = ['All', ...new Set(classesData.map(c => c.category).filter(Boolean))];
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error loading classes:', error);
      setLoading(false);
    }
  };

  const handleBookClass = (classItem) => {
    if (!isAuthenticated) {
      if (confirm('You need to be logged in to book a class. Would you like to login?')) {
        base44.auth.redirectToLogin(window.location.pathname);
      }
      return;
    }
    setBookingClass(classItem);
  };

  const filteredClasses = selectedCategory === 'All' 
    ? classes 
    : classes.filter(c => c.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <GymLoader message="Loading classes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">Our Classes</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
              Discover the perfect workout for your fitness goals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      {categories.length > 1 && (
        <section className="py-12 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-bold transition-all ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Classes Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No classes available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-video">
                    <img
                      src={classItem.image || 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&h=600&q=80&fit=crop'}
                      alt={classItem.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {classItem.category && (
                      <div className="absolute top-4 right-4">
                        <span className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-full text-sm">
                          {classItem.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black mb-3">{classItem.name}</h3>
                    <p className="text-gray-600 mb-4">{classItem.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      {classItem.duration_minutes && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span>{classItem.duration_minutes} min</span>
                        </div>
                      )}
                      {classItem.capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-yellow-400" />
                          <span>{classItem.capacity} max</span>
                        </div>
                      )}
                      {classItem.difficulty_level && (
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-yellow-400" />
                          <span>{classItem.difficulty_level}</span>
                        </div>
                      )}
                    </div>

                    {classItem.schedule?.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-bold text-sm mb-2">Schedule:</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {classItem.schedule.map((time, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium"
                            >
                              {time.day} {time.time}
                            </span>
                          ))}
                        </div>
                        <Button 
                          onClick={() => handleBookClass(classItem)}
                          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Class
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {bookingClass && (
        <BookingModal
          classItem={bookingClass}
          onClose={() => setBookingClass(null)}
          onSuccess={() => {
            alert('Booking confirmed! Check your bookings page.');
          }}
        />
      )}
    </div>
  );
}