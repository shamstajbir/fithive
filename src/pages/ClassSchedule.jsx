import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

export default function ClassSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [selectedDay, setSelectedDay] = useState('All');
  const [loading, setLoading] = useState(true);

  const days = ['All', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const schedulesData = await base44.entities.ClassSchedule.filter({ is_active: true });
      
      // Group by day
      const grouped = {};
      days.slice(1).forEach(day => {
        grouped[day] = schedulesData.filter(s => s.day === day).sort((a, b) => {
          const timeA = a.time.replace(/[^0-9]/g, '');
          const timeB = b.time.replace(/[^0-9]/g, '');
          return timeA.localeCompare(timeB);
        });
      });
      
      setSchedules(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error loading schedules:', error);
      setLoading(false);
    }
  };

  const getClassColor = (className) => {
    const colors = {
      'Aerobics': 'bg-pink-100 border-pink-400 text-pink-900',
      'Zumba': 'bg-green-100 border-green-400 text-green-900',
      'Yoga': 'bg-teal-100 border-teal-400 text-teal-900',
      'HIIT': 'bg-gray-100 border-gray-400 text-gray-900',
    };
    return colors[className] || 'bg-gray-100 border-gray-400 text-gray-900';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-5xl md:text-7xl font-black mb-6">Class Schedule</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Join our fitness classes throughout the week
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  selectedDay === day
                    ? 'bg-yellow-400 text-black shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Table */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {days.slice(1).map((day) => (
                    <th 
                      key={day}
                      className={`p-4 text-left border-2 font-black text-xl ${
                        selectedDay === day || selectedDay === 'All'
                          ? 'bg-yellow-400 text-black border-yellow-400'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.slice(1).map((day) => (
                    <td 
                      key={day}
                      className={`p-4 border-2 align-top ${
                        selectedDay === day || selectedDay === 'All'
                          ? 'border-yellow-400 bg-yellow-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {schedules[day]?.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-xl font-bold text-gray-400">No Classes</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {schedules[day]?.map((item, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                selectedDay === day || selectedDay === 'All'
                                  ? `${getClassColor(item.class_name)} shadow-md`
                                  : 'bg-gray-50 border-gray-200 opacity-60'
                              }`}
                            >
                              <h3 className="font-black text-lg mb-1">{item.class_name}</h3>
                              <p className="text-sm font-semibold mb-2">{item.time}</p>
                              {item.instructor && (
                                <p className="text-xs mb-2">with {item.instructor}</p>
                              )}
                              {item.location && (
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                  {item.location}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}