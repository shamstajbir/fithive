
import React, { useEffect } from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import ChatWidget from '@/components/ChatWidget';
import VisitorTracker from '@/components/VisitorTracker';
import PromoTopBar from '@/components/PromoTopBar';
import PromoPopup from '@/components/PromoPopup';

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    // Hide Base44 badge
    const hideBadge = () => {
      const badges = document.querySelectorAll('#base44-badge, [id*="base44-badge"], [class*="base44"]');
      badges.forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.remove();
      });
    };
    
    hideBadge();
    const interval = setInterval(hideBadge, 100);
    setTimeout(() => clearInterval(interval), 3000);
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
    
    // Set page title dynamically
    const pageTitles = {
      'Home': 'FitHive - Transform Your Body, Elevate Your Mind',
      'Clubs': 'Our Clubs - FitHive',
      'Classes': 'Fitness Classes - FitHive',
      'Packages': 'Membership Packages - FitHive',
      'Contact': 'Contact Us - FitHive',
      'About': 'About Us - FitHive',
      'Blogs': 'Blog - FitHive',
      'ClassSchedule': 'Class Schedule - FitHive',
      'WorkoutPlanner': 'AI Workout Planner - FitHive',
      'MealPlanner': 'AI Meal Planner - FitHive',
      'ProgressTracker': 'Progress Tracker - FitHive',
      'Challenges': 'Challenges & Rewards - FitHive',
      'App': 'Mobile App - FitHive',
      'AdminDashboard': 'Admin Dashboard - FitHive',
      'InquiryManager': 'Inquiry Manager - FitHive',
      'ContentManager': 'Content Manager - FitHive',
      'BannerManager': 'Banner Manager - FitHive',
      'NotificationSettings': 'Notification Settings - FitHive',
    };
    
    document.title = pageTitles[currentPageName] || 'FitHive';
  }, [currentPageName]);

  // Admin pages - hide header, footer, and chat widget
  const adminPages = ['AdminDashboard', 'InquiryManager', 'ContentManager', 'BannerManager', 'NotificationSettings', 'UserManager', 'BlogManager', 'VisitorAnalytics', 'SiteSettingsManager', 'PackageManager', 'ClassManager', 'ClubManager', 'ClassScheduleManager', 'BookingManager', 'SuperAdminPanel', 'PromoBannerManager'];
  const isAdminPage = adminPages.includes(currentPageName);

  if (isAdminPage) {
    return (
      <div className="min-h-screen">
        {children}
        <VisitorTracker currentPageName={currentPageName} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <PromoTopBar />
      </div>
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <Header currentPageName={currentPageName} />
      </div>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatWidget currentPageName={currentPageName} />
      <PromoPopup />
      <VisitorTracker currentPageName={currentPageName} />
    </div>
  );
}
