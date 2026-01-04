import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Settings, Upload, Image, ArrowUp, ArrowDown, Plus, Trash2, 
  Save, Eye, EyeOff, Menu, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GymLoader from '@/components/GymLoader';
import { toast } from 'sonner';
import { usePermissions } from '@/components/PermissionCheck';

const AVAILABLE_PAGES = [
  { name: 'Home', label: 'Home' },
  { name: 'About', label: 'About Us' },
  { name: 'Clubs', label: 'Our Clubs' },
  { name: 'Classes', label: 'Classes' },
  { name: 'ClassSchedule', label: 'Schedule' },
  { name: 'Packages', label: 'Packages' },
  { name: 'WorkoutPlanner', label: 'Workout Planner' },
  { name: 'MealPlanner', label: 'Meal Planner' },
  { name: 'ProgressTracker', label: 'Progress Tracker' },
  { name: 'Challenges', label: 'Challenges' },
  { name: 'Blogs', label: 'Blog' },
  { name: 'Contact', label: 'Contact' },
  { name: 'App', label: 'Mobile App' },
  { name: 'FAQs', label: 'FAQs' },
  { name: 'PrivacyPolicy', label: 'Privacy Policy' },
  { name: 'TermsOfService', label: 'Terms of Service' }
];

export default function SiteSettingsManager() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoWidth, setLogoWidth] = useState(120);
  const [logoHeight, setLogoHeight] = useState(40);
  const [navbarPages, setNavbarPages] = useState([]);
  const [footerPages, setFooterPages] = useState([]);
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('SiteSettingsManager')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const existingSettings = await base44.entities.SiteSettings.filter({ setting_key: 'main' });
      
      if (existingSettings.length > 0) {
        const siteSettings = existingSettings[0];
        setSettings(siteSettings);
        setLogoUrl(siteSettings.logo_url || '');
        setLogoWidth(siteSettings.logo_width || 120);
        setLogoHeight(siteSettings.logo_height || 40);
        
        // Sort by order before setting
        const sortedNav = (siteSettings.navbar_pages || getDefaultNavbarPages()).sort((a, b) => a.order - b.order);
        const sortedFooter = (siteSettings.footer_pages || getDefaultFooterPages()).sort((a, b) => a.order - b.order);
        
        setNavbarPages(sortedNav);
        setFooterPages(sortedFooter);
      } else {
        setNavbarPages(getDefaultNavbarPages());
        setFooterPages(getDefaultFooterPages());
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      window.location.href = createPageUrl('Home');
    }
  };

  const getDefaultNavbarPages = () => [
    { page_name: 'Clubs', label: 'Clubs', order: 1 },
    { page_name: 'Classes', label: 'Classes', order: 2 },
    { page_name: 'Packages', label: 'Packages', order: 3 },
    { page_name: 'App', label: 'App', order: 4 },
    { page_name: 'About', label: 'About', order: 5 }
  ];

  const getDefaultFooterPages = () => [
    { page_name: 'Clubs', label: 'Our Clubs', order: 1 },
    { page_name: 'Classes', label: 'Classes', order: 2 },
    { page_name: 'Packages', label: 'Packages', order: 3 },
    { page_name: 'Blogs', label: 'Blog', order: 4 },
    { page_name: 'About', label: 'About Us', order: 5 },
    { page_name: 'ClassSchedule', label: 'Class Schedule', order: 6 }
  ];

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setLogoUrl(file_url);
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsData = {
        setting_key: 'main',
        logo_url: logoUrl,
        logo_width: logoWidth,
        logo_height: logoHeight,
        navbar_pages: navbarPages.map((p, idx) => ({ ...p, order: idx + 1 })),
        footer_pages: footerPages.map((p, idx) => ({ ...p, order: idx + 1 }))
      };

      if (settings) {
        await base44.entities.SiteSettings.update(settings.id, settingsData);
      } else {
        await base44.entities.SiteSettings.create(settingsData);
      }

      toast.success('Settings saved successfully!');
      await loadData();
    } catch (error) {
      toast.error('Failed to save settings');
    }
    setSaving(false);
  };

  const moveItem = (list, setList, index, direction) => {
    const newList = [...list];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setList(newList);
  };

  const addPage = (list, setList, pageName, label) => {
    if (list.find(p => p.page_name === pageName)) {
      toast.error('Page already added');
      return;
    }
    setList([...list, { page_name: pageName, label, order: list.length + 1 }]);
  };

  const removePage = (list, setList, index) => {
    setList(list.filter((_, idx) => idx !== index));
  };

  const updateLabel = (list, setList, index, newLabel) => {
    const newList = [...list];
    newList[index].label = newLabel;
    setList(newList);
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GymLoader message="Loading settings..." />
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
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-black mb-2">Site Settings</h1>
                <p className="text-gray-400">Manage logo, navigation, and footer</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
            >
              {saving ? <GymLoader message="Saving..." /> : <><Save className="w-5 h-5 mr-2" />Save All Changes</>}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Logo Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-6 h-6" />
              Logo Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Upload Logo</label>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => document.getElementById('logo-upload').click()}
                  disabled={uploading}
                  variant="outline"
                  className="font-bold"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {logoUrl && (
                  <img 
                    src={logoUrl} 
                    alt="Logo preview" 
                    style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
                    className="object-contain"
                  />
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Logo Width (px): {logoWidth}</label>
                <Input
                  type="range"
                  min="80"
                  max="300"
                  value={logoWidth}
                  onChange={(e) => setLogoWidth(parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Logo Height (px): {logoHeight}</label>
                <Input
                  type="range"
                  min="30"
                  max="150"
                  value={logoHeight}
                  onChange={(e) => setLogoHeight(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Logo URL</label>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Or paste logo URL directly"
              />
            </div>
          </CardContent>
        </Card>

        {/* Navbar Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="w-6 h-6" />
              Navigation Bar Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {navbarPages.map((page, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveItem(navbarPages, setNavbarPages, idx, 'up')}
                      disabled={idx === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveItem(navbarPages, setNavbarPages, idx, 'down')}
                      disabled={idx === navbarPages.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 grid md:grid-cols-2 gap-2">
                    <Input
                      value={page.page_name}
                      disabled
                      className="bg-white"
                    />
                    <Input
                      value={page.label}
                      onChange={(e) => updateLabel(navbarPages, setNavbarPages, idx, e.target.value)}
                      placeholder="Display label"
                      className="bg-white"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removePage(navbarPages, setNavbarPages, idx)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-bold mb-2">Add Page to Navbar</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {AVAILABLE_PAGES.map((page) => (
                  <Button
                    key={page.name}
                    size="sm"
                    variant="outline"
                    onClick={() => addPage(navbarPages, setNavbarPages, page.name, page.label)}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {page.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="w-6 h-6" />
              Footer Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {footerPages.map((page, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveItem(footerPages, setFooterPages, idx, 'up')}
                      disabled={idx === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveItem(footerPages, setFooterPages, idx, 'down')}
                      disabled={idx === footerPages.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 grid md:grid-cols-2 gap-2">
                    <Input
                      value={page.page_name}
                      disabled
                      className="bg-white"
                    />
                    <Input
                      value={page.label}
                      onChange={(e) => updateLabel(footerPages, setFooterPages, idx, e.target.value)}
                      placeholder="Display label"
                      className="bg-white"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removePage(footerPages, setFooterPages, idx)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-bold mb-2">Add Page to Footer</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {AVAILABLE_PAGES.map((page) => (
                  <Button
                    key={page.name}
                    size="sm"
                    variant="outline"
                    onClick={() => addPage(footerPages, setFooterPages, page.name, page.label)}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {page.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}