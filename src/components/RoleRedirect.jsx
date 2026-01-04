import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

export default function RoleRedirect() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAndRedirect();
  }, []);

  const checkAndRedirect = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        setChecking(false);
        return;
      }

      const user = await base44.auth.me();
      if (!user || !user.email) {
        setChecking(false);
        return;
      }

      // Don't redirect - admins can visit website
      setChecking(false);
    } catch (error) {
      console.error('Error checking role:', error);
      setChecking(false);
    }
  };

  return null;
}