import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

export function usePermissions() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        setLoading(false);
        return;
      }

      const user = await base44.auth.me();
      if (!user || !user.email) {
        setLoading(false);
        return;
      }

      const roles = await base44.entities.UserRole.filter({ 
        user_email: user.email,
        is_active: true 
      });
      
      if (roles[0]) {
        setUserRole(roles[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading permissions:', error);
      setLoading(false);
    }
  };

  const hasPermission = (page) => {
    if (!userRole) return false;
    if (userRole.role === 'super_admin') return true;
    return userRole.permissions?.includes(page) || false;
  };

  const isSuperAdmin = () => {
    return userRole?.role === 'super_admin';
  };

  const isAdmin = () => {
    return userRole?.role === 'admin';
  };

  return { userRole, loading, hasPermission, isSuperAdmin, isAdmin };
}

export function ProtectedPage({ children, requiredPage }) {
  const { userRole, loading, hasPermission } = usePermissions();

  useEffect(() => {
    if (!loading && !hasPermission(requiredPage)) {
      window.location.href = createPageUrl('AdminDashboard');
    }
  }, [loading, userRole, requiredPage]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!hasPermission(requiredPage)) {
    return null;
  }

  return children;
}