import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare,
  Plus,
  Trash2,
  Save,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePermissions } from '@/components/PermissionCheck';

export default function NotificationSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [emails, setEmails] = useState(['baizidikhan@gmail.com']);
  const [whatsappNumbers, setWhatsappNumbers] = useState(['+918557841068']);
  const [newEmail, setNewEmail] = useState('');
  const [newWhatsApp, setNewWhatsApp] = useState('');
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('NotificationSettings')) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [permissionsLoading, hasPermission]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const data = await base44.entities.NotificationSettings.list();
      if (data.length > 0) {
        setSettings(data[0]);
        setEmails(data[0].email_addresses || ['baizidikhan@gmail.com']);
        setWhatsappNumbers(data[0].whatsapp_numbers || ['+918557841068']);
      } else {
        // Create default settings
        const newSettings = await base44.entities.NotificationSettings.create({
          setting_key: 'default',
          email_addresses: ['baizidikhan@gmail.com'],
          whatsapp_numbers: ['+918557841068'],
          notify_on_inquiry: true
        });
        setSettings(newSettings);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      window.location.href = createPageUrl('Home');
    }
  };

  const addEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail('');
    }
  };

  const removeEmail = (email) => {
    setEmails(emails.filter(e => e !== email));
  };

  const addWhatsApp = () => {
    if (newWhatsApp && !whatsappNumbers.includes(newWhatsApp)) {
      setWhatsappNumbers([...whatsappNumbers, newWhatsApp]);
      setNewWhatsApp('');
    }
  };

  const removeWhatsApp = (number) => {
    setWhatsappNumbers(whatsappNumbers.filter(n => n !== number));
  };

  const handleSave = async () => {
    await base44.entities.NotificationSettings.update(settings.id, {
      email_addresses: emails,
      whatsapp_numbers: whatsappNumbers
    });
    alert('Settings saved successfully!');
  };

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
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
          <h1 className="text-4xl font-black">Notification Settings</h1>
          <p className="text-gray-400 mt-2">Manage email and WhatsApp notifications</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Bell className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">Backend Functions Required</h3>
                    <p className="text-sm text-blue-800">
                      To enable automatic email and WhatsApp notifications, you need to enable <strong>Backend Functions</strong> in your app settings.
                      Once enabled, notifications will be sent automatically when users submit inquiries.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="flex-1">{email}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeEmail(email)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Add email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                  />
                  <Button onClick={addEmail} className="bg-yellow-400 text-black hover:bg-yellow-500">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* WhatsApp Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  WhatsApp Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {whatsappNumbers.map((number, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="flex-1">{number}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeWhatsApp(number)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="Add WhatsApp number (with country code)"
                    value={newWhatsApp}
                    onChange={(e) => setNewWhatsApp(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addWhatsApp()}
                  />
                  <Button onClick={addWhatsApp} className="bg-yellow-400 text-black hover:bg-yellow-500">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleSave}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6 text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}