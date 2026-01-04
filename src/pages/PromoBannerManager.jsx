import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermissions } from '@/components/PermissionCheck';
import GymLoader from '@/components/GymLoader';

export default function PromoBannerManager() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  
  const [formData, setFormData] = useState({
    banner_type: 'top_bar',
    image_url: '',
    desktop_image_url: '',
    tablet_image_url: '',
    mobile_image_url: '',
    link_url: '',
    is_active: true,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('PromoBannerManager')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const bannersData = await base44.entities.PromoBanner.list();
      setBanners(bannersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, [field]: file_url });
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error uploading image');
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingBanner) {
        await base44.entities.PromoBanner.update(editingBanner.id, formData);
      } else {
        await base44.entities.PromoBanner.create(formData);
      }
      
      setShowDialog(false);
      setEditingBanner(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      await base44.entities.PromoBanner.delete(id);
      loadData();
    }
  };

  const toggleActive = async (banner) => {
    await base44.entities.PromoBanner.update(banner.id, { is_active: !banner.is_active });
    loadData();
  };

  const resetForm = () => {
    setFormData({
      banner_type: 'top_bar',
      image_url: '',
      desktop_image_url: '',
      tablet_image_url: '',
      mobile_image_url: '',
      link_url: '',
      is_active: true,
      start_date: '',
      end_date: ''
    });
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GymLoader message="Loading banners..." />
      </div>
    );
  }

  const topBarBanners = banners.filter(b => b.banner_type === 'top_bar');
  const popupBanners = banners.filter(b => b.banner_type === 'popup_modal');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-black text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl('AdminDashboard')} className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black">Promo Banner Manager</h1>
              <p className="text-gray-400 mt-2">{banners.length} banners</p>
            </div>
            <Button
              onClick={() => {
                setEditingBanner(null);
                resetForm();
                setShowDialog(true);
              }}
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Banner
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Bar Banners */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-6">Top Bar Banners</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {topBarBanners.map((banner) => (
              <Card key={banner.id} className="hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <img src={banner.image_url} alt="Banner" className="w-full h-24 object-cover rounded-lg mb-2" />
                      <p className="text-xs text-gray-500">Desktop</p>
                    </div>
                    <button
                      onClick={() => toggleActive(banner)}
                      className={`ml-4 p-2 rounded-lg ${banner.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {banner.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                  {banner.mobile_image_url && (
                    <div className="mb-2">
                      <img src={banner.mobile_image_url} alt="Mobile" className="w-32 h-16 object-cover rounded-lg" />
                      <p className="text-xs text-gray-500">Mobile</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(banner)} className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(banner.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {topBarBanners.length === 0 && (
            <p className="text-gray-500 text-center py-8">No top bar banners yet</p>
          )}
        </div>

        {/* Popup Banners */}
        <div>
          <h2 className="text-2xl font-black mb-6">Popup Modal Banners</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {popupBanners.map((banner) => (
              <Card key={banner.id} className="hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <img src={banner.image_url} alt="Banner" className="w-full h-40 object-cover rounded-lg mb-2" />
                      <p className="text-xs text-gray-500">Desktop</p>
                    </div>
                    <button
                      onClick={() => toggleActive(banner)}
                      className={`ml-4 p-2 rounded-lg ${banner.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {banner.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                  {banner.mobile_image_url && (
                    <div className="mb-2">
                      <img src={banner.mobile_image_url} alt="Mobile" className="w-32 h-24 object-cover rounded-lg" />
                      <p className="text-xs text-gray-500">Mobile</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(banner)} className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(banner.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {popupBanners.length === 0 && (
            <p className="text-gray-500 text-center py-8">No popup banners yet</p>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Banner Type *</label>
              <select
                value={formData.banner_type}
                onChange={(e) => setFormData({ ...formData, banner_type: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="top_bar">Top Bar (Above Navbar)</option>
                <option value="popup_modal">Popup Modal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Default Image * {uploading && '(Uploading...)'}</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url')} disabled={uploading} />
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Desktop Image (1920px+) {uploading && '(Uploading...)'}</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'desktop_image_url')} disabled={uploading} />
              {formData.desktop_image_url && (
                <img src={formData.desktop_image_url} alt="Desktop Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Tablet Image (768px-1024px) {uploading && '(Uploading...)'}</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'tablet_image_url')} disabled={uploading} />
              {formData.tablet_image_url && (
                <img src={formData.tablet_image_url} alt="Tablet Preview" className="mt-2 w-48 h-28 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Mobile Image (640px) {uploading && '(Uploading...)'}</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'mobile_image_url')} disabled={uploading} />
              {formData.mobile_image_url && (
                <img src={formData.mobile_image_url} alt="Mobile Preview" className="mt-2 w-40 h-24 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Link URL (Optional)</label>
              <Input
                placeholder="https://..."
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Active</label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formData.image_url || uploading}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
            >
              Save Banner
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}