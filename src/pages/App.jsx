import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Calendar, Dumbbell, Users, BarChart3, Bell, Download } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Class Booking',
    description: 'Reserve your spot in classes with just a tap',
  },
  {
    icon: Dumbbell,
    title: 'Workout Plans',
    description: 'Personalized training programs tailored to your goals',
  },
  {
    icon: Users,
    title: 'Personal Trainer',
    description: 'Book sessions with certified trainers',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your fitness journey with detailed analytics',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a workout with intelligent notifications',
  },
  {
    icon: Smartphone,
    title: 'Digital Check-in',
    description: 'Quick and easy gym access with QR code',
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-black mb-6">
                FitHive App
              </h1>
              <p className="text-xl md:text-2xl text-black/80 mb-8">
                Your complete fitness companion. Everything you need in one powerful app.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl shadow-lg"
                >
                  <Download className="w-6 h-6" />
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-bold">App Store</div>
                  </div>
                </motion.a>

                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl shadow-lg"
                >
                  <Download className="w-6 h-6" />
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-bold">Google Play</div>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto w-80">
                <div className="relative bg-black rounded-[3rem] p-4 shadow-2xl">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-[2.5rem] overflow-hidden">
                    <div className="aspect-[9/19] relative flex flex-col items-center justify-center p-8">
                      <div className="text-8xl font-black text-black mb-4">F</div>
                      <div className="text-3xl font-black text-black tracking-tight">FITHIVE</div>
                      <div className="text-black/70 mt-4 text-center">Your Fitness Journey</div>
                    </div>
                  </div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Everything in Your Pocket
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your fitness life with powerful features designed for results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-yellow-400 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Download Now
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your fitness journey today with the FitHive app
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-yellow-400 text-black font-black text-lg rounded-full"
              >
                Download for iOS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-black font-black text-lg rounded-full"
              >
                Download for Android
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}