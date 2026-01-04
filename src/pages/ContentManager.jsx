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
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePermissions } from '@/components/PermissionCheck';

export default function ContentManager() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    page_name: '',
    title: '',
    subtitle: '',
    hero_image: '',
    content: '',
    meta_description: '',
    is_active: true
  });
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('ContentManager')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const data = await base44.entities.PageContent.list('-created_date');
      setPages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading pages:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (editingPage) {
      await base44.entities.PageContent.update(editingPage.id, formData);
    } else {
      await base44.entities.PageContent.create(formData);
    }
    
    setShowDialog(false);
    setEditingPage(null);
    setFormData({
      page_name: '',
      title: '',
      subtitle: '',
      hero_image: '',
      content: '',
      meta_description: '',
      is_active: true
    });
    loadData();
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData(page);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this page?')) {
      await base44.entities.PageContent.delete(id);
      loadData();
    }
  };

  const toggleActive = async (page) => {
    await base44.entities.PageContent.update(page.id, { is_active: !page.is_active });
    loadData();
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-black text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl('AdminDashboard')} className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black">Content Manager</h1>
              <p className="text-gray-400 mt-2">{pages.length} pages</p>
            </div>
            <Button
              onClick={() => {
                setEditingPage(null);
                setFormData({
                  page_name: '',
                  title: '',
                  subtitle: '',
                  hero_image: '',
                  content: '',
                  meta_description: '',
                  is_active: true
                });
                setShowDialog(true);
              }}
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Page
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {pages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    {page.hero_image && (
                      <img
                        src={page.hero_image}
                        alt={page.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{page.title}</h3>
                      <button
                        onClick={() => toggleActive(page)}
                        className={`p-2 rounded-lg ${
                          page.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {page.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">ID: {page.page_name}</p>
                    {page.subtitle && (
                      <p className="text-sm text-gray-500 mb-4">{page.subtitle}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(page)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(page.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Page ID *</label>
              <Input
                placeholder="e.g., about-us"
                value={formData.page_name}
                onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                disabled={!!editingPage}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Title *</label>
              <Input
                placeholder="Page title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Subtitle</label>
              <Input
                placeholder="Page subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Hero Image URL</label>
              <Input
                placeholder="https://..."
                value={formData.hero_image}
                onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Content</label>
              <Textarea
                placeholder="Page content (HTML supported)"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="h-40"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Meta Description</label>
              <Textarea
                placeholder="SEO description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              />
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
              onClick={handleSave}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}