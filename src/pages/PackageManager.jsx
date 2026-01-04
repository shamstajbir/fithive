import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Edit2, Trash2, ArrowLeft, Save, X, Star, MoveUp, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import GymLoader from '@/components/GymLoader';
import { usePermissions } from '@/components/PermissionCheck';

export default function PackageManager() {
  const [user, setUser] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: [''],
    add_ons: [{ name: '', price: '', description: '' }],
    is_popular: false,
    is_active: true,
    order: 0
  });
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('PackageManager')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const packagesData = await base44.entities.Package.list();
      setPackages(packagesData.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.filter(f => f.trim()),
        add_ons: formData.add_ons.filter(a => a.name.trim()).map(a => ({
          ...a,
          price: parseFloat(a.price) || 0
        }))
      };

      if (editingPackage) {
        await base44.entities.Package.update(editingPackage.id, packageData);
      } else {
        await base44.entities.Package.create(packageData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error saving package');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await base44.entities.Package.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      duration: pkg.duration,
      features: pkg.features?.length ? pkg.features : [''],
      add_ons: pkg.add_ons?.length ? pkg.add_ons : [{ name: '', price: '', description: '' }],
      is_popular: pkg.is_popular || false,
      is_active: pkg.is_active !== false,
      order: pkg.order || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      features: [''],
      add_ons: [{ name: '', price: '', description: '' }],
      is_popular: false,
      is_active: true,
      order: 0
    });
    setEditingPackage(null);
    setShowForm(false);
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const features = [...formData.features];
    features.splice(index, 1);
    setFormData({ ...formData, features });
  };

  const updateFeature = (index, value) => {
    const features = [...formData.features];
    features[index] = value;
    setFormData({ ...formData, features });
  };

  const addAddOn = () => {
    setFormData({ 
      ...formData, 
      add_ons: [...formData.add_ons, { name: '', price: '', description: '' }] 
    });
  };

  const removeAddOn = (index) => {
    const add_ons = [...formData.add_ons];
    add_ons.splice(index, 1);
    setFormData({ ...formData, add_ons });
  };

  const updateAddOn = (index, field, value) => {
    const add_ons = [...formData.add_ons];
    add_ons[index][field] = value;
    setFormData({ ...formData, add_ons });
  };

  const movePackage = async (index, direction) => {
    const newPackages = [...packages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newPackages.length) return;
    
    [newPackages[index], newPackages[targetIndex]] = [newPackages[targetIndex], newPackages[index]];
    
    for (let i = 0; i < newPackages.length; i++) {
      await base44.entities.Package.update(newPackages[i].id, { order: i });
    }
    
    await loadData();
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GymLoader message="Loading packages..." />
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
                <h1 className="text-4xl font-black">Package Manager</h1>
                <p className="text-gray-400">Manage membership packages and pricing</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-yellow-400 text-black hover:bg-yellow-500">
              <Plus className="w-5 h-5 mr-2" />
              Add Package
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
              {editingPackage ? 'Edit Package' : 'Add New Package'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Package Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Basic Membership"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Duration *</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    placeholder="e.g., 1 Month, 3 Months"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Price ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="99.99"
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
                <label className="block text-sm font-semibold mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Package description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature description"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Add-ons</label>
                {formData.add_ons.map((addon, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                    <div className="grid md:grid-cols-2 gap-3 mb-2">
                      <Input
                        value={addon.name}
                        onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                        placeholder="Add-on name"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={addon.price}
                        onChange={(e) => updateAddOn(index, 'price', e.target.value)}
                        placeholder="Price"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={addon.description}
                        onChange={(e) => updateAddOn(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeAddOn(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addAddOn} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Add-on
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_popular}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
                  />
                  <label className="text-sm font-semibold">Mark as Popular</label>
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
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                        {pkg.is_popular && (
                          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Popular
                          </span>
                        )}
                        {!pkg.is_active && (
                          <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{pkg.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => movePackage(index, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => movePackage(index, 'down')}
                        disabled={index === packages.length - 1}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleEdit(pkg)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(pkg.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Pricing</p>
                      <p className="text-3xl font-black">${pkg.price}</p>
                      <p className="text-sm text-gray-600">{pkg.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Features ({pkg.features?.length || 0})</p>
                      <ul className="space-y-1">
                        {pkg.features?.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-sm">• {feature}</li>
                        ))}
                        {pkg.features?.length > 3 && (
                          <li className="text-sm text-gray-500">+ {pkg.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Add-ons ({pkg.add_ons?.length || 0})</p>
                      <ul className="space-y-1">
                        {pkg.add_ons?.slice(0, 3).map((addon, idx) => (
                          <li key={idx} className="text-sm">• {addon.name} (+${addon.price})</li>
                        ))}
                        {pkg.add_ons?.length > 3 && (
                          <li className="text-sm text-gray-500">+ {pkg.add_ons.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {packages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No packages yet. Create your first package!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}