import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function ScheduleSection() {
  return (
    <section className="bg-gradient-to-br from-yellow-400 to-yellow-500 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-black" />
              <span className="text-sm font-bold tracking-wider text-black/70">OPEN DAILY</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-black mb-4">
              from 06:30am
              <br />
              to 10pm
            </h2>
            
            <p className="text-2xl md:text-3xl font-bold text-black/80 mb-8">
              train every day
            </p>
            
            <p className="text-lg text-black/70 mb-8">
              On your FitHive Club
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-black text-yellow-400 rounded-full font-bold text-lg flex items-center gap-3 group"
            >
              Sign up
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right - Schedule Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Morning */}
            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-black/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-black text-black mb-1">Morning Sessions</h3>
                  <p className="text-gray-600">Start your day strong</p>
                </div>
                <Calendar className="w-6 h-6 text-black/50" />
              </div>
              <div className="flex items-center gap-2 text-black font-bold">
                <Clock className="w-4 h-4" />
                <span>06:30 - 14:00</span>
              </div>
            </motion.div>

            {/* Evening */}
            <motion.div
              whileHover={{ scale: 1.02, x: 10 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-black/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-black text-black mb-1">Evening Workouts</h3>
                  <p className="text-gray-600">Wind down your day</p>
                </div>
                <Calendar className="w-6 h-6 text-black/50" />
              </div>
              <div className="flex items-center gap-2 text-black font-bold">
                <Clock className="w-4 h-4" />
                <span>14:00 - 22:00</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex items-center justify-center gap-2 text-black/70"
        >
          <MapPin className="w-5 h-5" />
          <span className="text-lg font-medium">
            Available at all FitHive locations across Portugal
          </span>
        </motion.div>
      </div>
    </section>
  );
}