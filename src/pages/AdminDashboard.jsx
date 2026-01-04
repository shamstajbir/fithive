import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  MessageSquare, 
  FileText, 
  Settings, 
  TrendingUp,
  AlertCircle,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import BasicCalculator from '@/components/admin/BasicCalculator';
import InvestmentCalculator from '@/components/admin/InvestmentCalculator';
import BMRCalculator from '@/components/admin/BMRCalculator';
import QuickNotes from '@/components/admin/QuickNotes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import GymLoader from '@/components/GymLoader';
import { usePermissions } from '@/components/PermissionCheck';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    totalPages: 0,
    activeBanners: 0
  });
  const { userRole, hasPermission, isSuperAdmin } = usePermissions();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check if user is authenticated
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }

      const currentUser = await base44.auth.me();
      if (!currentUser || !currentUser.email) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      
      setUser(currentUser);
      
      // Wait for permissions to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const [inquiries, pages, banners] = await Promise.all([
        base44.entities.Inquiry.list('-created_date', 100),
        base44.entities.PageContent.list('-updated_date', 50),
        base44.entities.SiteBanner.list('position', 20)
      ]);

      setStats({
        totalInquiries: inquiries.length,
        newInquiries: inquiries.filter(i => i.status === 'new').length,
        totalPages: pages.length,
        activeBanners: banners.filter(b => b.is_active).length
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setLoading(false);
    }
  };

  const initializeSuperAdmin = async () => {
    try {
      await base44.entities.UserRole.create({
        user_email: user.email,
        role: 'super_admin',
        permissions: [],
        created_by_email: user.email,
        is_active: true
      });
      
      await loadData();
    } catch (error) {
      console.error('Error creating super admin:', error);
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GymLoader message="Loading admin panel..." />
      </div>
    );
  }

  // Check if user has no role - redirect to home
  if (!userRole && user) {
    window.location.href = createPageUrl('Home');
    return null;
  }

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: 'blue',
      link: 'InquiryManager'
    },
    {
      title: 'New Inquiries',
      value: stats.newInquiries,
      icon: AlertCircle,
      color: 'yellow',
      link: 'InquiryManager'
    },
    {
      title: 'Content Pages',
      value: stats.totalPages,
      icon: FileText,
      color: 'green',
      link: 'ContentManager'
    },
    {
      title: 'Active Banners',
      value: stats.activeBanners,
      icon: TrendingUp,
      color: 'purple',
      link: 'BannerManager'
    }
  ];

  const allActions = [
    { title: 'Manage Inquiries', icon: MessageSquare, link: 'InquiryManager', color: 'blue', permission: 'InquiryManager' },
    { title: 'Booking Manager', icon: MessageSquare, link: 'BookingManager', color: 'emerald', permission: 'BookingManager' },
    { title: 'Blog Manager', icon: FileText, link: 'BlogManager', color: 'indigo', permission: 'BlogManager' },
    { title: 'Package Manager', icon: TrendingUp, link: 'PackageManager', color: 'green', permission: 'PackageManager' },
    { title: 'Class Manager', icon: TrendingUp, link: 'ClassManager', color: 'purple', permission: 'ClassManager' },
    { title: 'Club Manager', icon: TrendingUp, link: 'ClubManager', color: 'cyan', permission: 'ClubManager' },
    { title: 'Schedule Manager', icon: TrendingUp, link: 'ClassScheduleManager', color: 'amber', permission: 'ClassScheduleManager' },
    { title: 'Content Manager', icon: FileText, link: 'ContentManager', color: 'orange', permission: 'ContentManager' },
    { title: 'Banner Manager', icon: TrendingUp, link: 'BannerManager', color: 'red', permission: 'BannerManager' },
    { title: 'Promo Banners', icon: Zap, link: 'PromoBannerManager', color: 'rose', permission: 'PromoBannerManager' },
    { title: 'Site Settings', icon: Settings, link: 'SiteSettingsManager', color: 'gray', permission: 'SiteSettingsManager' },
    { title: 'Visitor Analytics', icon: Users, link: 'VisitorAnalytics', color: 'pink', permission: 'VisitorAnalytics' },
    { title: 'Notification Settings', icon: Settings, link: 'NotificationSettings', color: 'slate', permission: 'NotificationSettings' }
  ];

  // Filter actions based on permissions
  const quickActions = allActions.filter(action => hasPermission(action.permission));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-black text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.full_name}</p>
              {userRole && (
                <p className="text-yellow-400 text-sm font-semibold">
                  {userRole.role.replace('_', ' ').toUpperCase()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {isSuperAdmin() && (
                <Link to={createPageUrl('SuperAdminPanel')}>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Super Admin Panel
                  </Button>
                </Link>
              )}
              <Link to={createPageUrl('Home')}>
                <Button variant="outline" className="bg-white text-black hover:bg-gray-200">
                  Back to Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(stat.link)}>
                <Card className="hover:shadow-xl transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        stat.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-500' :
                        stat.color === 'yellow' ? 'bg-yellow-100 group-hover:bg-yellow-400' :
                        stat.color === 'green' ? 'bg-green-100 group-hover:bg-green-500' :
                        'bg-purple-100 group-hover:bg-purple-500'
                      } transition-colors`}>
                        <stat.icon className={`w-6 h-6 ${
                          stat.color === 'blue' ? 'text-blue-600 group-hover:text-white' :
                          stat.color === 'yellow' ? 'text-yellow-600 group-hover:text-black' :
                          stat.color === 'green' ? 'text-green-600 group-hover:text-white' :
                          'text-purple-600 group-hover:text-white'
                        } transition-colors`} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-black mb-6">Quick Actions</h2>
          {quickActions.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No permissions assigned. Contact your super admin.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
              <Link key={index} to={createPageUrl(action.link)}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center ${
                    action.color === 'blue' ? 'bg-blue-500' :
                    action.color === 'emerald' ? 'bg-emerald-500' :
                    action.color === 'indigo' ? 'bg-indigo-500' :
                    action.color === 'green' ? 'bg-green-500' :
                    action.color === 'purple' ? 'bg-purple-500' :
                    action.color === 'cyan' ? 'bg-cyan-500' :
                    action.color === 'amber' ? 'bg-amber-500' :
                    action.color === 'orange' ? 'bg-orange-500' :
                    action.color === 'red' ? 'bg-red-500' :
                    action.color === 'pink' ? 'bg-pink-500' :
                    action.color === 'rose' ? 'bg-rose-500' :
                    action.color === 'teal' ? 'bg-teal-500' :
                    action.color === 'slate' ? 'bg-slate-500' :
                    'bg-gray-800'
                  }`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{action.title}</h3>
                </motion.div>
                </Link>
                ))}
                </div>
                )}
                </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Admin Tools & Utilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BasicCalculator />
            <InvestmentCalculator />
            <BMRCalculator />
            <QuickNotes />
          </div>
        </motion.div>
      </div>
    </div>
  );
}