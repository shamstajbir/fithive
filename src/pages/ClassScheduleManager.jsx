import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit2, Trash2, ArrowLeft, Save, X, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GymLoader from '@/components/GymLoader';
import { usePermissions } from '@/components/PermissionCheck';

export default function ClassScheduleManager() {
  const [user, setUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedDay, setSelectedDay] = useState('All');
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const [formData, setFormData] = useState({
    class_name: '',
    instructor: '',
    day: 'Monday',
    time: '',
    duration_minutes: '',
    location: '',
    capacity: '',
    difficulty_level: 'All Levels',
    category: '',
    description: '',
    is_active: true
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const schedulesData = await base44.entities.ClassSchedule.list();
      setSchedules(schedulesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('ClassScheduleManager')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduleData = {
        ...formData,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      };

      if (editingSchedule) {
        await base44.entities.ClassSchedule.update(editingSchedule.id, scheduleData);
      } else {
        await base44.entities.ClassSchedule.create(scheduleData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Error saving schedule');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await base44.entities.ClassSchedule.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      class_name: schedule.class_name,
      instructor: schedule.instructor,
      day: schedule.day,
      time: schedule.time,
      duration_minutes: schedule.duration_minutes || '',
      location: schedule.location || '',
      capacity: schedule.capacity || '',
      difficulty_level: schedule.difficulty_level || 'All Levels',
      category: schedule.category || '',
      description: schedule.description || '',
      is_active: schedule.is_active !== false
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      class_name: '',
      instructor: '',
      day: 'Monday',
      time: '',
      duration_minutes: '',
      location: '',
      capacity: '',
      difficulty_level: 'All Levels',
      category: '',
      description: '',
      is_active: true
    });
    setEditingSchedule(null);
    setShowForm(false);
  };

  const toggleActive = async (schedule) => {
    try {
      await base44.entities.ClassSchedule.update(schedule.id, { 
        is_active: !schedule.is_active 
      });
      await loadData();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const filteredSchedules = selectedDay === 'All' 
    ? schedules 
    : schedules.filter(s => s.day === selectedDay);

  const schedulesByDay = days.reduce((acc, day) => {
    acc[day] = schedules.filter(s => s.day === day).sort((a, b) => {
      const timeA = a.time.replace(/[^0-9]/g, '');
      const timeB = b.time.replace(/[^0-9]/g, '');
      return timeA.localeCompare(timeB);
    });
    return acc;
  }, {});

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GymLoader message="Loading schedules..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-black text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('AdminDashboard')}>
                <Button variant="outline" size="icon" className="bg-white text-black hover:bg-gray-200">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-black">Class Schedule Manager</h1>
                <p className="text-gray-400">Manage weekly class schedules</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-yellow-400 text-black hover:bg-yellow-500">
              <Plus className="w-5 h-5 mr-2" />
              Add Schedule
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-black mb-6">
              {editingSchedule ? 'Edit Class Schedule' : 'Add New Class Schedule'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Class Name *</label>
                  <Input
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    required
                    placeholder="e.g., Morning Yoga"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Instructor *</label>
                  <Input
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                    placeholder="Instructor name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Day *</label>
                  <Select
                    value={formData.day}
                    onValueChange={(value) => setFormData({ ...formData, day: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Time *</label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    placeholder="e.g., 9:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Studio A, Downtown"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Capacity</label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Difficulty Level</label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="All Levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Cardio, Strength, Yoga"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Class description"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <label className="text-sm font-semibold">Active</label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500">
                  <Save className="w-4 h-4 mr-2" />
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedDay === 'All' ? 'default' : 'outline'}
              onClick={() => setSelectedDay('All')}
              className={selectedDay === 'All' ? 'bg-yellow-400 text-black hover:bg-yellow-500' : ''}
            >
              All Days
            </Button>
            {days.map(day => (
              <Button
                key={day}
                variant={selectedDay === day ? 'default' : 'outline'}
                onClick={() => setSelectedDay(day)}
                className={selectedDay === day ? 'bg-yellow-400 text-black hover:bg-yellow-500' : ''}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>

        {selectedDay === 'All' ? (
          <div className="space-y-8">
            {days.map(day => (
              <div key={day}>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  {day}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schedulesByDay[day].map((schedule, index) => (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <CardTitle className="text-lg">{schedule.class_name}</CardTitle>
                                {!schedule.is_active && (
                                  <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">with {schedule.instructor}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="outline" onClick={() => handleEdit(schedule)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="destructive" onClick={() => handleDelete(schedule.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">{schedule.time}</span>
                            {schedule.duration_minutes && (
                              <span className="text-gray-600">({schedule.duration_minutes} min)</span>
                            )}
                          </div>
                          {schedule.location && (
                            <p className="text-sm text-gray-600">📍 {schedule.location}</p>
                          )}
                          {schedule.capacity && (
                            <p className="text-sm text-gray-600">👥 Capacity: {schedule.capacity}</p>
                          )}
                          {schedule.category && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                              {schedule.category}
                            </span>
                          )}
                          {schedule.description && (
                            <p className="text-sm text-gray-600 pt-2">{schedule.description}</p>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-xs text-gray-500">{schedule.difficulty_level}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Active</span>
                              <Switch
                                checked={schedule.is_active}
                                onCheckedChange={() => toggleActive(schedule)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  {schedulesByDay[day].length === 0 && (
                    <p className="text-gray-500 col-span-full py-8 text-center">No classes scheduled</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              {selectedDay}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchedules.map((schedule, index) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-lg">{schedule.class_name}</CardTitle>
                            {!schedule.is_active && (
                              <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">with {schedule.instructor}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="outline" onClick={() => handleEdit(schedule)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="destructive" onClick={() => handleDelete(schedule.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{schedule.time}</span>
                        {schedule.duration_minutes && (
                          <span className="text-gray-600">({schedule.duration_minutes} min)</span>
                        )}
                      </div>
                      {schedule.location && (
                        <p className="text-sm text-gray-600">📍 {schedule.location}</p>
                      )}
                      {schedule.capacity && (
                        <p className="text-sm text-gray-600">👥 Capacity: {schedule.capacity}</p>
                      )}
                      {schedule.category && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                          {schedule.category}
                        </span>
                      )}
                      {schedule.description && (
                        <p className="text-sm text-gray-600 pt-2">{schedule.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-gray-500">{schedule.difficulty_level}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Active</span>
                          <Switch
                            checked={schedule.is_active}
                            onCheckedChange={() => toggleActive(schedule)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {filteredSchedules.length === 0 && (
                <p className="text-gray-500 col-span-full text-center py-12">
                  No classes scheduled for {selectedDay}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}