import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit2, Trash2, ArrowLeft, Save, X, Upload, MoveUp, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GymLoader from '@/components/GymLoader';
import { usePermissions } from '@/components/PermissionCheck';

export default function ClassManager() {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: '',
    duration_minutes: '',
    difficulty_level: 'All Levels',
    schedule: [{ day: '', time: '' }],
    capacity: '',
    image: '',
    website_image: '',
    category: '',
    show_on_homepage: false,
    is_active: true,
    order: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const classesData = await base44.entities.Class.list();
      setClasses(classesData.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('ClassManager')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image: file_url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const classData = {
        ...formData,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        schedule: formData.schedule.filter(s => s.day && s.time)
      };

      if (editingClass) {
        await base44.entities.Class.update(editingClass.id, classData);
      } else {
        await base44.entities.Class.create(classData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Error saving class');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      await base44.entities.Class.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      description: cls.description || '',
      instructor: cls.instructor,
      duration_minutes: cls.duration_minutes || '',
      difficulty_level: cls.difficulty_level || 'All Levels',
      schedule: cls.schedule?.length ? cls.schedule : [{ day: '', time: '' }],
      capacity: cls.capacity || '',
      image: cls.image || '',
      website_image: cls.website_image || '',
      category: cls.category || '',
      show_on_homepage: cls.show_on_homepage || false,
      is_active: cls.is_active !== false,
      order: cls.order || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      instructor: '',
      duration_minutes: '',
      difficulty_level: 'All Levels',
      schedule: [{ day: '', time: '' }],
      capacity: '',
      image: '',
      website_image: '',
      category: '',
      show_on_homepage: false,
      is_active: true,
      order: 0
    });
    setEditingClass(null);
    setShowForm(false);
  };

  const addSchedule = () => {
    setFormData({ 
      ...formData, 
      schedule: [...formData.schedule, { day: '', time: '' }] 
    });
  };

  const removeSchedule = (index) => {
    const schedule = [...formData.schedule];
    schedule.splice(index, 1);
    setFormData({ ...formData, schedule });
  };

  const updateSchedule = (index, field, value) => {
    const schedule = [...formData.schedule];
    schedule[index][field] = value;
    setFormData({ ...formData, schedule });
  };

  const moveClass = async (index, direction) => {
    const newClasses = [...classes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newClasses.length) return;
    
    [newClasses[index], newClasses[targetIndex]] = [newClasses[targetIndex], newClasses[index]];
    
    for (let i = 0; i < newClasses.length; i++) {
      await base44.entities.Class.update(newClasses[i].id, { order: i });
    }
    
    await loadData();
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GymLoader message="Loading classes..." />
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
                <h1 className="text-4xl font-black">Class Manager</h1>
                <p className="text-gray-400">Manage fitness classes and schedules</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-yellow-400 text-black hover:bg-yellow-500">
              <Plus className="w-5 h-5 mr-2" />
              Add Class
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
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Class Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Yoga Flow"
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
                  <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    placeholder="60"
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
                <div>
                  <label className="block text-sm font-semibold mb-2">Capacity</label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Cardio, Strength, Yoga"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Display Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="Class description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Class Image</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                </div>
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Website Homepage Image</label>
                <p className="text-xs text-gray-500 mb-2">Recommended size: 600x900px (Portrait)</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    try {
                      setUploading(true);
                      const { file_url } = await base44.integrations.Core.UploadFile({ file });
                      setFormData({ ...formData, website_image: file_url });
                    } catch (error) {
                      console.error('Error uploading image:', error);
                      alert('Error uploading image');
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="mb-3"
                />
                {formData.website_image && (
                  <div className="relative w-32">
                    <img src={formData.website_image} alt="" className="w-full h-40 object-cover rounded-lg" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => setFormData({ ...formData, website_image: '' })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Schedule</label>
                {formData.schedule.map((sched, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={sched.day}
                      onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                      placeholder="Day (e.g., Monday)"
                      className="flex-1"
                    />
                    <Input
                      value={sched.time}
                      onChange={(e) => updateSchedule(index, 'time', e.target.value)}
                      placeholder="Time (e.g., 9:00 AM)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeSchedule(index)}
                      disabled={formData.schedule.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addSchedule} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Schedule
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.show_on_homepage}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_on_homepage: checked })}
                  />
                  <label className="text-sm font-semibold">Show on Homepage</label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <label className="text-sm font-semibold">Active</label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500">
                  <Save className="w-4 h-4 mr-2" />
                  {editingClass ? 'Update Class' : 'Create Class'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{cls.name}</CardTitle>
                        {!cls.is_active && (
                          <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">with {cls.instructor}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => moveClass(index, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => moveClass(index, 'down')}
                        disabled={index === classes.length - 1}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleEdit(cls)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(cls.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {cls.image && (
                    <img src={cls.image} alt={cls.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <p className="text-sm text-gray-600 mb-3">{cls.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-semibold">{cls.duration_minutes ? `${cls.duration_minutes} min` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Level</p>
                      <p className="font-semibold">{cls.difficulty_level}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Capacity</p>
                      <p className="font-semibold">{cls.capacity || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-semibold">{cls.category || 'N/A'}</p>
                    </div>
                  </div>
                  {cls.schedule?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm mb-1">Schedule:</p>
                      <div className="space-y-1">
                        {cls.schedule.map((sched, idx) => (
                          <p key={idx} className="text-sm">• {sched.day} at {sched.time}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {classes.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">No classes yet. Create your first class!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}