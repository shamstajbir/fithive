import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit2, Trash2, ArrowLeft, Save, X, Upload, MoveUp, MoveDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import GymLoader from '@/components/GymLoader';
import { usePermissions } from '@/components/PermissionCheck';

export default function ClubManager() {
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    facilities: [''],
    operating_hours: { weekdays: '', weekends: '' },
    images: [],
    website_image: '',
    map_lat: '',
    map_lng: '',
    description: '',
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

      const clubsData = await base44.entities.Club.list();
      setClubs(clubsData.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('ClubManager')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setUploading(true);
      const uploadPromises = files.map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const urls = results.map(r => r.file_url);
      setFormData({ ...formData, images: [...formData.images, ...urls] });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const images = [...formData.images];
    images.splice(index, 1);
    setFormData({ ...formData, images });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clubData = {
        ...formData,
        facilities: formData.facilities.filter(f => f.trim()),
        map_lat: formData.map_lat ? parseFloat(formData.map_lat) : null,
        map_lng: formData.map_lng ? parseFloat(formData.map_lng) : null
      };

      if (editingClub) {
        await base44.entities.Club.update(editingClub.id, clubData);
      } else {
        await base44.entities.Club.create(clubData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving club:', error);
      alert('Error saving club');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this club?')) return;
    try {
      await base44.entities.Club.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting club:', error);
    }
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setFormData({
      name: club.name,
      location: club.location,
      address: club.address,
      phone: club.phone || '',
      email: club.email || '',
      facilities: club.facilities?.length ? club.facilities : [''],
      operating_hours: club.operating_hours || { weekdays: '', weekends: '' },
      images: club.images || [],
      website_image: club.website_image || '',
      map_lat: club.map_lat || '',
      map_lng: club.map_lng || '',
      description: club.description || '',
      show_on_homepage: club.show_on_homepage || false,
      is_active: club.is_active !== false,
      order: club.order || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      address: '',
      phone: '',
      email: '',
      facilities: [''],
      operating_hours: { weekdays: '', weekends: '' },
      images: [],
      website_image: '',
      map_lat: '',
      map_lng: '',
      description: '',
      show_on_homepage: false,
      is_active: true,
      order: 0
    });
    setEditingClub(null);
    setShowForm(false);
  };

  const addFacility = () => {
    setFormData({ ...formData, facilities: [...formData.facilities, ''] });
  };

  const removeFacility = (index) => {
    const facilities = [...formData.facilities];
    facilities.splice(index, 1);
    setFormData({ ...formData, facilities });
  };

  const updateFacility = (index, value) => {
    const facilities = [...formData.facilities];
    facilities[index] = value;
    setFormData({ ...formData, facilities });
  };

  const moveClub = async (index, direction) => {
    const newClubs = [...clubs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newClubs.length) return;
    
    [newClubs[index], newClubs[targetIndex]] = [newClubs[targetIndex], newClubs[index]];
    
    for (let i = 0; i < newClubs.length; i++) {
      await base44.entities.Club.update(newClubs[i].id, { order: i });
    }
    
    await loadData();
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GymLoader message="Loading clubs..." />
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
                <h1 className="text-4xl font-black">Club Manager</h1>
                <p className="text-gray-400">Manage gym club locations</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-yellow-400 text-black hover:bg-yellow-500">
              <Plus className="w-5 h-5 mr-2" />
              Add Club
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
              {editingClub ? 'Edit Club' : 'Add New Club'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Club Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., FitHive Downtown"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Location *</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="e.g., Downtown"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Address *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="Full address"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="club@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Club description"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Weekdays Hours</label>
                  <Input
                    value={formData.operating_hours.weekdays}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      operating_hours: { ...formData.operating_hours, weekdays: e.target.value } 
                    })}
                    placeholder="e.g., 6:00 AM - 10:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Weekend Hours</label>
                  <Input
                    value={formData.operating_hours.weekends}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      operating_hours: { ...formData.operating_hours, weekends: e.target.value } 
                    })}
                    placeholder="e.g., 8:00 AM - 8:00 PM"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Map Latitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.map_lat}
                    onChange={(e) => setFormData({ ...formData, map_lat: e.target.value })}
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Map Longitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.map_lng}
                    onChange={(e) => setFormData({ ...formData, map_lng: e.target.value })}
                    placeholder="-74.0060"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Facilities</label>
                {formData.facilities.map((facility, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={facility}
                      onChange={(e) => updateFacility(index, e.target.value)}
                      placeholder="Facility name"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeFacility(index)}
                      disabled={formData.facilities.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFacility} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Facility
                </Button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Club Images</label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="mb-3"
                />
                {uploading && <p className="text-sm text-gray-500 mb-2">Uploading...</p>}
                <div className="grid grid-cols-4 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(idx)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Website Homepage Image</label>
                <p className="text-xs text-gray-500 mb-2">Recommended size: 600x800px (Portrait)</p>
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

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Display Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.show_on_homepage}
                      onCheckedChange={(checked) => setFormData({ ...formData, show_on_homepage: checked })}
                    />
                    <label className="text-sm font-semibold">Show on Homepage</label>
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <label className="text-sm font-semibold">Active</label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500">
                  <Save className="w-4 h-4 mr-2" />
                  {editingClub ? 'Update Club' : 'Create Club'}
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
          {clubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{club.name}</CardTitle>
                        {!club.is_active && (
                          <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {club.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => moveClub(index, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => moveClub(index, 'down')}
                        disabled={index === clubs.length - 1}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleEdit(club)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(club.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {club.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {club.images.slice(0, 3).map((img, idx) => (
                        <img key={idx} src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mb-3">{club.description}</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Address:</span> {club.address}</p>
                    {club.phone && <p><span className="font-semibold">Phone:</span> {club.phone}</p>}
                    {club.email && <p><span className="font-semibold">Email:</span> {club.email}</p>}
                    {club.operating_hours?.weekdays && (
                      <p><span className="font-semibold">Hours:</span> {club.operating_hours.weekdays}</p>
                    )}
                    {club.facilities?.length > 0 && (
                      <div>
                        <p className="font-semibold">Facilities:</p>
                        <p className="text-gray-600">
                          {club.facilities.slice(0, 3).join(', ')}
                          {club.facilities.length > 3 && ` +${club.facilities.length - 3} more`}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {clubs.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">No clubs yet. Create your first club!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}