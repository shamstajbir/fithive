import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Target, Users, Award, Heart, ArrowRight } from 'lucide-react';
import GymLoader from '@/components/GymLoader';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower individuals to achieve their fitness goals through world-class facilities, expert guidance, and a supportive community.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe fitness is better together. Our clubs foster connections and friendships that last beyond the gym.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'From our state-of-the-art equipment to our certified trainers, we maintain the highest standards in everything we do.',
  },
  {
    icon: Heart,
    title: 'Wellness',
    description: 'We focus on holistic health - physical, mental, and emotional wellbeing for a balanced lifestyle.',
  },
];

const stats = [
  { number: '10,000+', label: 'Active Members' },
  { number: '6', label: 'Locations' },
  { number: '50+', label: 'Classes Weekly' },
  { number: '15', label: 'Years Experience' },
];

export default function About() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const data = await base44.entities.Trainer.filter({ is_active: true });
      setTrainers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trainers:', error);
      setLoading(false);
    }
  };

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
            <h1 className="text-5xl md:text-7xl font-black mb-6">About FitHive</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
              Portugal's premier fitness community dedicated to transforming lives through health and wellness
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                Founded in 2009, FitHive started with a simple vision: create fitness spaces where everyone feels welcome, supported, and inspired to reach their goals.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                What began as a single club in Porto has grown into Portugal's most trusted fitness brand, with locations across major cities and a thriving community of over 10,000 members.
              </p>
              <p className="text-lg text-gray-700">
                Today, we continue to innovate and expand, always staying true to our core values of excellence, community, and holistic wellness.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop"
                alt="FitHive Gym"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-black text-black mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-bold text-black/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Elite Trainers Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">Meet Our Elite Trainers</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              World-class experts dedicated to your transformation
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <GymLoader message="Loading trainers..." />
            </div>
          ) : trainers.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {trainers.map((trainer, index) => (
                <motion.div
                  key={trainer.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`${createPageUrl('TrainerDetail')}?id=${trainer.id}`}>
                    <div className="group relative overflow-hidden rounded-2xl cursor-pointer">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={trainer.photo}
                          alt={trainer.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <h3 className="text-2xl font-black text-white mb-2">{trainer.name}</h3>
                        <p className="text-yellow-400 font-bold text-lg mb-2">{trainer.body_type}</p>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{trainer.specialization}</p>
                        <div className="flex items-center gap-2 text-yellow-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          View Profile <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No trainers available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl"
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-black mb-4">{value.title}</h3>
                <p className="text-gray-700 text-lg">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}