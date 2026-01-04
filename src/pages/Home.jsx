import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ClubsSection from '@/components/home/ClubsSection';
import ScheduleSection from '@/components/home/ScheduleSection';
import AmenitiesSection from '@/components/home/AmenitiesSection';
import ClassesSection from '@/components/home/ClassesSection';
import AppSection from '@/components/home/AppSection';
import BlogsSection from '@/components/home/BlogsSection';
import RoleRedirect from '@/components/RoleRedirect';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <main>
        <HeroSection />
        <section id="clubs">
          <ClubsSection />
        </section>
        <ScheduleSection />
        <AmenitiesSection />
        <section id="classes">
          <ClassesSection />
        </section>
        <section id="app">
          <AppSection />
        </section>
        <BlogsSection />
      </main>
    </div>
  );
}