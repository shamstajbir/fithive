import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Monitor, 
  Smartphone, 
  Tablet,
  Download,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GymLoader from '@/components/GymLoader';
import * as XLSX from 'xlsx';
import { usePermissions } from '@/components/PermissionCheck';

export default function VisitorAnalytics() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState([]);
  const [filter, setFilter] = useState('all');
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const [stats, setStats] = useState({
    total: 0,
    desktop: 0,
    mobile: 0,
    tablet: 0,
    avgTimeSpent: 0,
    uniqueSessions: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      await loadVisitors();
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('VisitorAnalytics')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const loadVisitors = async () => {
    try {
      const data = await base44.entities.Visitor.list('-created_date', 1000);
      setVisitors(data);
      calculateStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading visitors:', error);
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const desktop = data.filter(v => v.device_type === 'desktop').length;
    const mobile = data.filter(v => v.device_type === 'mobile').length;
    const tablet = data.filter(v => v.device_type === 'tablet').length;
    const avgTimeSpent = data.reduce((sum, v) => sum + (v.time_spent_seconds || 0), 0) / total;
    const uniqueSessions = new Set(data.map(v => v.session_id)).size;

    setStats({ total, desktop, mobile, tablet, avgTimeSpent, uniqueSessions });
  };

  const getFilteredVisitors = () => {
    const now = new Date();
    let filtered = [...visitors];

    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(v => new Date(v.created_date) >= weekAgo);
    } else if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(v => new Date(v.created_date) >= monthAgo);
    } else if (filter === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(v => new Date(v.created_date) >= yearAgo);
    }

    return filtered;
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
    return `${Math.floor(seconds / 31536000)} years ago`;
  };

  const formatTimeSpent = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const exportToExcel = () => {
    const filtered = getFilteredVisitors();
    const exportData = filtered.map(v => ({
      'Page': v.page_name,
      'URL': v.page_url,
      'Device': v.device_type,
      'User': v.user_email || 'Guest',
      'Time Spent': formatTimeSpent(v.time_spent_seconds || 0),
      'Referrer': v.referrer,
      'Date': new Date(v.created_date).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visitors');
    XLSX.writeFile(wb, `visitor-analytics-${filter}-${Date.now()}.xlsx`);
  };

  const exportToCSV = () => {
    const filtered = getFilteredVisitors();
    const headers = ['Page', 'URL', 'Device', 'User', 'Time Spent', 'Referrer', 'Date'];
    const rows = filtered.map(v => [
      v.page_name,
      v.page_url,
      v.device_type,
      v.user_email || 'Guest',
      formatTimeSpent(v.time_spent_seconds || 0),
      v.referrer,
      new Date(v.created_date).toLocaleString()
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-analytics-${filter}-${Date.now()}.csv`;
    a.click();
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <GymLoader message="Loading analytics..." />
      </div>
    );
  }

  const filteredVisitors = getFilteredVisitors();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl('AdminDashboard')}>
            <Button variant="ghost" className="text-white hover:text-yellow-400 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Visitor Analytics</h1>
              <p className="text-gray-400">Real-time website traffic insights</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black">{filteredVisitors.length}</div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Unique Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black">{stats.uniqueSessions}</div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Avg. Time Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black">{formatTimeSpent(Math.floor(stats.avgTimeSpent))}</div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Mobile Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black">{Math.floor((stats.mobile / stats.total) * 100)}%</div>
                <Smartphone className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <Monitor className="w-10 h-10 text-blue-500" />
                <div>
                  <div className="text-2xl font-black">{stats.desktop}</div>
                  <div className="text-sm text-gray-600">Desktop</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Smartphone className="w-10 h-10 text-green-500" />
                <div>
                  <div className="text-2xl font-black">{stats.mobile}</div>
                  <div className="text-sm text-gray-600">Mobile</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Tablet className="w-10 h-10 text-purple-500" />
                <div>
                  <div className="text-2xl font-black">{stats.tablet}</div>
                  <div className="text-sm text-gray-600">Tablet</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-semibold">Filter by:</span>
          <div className="flex gap-2">
            {['all', 'week', 'month', 'year'].map(f => (
              <Button
                key={f}
                onClick={() => setFilter(f)}
                variant={filter === f ? 'default' : 'outline'}
                className={filter === f ? 'bg-yellow-400 text-black hover:bg-yellow-500' : ''}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-auto">
            Showing {filteredVisitors.length} visits
          </span>
        </div>

        {/* Visitor Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-bold">Page</th>
                    <th className="text-left py-3 px-4 font-bold">Device</th>
                    <th className="text-left py-3 px-4 font-bold">User</th>
                    <th className="text-left py-3 px-4 font-bold">Time Spent</th>
                    <th className="text-left py-3 px-4 font-bold">Referrer</th>
                    <th className="text-left py-3 px-4 font-bold">Visited</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisitors.map((visitor, index) => (
                    <motion.tr
                      key={visitor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold">{visitor.page_name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{visitor.page_url}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {visitor.device_type === 'desktop' && <Monitor className="w-4 h-4 text-blue-500" />}
                          {visitor.device_type === 'mobile' && <Smartphone className="w-4 h-4 text-green-500" />}
                          {visitor.device_type === 'tablet' && <Tablet className="w-4 h-4 text-purple-500" />}
                          <span className="capitalize">{visitor.device_type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {visitor.user_email ? (
                          <span className="text-blue-600">{visitor.user_email}</span>
                        ) : (
                          <span className="text-gray-500">Guest</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {formatTimeSpent(visitor.time_spent_seconds || 0)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600 truncate max-w-xs block">
                          {visitor.referrer}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {getTimeAgo(visitor.created_date)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}