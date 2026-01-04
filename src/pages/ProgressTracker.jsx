import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Plus, Calendar, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function ProgressTracker() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    weight: '',
    body_fat_percentage: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    workout_completed: false,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const progressLogs = await base44.entities.ProgressLog.filter(
        { user_id: currentUser.email },
        '-log_date',
        50
      );
      setLogs(progressLogs);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData, user_id: user.email };
      Object.keys(dataToSubmit).forEach(key => {
        if (dataToSubmit[key] === '') delete dataToSubmit[key];
      });

      await base44.entities.ProgressLog.create(dataToSubmit);
      await loadData();
      setShowForm(false);
      setFormData({
        log_date: new Date().toISOString().split('T')[0],
        weight: '',
        body_fat_percentage: '',
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: '',
        workout_completed: false,
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting log:', error);
    }
  };

  const getWeightData = () => {
    return logs
      .filter(log => log.weight)
      .reverse()
      .map(log => ({
        date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: log.weight,
      }));
  };

  const getLatestLog = () => logs[0] || {};
  const getPreviousLog = () => logs[1] || {};

  const calculateChange = (current, previous) => {
    if (!current || !previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change < 0,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  const latestLog = getLatestLog();
  const previousLog = getPreviousLog();
  const weightChange = calculateChange(latestLog.weight, previousLog.weight);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">Progress Tracker</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Track your journey with detailed metrics and insights
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Progress
            </Button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-2xl p-8 shadow-xl mb-8"
            >
              <h2 className="text-2xl font-black mb-6">Add Progress Entry</h2>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Date</label>
                  <Input
                    type="date"
                    value={formData.log_date}
                    onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70.5"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Body Fat %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.body_fat_percentage}
                    onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })}
                    placeholder="20"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Chest (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    placeholder="95"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Waist (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    placeholder="80"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Hips (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.hips}
                    onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                    placeholder="95"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Arms (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.arms}
                    onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                    placeholder="35"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Thighs (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.thighs}
                    onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                    placeholder="55"
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.workout_completed}
                      onChange={(e) => setFormData({ ...formData, workout_completed: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="font-bold">Workout Completed Today</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="How are you feeling?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                    rows="3"
                  />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <Button type="submit" className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                    Save Progress
                  </Button>
                  <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {logs.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-sm font-bold text-gray-500 mb-2">Current Weight</h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-black">{latestLog.weight || 'N/A'}</div>
                      <div className="text-sm text-gray-500">kg</div>
                    </div>
                    {weightChange && (
                      <div className={`flex items-center gap-1 ${weightChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {weightChange.isPositive ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                        <span className="font-bold">{weightChange.value}kg</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-sm font-bold text-gray-500 mb-2">Body Fat</h3>
                  <div className="text-4xl font-black">{latestLog.body_fat_percentage || 'N/A'}</div>
                  <div className="text-sm text-gray-500">%</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-sm font-bold text-gray-500 mb-2">Total Logs</h3>
                  <div className="text-4xl font-black">{logs.length}</div>
                  <div className="text-sm text-gray-500">entries</div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg mb-8"
              >
                <h3 className="text-2xl font-black mb-6">Weight Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getWeightData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#facc15" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-black mb-6">Recent Entries</h3>
                <div className="space-y-4">
                  {logs.slice(0, 5).map((log, idx) => (
                    <div key={log.id} className="border-2 border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-yellow-400" />
                          <span className="font-bold">{new Date(log.log_date).toLocaleDateString()}</span>
                        </div>
                        {log.workout_completed && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                            Workout Done
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {log.weight && <div><span className="text-gray-500">Weight:</span> <strong>{log.weight}kg</strong></div>}
                        {log.body_fat_percentage && <div><span className="text-gray-500">Body Fat:</span> <strong>{log.body_fat_percentage}%</strong></div>}
                        {log.waist && <div><span className="text-gray-500">Waist:</span> <strong>{log.waist}cm</strong></div>}
                        {log.chest && <div><span className="text-gray-500">Chest:</span> <strong>{log.chest}cm</strong></div>}
                      </div>
                      {log.notes && (
                        <p className="mt-3 text-sm text-gray-600 italic">{log.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400 mb-6">No progress logged yet</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Log Your First Entry
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}