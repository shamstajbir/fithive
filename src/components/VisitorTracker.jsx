import { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

export default function VisitorTracker({ currentPageName }) {
  const startTime = useRef(Date.now());
  const visitorId = useRef(null);
  const sessionId = useRef(null);

  useEffect(() => {
    // Get or create session ID
    if (!sessionId.current) {
      const stored = sessionStorage.getItem('visitor_session_id');
      if (stored) {
        sessionId.current = stored;
      } else {
        sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('visitor_session_id', sessionId.current);
      }
    }

    const trackVisit = async () => {
      try {
        const user = await base44.auth.me().catch(() => null);
        
        const deviceType = (() => {
          const ua = navigator.userAgent;
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
          if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
          return 'desktop';
        })();

        const visitor = await base44.entities.Visitor.create({
          page_name: currentPageName,
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          device_type: deviceType,
          referrer: document.referrer || 'Direct',
          session_id: sessionId.current,
          user_email: user?.email || null,
          time_spent_seconds: 0
        });

        visitorId.current = visitor.id;
        startTime.current = Date.now();
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();

    // Update time spent on unmount
    return () => {
      if (visitorId.current) {
        const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
        base44.entities.Visitor.update(visitorId.current, {
          time_spent_seconds: timeSpent
        }).catch(() => {});
      }
    };
  }, [currentPageName]);

  return null;
}