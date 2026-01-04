import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InitializeSuperAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [done, setDone] = useState(false);
  const [existingRole, setExistingRole] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
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

      // Check if user already has a role
      const roles = await base44.entities.UserRole.filter({ user_email: currentUser.email });
      if (roles[0]) {
        setExistingRole(roles[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      base44.auth.redirectToLogin(window.location.pathname);
    }
  };

  const createSuperAdmin = async () => {
    if (!user || !user.email) {
      alert('User not authenticated. Please refresh the page.');
      return;
    }

    try {
      setCreating(true);
      
      await base44.entities.UserRole.create({
        user_email: user.email,
        role: 'super_admin',
        permissions: [],
        created_by_email: user.email,
        is_active: true
      });

      setDone(true);
      setTimeout(() => {
        window.location.href = '/AdminDashboard';
      }, 2000);
    } catch (error) {
      console.error('Error creating super admin:', error);
      alert('Error: ' + error.message);
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (existingRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You already have admin access as: <strong>{existingRole.role.replace('_', ' ').toUpperCase()}</strong></p>
            <Button 
              onClick={() => window.location.href = '/AdminDashboard'}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Go to Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            Initialize Super Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Super Admin Created!</h3>
              <p className="text-gray-600">Redirecting to admin dashboard...</p>
            </div>
          ) : (
            <>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Your Email:</strong> {user?.email}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Click below to grant yourself Super Admin access.
                </p>
              </div>

              <Button
                onClick={createSuperAdmin}
                disabled={creating || !user}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {creating ? 'Creating...' : 'Make Me Super Admin'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                This will grant you full administrative access to the platform.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}