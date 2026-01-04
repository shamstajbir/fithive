import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { addDays, format, startOfWeek, isBefore, startOfDay } from 'date-fns';

export default function BookingModal({ classItem, onClose, onSuccess }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const getNextWeekDates = () => {
    const dates = [];
    const today = startOfDay(new Date());
    const nextWeek = startOfWeek(addDays(today, 7));
    
    classItem.schedule?.forEach(sched => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        .indexOf(sched.day);
      
      if (dayIndex >= 0) {
        const date = addDays(nextWeek, dayIndex);
        if (!isBefore(date, today)) {
          dates.push({ 
            date, 
            day: sched.day, 
            time: sched.time 
          });
        }
      }
    });
    
    return dates.sort((a, b) => a.date - b.date);
  };

  const availableDates = getNextWeekDates();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    try {
      setLoading(true);
      const user = await base44.auth.me();
      
      await base44.entities.Booking.create({
        user_email: user.email,
        user_name: user.full_name,
        class_id: classItem.id,
        class_name: classItem.name,
        instructor: classItem.instructor,
        booking_date: format(selectedDate.date, 'yyyy-MM-dd'),
        booking_time: selectedTime,
        day_of_week: selectedDate.day,
        status: 'confirmed',
        phone: phone || '',
        notes: notes || ''
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <h2 className="text-2xl font-black">Book {classItem.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span>Instructor: {classItem.instructor}</span>
              </div>
              {classItem.duration_minutes && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Duration: {classItem.duration_minutes} minutes</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Select Date & Time *</label>
              {availableDates.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming sessions available</p>
              ) : (
                <div className="grid gap-2">
                  {availableDates.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedDate(slot);
                        setSelectedTime(slot.time);
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedDate?.date === slot.date && selectedTime === slot.time
                          ? 'border-yellow-400 bg-yellow-50'
                          : 'border-gray-200 hover:border-yellow-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{format(slot.date, 'EEEE, MMMM d')}</div>
                          <div className="text-sm text-gray-600">{slot.time}</div>
                        </div>
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special requirements or questions"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading || !selectedDate || !selectedTime}
                className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}