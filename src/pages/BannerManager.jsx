import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Save,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Video,
  Upload,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { usePermissions } from '@/components/PermissionCheck';

export default function BannerManager() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    media_type: 'image',
    desktop_url: '',
    laptop_url: '',
    tablet_url: '',
    mobile_url: '',
    cta_text: '',
    cta_link: '',
    position: 0,
    is_active: true
  });
  const [uploading, setUploading] = useState({
    desktop: false,
    laptop: false,
    tablet: false,
    mobile: false
  });
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('BannerManager')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const data = await base44.entities.SiteBanner.list('position');
      setBanners(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading banners:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (editingBanner) {
      await base44.entities.SiteBanner.update(editingBanner.id, formData);
    } else {
      await base44.entities.SiteBanner.create(formData);
    }
    
    setShowForm(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      media_type: 'image',
      desktop_url: '',
      laptop_url: '',
      tablet_url: '',
      mobile_url: '',
      cta_text: '',
      cta_link: '',
      position: 0,
      is_active: true
    });
    loadData();
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      media_type: 'image',
      desktop_url: '',
      laptop_url: '',
      tablet_url: '',
      mobile_url: '',
      cta_text: '',
      cta_link: '',
      position: 0,
      is_active: true
    });
  };

  const handleFileUpload = async (file, device) => {
    setUploading({ ...uploading, [device]: true });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, [`${device}_url`]: file_url });
    setUploading({ ...uploading, [device]: false });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      await base44.entities.SiteBanner.delete(id);
      loadData();
    }
  };

  const toggleActive = async (banner) => {
    await base44.entities.SiteBanner.update(banner.id, { is_active: !banner.is_active });
    loadData();
  };

  const movePosition = async (banner, direction) => {
    const newPosition = direction === 'up' ? banner.position - 1 : banner.position + 1;
    await base44.entities.SiteBanner.update(banner.id, { position: newPosition });
    loadData();
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-6 px-6 shadow-2xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto">
          <Link to={createPageUrl('AdminDashboard')} className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-3 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">Hero Banner Manager</h1>
              <p className="text-gray-400 mt-1 text-sm">{banners.length} active banners • {showForm ? (editingBanner ? 'Editing' : 'Creating new') : 'Manage your homepage hero banners'}</p>
            </div>
            {!showForm && (
              <Button
                onClick={() => {
                  setEditingBanner(null);
                  setFormData({
                    title: '',
                    subtitle: '',
                    media_type: 'image',
                    desktop_url: '',
                    laptop_url: '',
                    tablet_url: '',
                    mobile_url: '',
                    cta_text: '',
                    cta_link: '',
                    position: banners.length,
                    is_active: true
                  });
                  setShowForm(true);
                }}
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Banner
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="border-2 border-yellow-400 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                        {editingBanner ? <Edit className="w-6 h-6 text-yellow-400" /> : <Plus className="w-6 h-6 text-yellow-400" />}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-black">{editingBanner ? 'Edit Banner' : 'Create New Banner'}</h2>
                        <p className="text-black/70 text-sm">Fill in the details below to {editingBanner ? 'update' : 'create'} your hero banner</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleCancel}
                      variant="ghost"
                      className="text-black hover:bg-black/10"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-8 bg-white">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700">Banner Title *</label>
                        <Input
                          placeholder="e.g., FITHIVE PORTO"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="text-lg font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700">Subtitle / Label</label>
                        <Input
                          placeholder="e.g., NOW OPEN"
                          value={formData.subtitle}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-3 text-gray-700">Media Type *</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, media_type: 'image' })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.media_type === 'image'
                                ? 'border-yellow-400 bg-yellow-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <ImageIcon className={`w-8 h-8 mx-auto mb-2 ${formData.media_type === 'image' ? 'text-yellow-600' : 'text-gray-400'}`} />
                            <p className="font-bold text-sm">Image</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, media_type: 'video' })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.media_type === 'video'
                                ? 'border-yellow-400 bg-yellow-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Video className={`w-8 h-8 mx-auto mb-2 ${formData.media_type === 'video' ? 'text-yellow-600' : 'text-gray-400'}`} />
                            <p className="font-bold text-sm">Video</p>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700">Call to Action Text</label>
                        <Input
                          placeholder="e.g., DISCOVER THE CLUB"
                          value={formData.cta_text}
                          onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700">Call to Action Link</label>
                        <Input
                          placeholder="e.g., /clubs or https://..."
                          value={formData.cta_link}
                          onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-700">Position Order</label>
                          <Input
                            type="number"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg w-full hover:bg-gray-100 transition-all">
                            <input
                              type="checkbox"
                              checked={formData.is_active}
                              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                              className="w-5 h-5 text-yellow-400"
                            />
                            <span className="text-sm font-medium">Active</span>
                            {formData.is_active && <Check className="w-4 h-4 text-green-600 ml-auto" />}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Media Uploads */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300">
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                          <Upload className="w-5 h-5 text-yellow-600" />
                          Responsive Media Upload
                        </h3>
                        <p className="text-xs text-gray-600 mb-4">Upload {formData.media_type}s for different screen sizes. Desktop is required, others are optional but recommended.</p>
                        
                        {['desktop', 'laptop', 'tablet', 'mobile'].map((device) => {
                          const sizes = { desktop: '1920x1080', laptop: '1366x768', tablet: '768x1024', mobile: '375x667' };
                          const deviceUrl = formData[`${device}_url`];
                          const isUploading = uploading[device];
                          
                          return (
                            <div key={device} className="mb-4 last:mb-0">
                              <label className="block text-xs font-bold mb-2 text-gray-700 uppercase">
                                {device} {device === 'desktop' && '*'} <span className="text-gray-400 font-normal">({sizes[device]})</span>
                              </label>
                              <div className="flex gap-2">
                                {deviceUrl && !isUploading && (
                                  <div className="flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 border-green-500">
                                    {formData.media_type === 'video' ? (
                                      <video src={deviceUrl} className="w-full h-full object-cover" muted />
                                    ) : (
                                      <img src={deviceUrl} alt={device} className="w-full h-full object-cover" />
                                    )}
                                  </div>
                                )}
                                <Input
                                  placeholder={`${formData.media_type} URL or upload`}
                                  value={deviceUrl}
                                  onChange={(e) => setFormData({ ...formData, [`${device}_url`]: e.target.value })}
                                  className="flex-1 text-sm"
                                  disabled={isUploading}
                                />
                                <Button
                                  type="button"
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = formData.media_type === 'video' ? 'video/*' : 'image/*';
                                    input.onchange = (e) => handleFileUpload(e.target.files[0], device);
                                    input.click();
                                  }}
                                  disabled={isUploading}
                                  className="flex-shrink-0"
                                  variant={deviceUrl ? "outline" : "default"}
                                >
                                  {isUploading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-8 pt-6 border-t">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-lg h-12"
                      disabled={!formData.title || !formData.desktop_url}
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {editingBanner ? 'Update Banner' : 'Create Banner'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <div className="space-y-4">
            {banners.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Banners Yet</h3>
                <p className="text-gray-500 mb-6">Create your first hero banner to get started</p>
                <Button
                  onClick={() => {
                    setFormData({
                      title: '',
                      subtitle: '',
                      media_type: 'image',
                      desktop_url: '',
                      laptop_url: '',
                      tablet_url: '',
                      mobile_url: '',
                      cta_text: '',
                      cta_link: '',
                      position: 0,
                      is_active: true
                    });
                    setShowForm(true);
                  }}
                  className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Banner
                </Button>
              </div>
            ) : (
              <AnimatePresence>
                {banners.map((banner, index) => (
                  <motion.div
                    key={banner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-2xl transition-all border-l-4 border-l-yellow-400 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Banner Preview */}
                          <div className="md:w-80 lg:w-96 relative group">
                            {banner.media_type === 'video' ? (
                              <video
                                src={banner.desktop_url || banner.laptop_url || banner.tablet_url || banner.mobile_url}
                                className="w-full h-48 md:h-full object-cover"
                                muted
                                loop
                                autoPlay
                              />
                            ) : (
                              <img
                                src={banner.desktop_url || banner.laptop_url || banner.tablet_url || banner.mobile_url}
                                alt={banner.title}
                                className="w-full h-48 md:h-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-bold text-sm bg-black/70 px-4 py-2 rounded-full">
                                {banner.media_type === 'video' ? '🎥 Video' : '🖼️ Image'}
                              </span>
                            </div>
                          </div>

                          {/* Banner Info */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-black">{banner.title}</h3>
                                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold">
                                    #{banner.position}
                                  </span>
                                </div>
                                {banner.subtitle && (
                                  <p className="text-gray-600 font-medium">{banner.subtitle}</p>
                                )}
                                {banner.cta_text && (
                                  <div className="mt-2 text-sm text-gray-500">
                                    <span className="font-semibold">CTA:</span> {banner.cta_text} → {banner.cta_link}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => toggleActive(banner)}
                                className={`p-3 rounded-xl transition-all ${
                                  banner.is_active 
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                {banner.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                              </button>
                            </div>

                            {/* Responsive Media Status */}
                            <div className="flex gap-2 mb-4">
                              {banner.desktop_url && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Desktop</span>}
                              {banner.laptop_url && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">Laptop</span>}
                              {banner.tablet_url && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Tablet</span>}
                              {banner.mobile_url && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">Mobile</span>}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleEdit(banner)}
                                className="bg-yellow-400 text-black hover:bg-yellow-500"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => movePosition(banner, 'up')}
                                disabled={index === 0}
                              >
                                <MoveUp className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => movePosition(banner, 'down')}
                                disabled={index === banners.length - 1}
                              >
                                <MoveDown className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(banner.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
}