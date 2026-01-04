import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Award, Calendar, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import GymLoader from '@/components/GymLoader';

export default function TrainerDetail() {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainer();
  }, []);

  const loadTrainer = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const trainerId = urlParams.get('id');
      
      if (!trainerId) {
        window.location.href = createPageUrl('About');
        return;
      }

      const trainers = await base44.entities.Trainer.filter({ id: trainerId });
      
      if (trainers.length === 0) {
        window.location.href = createPageUrl('About');
        return;
      }

      setTrainer(trainers[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trainer:', error);
      window.location.href = createPageUrl('About');
    }
  };

  const handleJoinSupervision = () => {
    if (trainer?.contact_email) {
      window.location.href = `${createPageUrl('Contact')}?trainer=${encodeURIComponent(trainer.name)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <GymLoader message="Loading trainer profile..." />
      </div>
    );
  }

  if (!trainer) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to={createPageUrl('About')}>
            <Button variant="ghost" className="text-white hover:text-yellow-400 mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to About
            </Button>
          </Link>
        </div>
      </section>

      {/* Trainer Profile */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={trainer.photo}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h1 className="text-4xl font-black text-white mb-2">{trainer.name}</h1>
                  <p className="text-yellow-400 text-lg font-bold">{trainer.body_type}</p>
                </div>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-yellow-50">
                  <CardContent className="p-6">
                    <Calendar className="w-8 h-8 text-yellow-600 mb-2" />
                    <p className="text-3xl font-black text-black">{trainer.experience_years}</p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50">
                  <CardContent className="p-6">
                    <Award className="w-8 h-8 text-yellow-600 mb-2" />
                    <p className="text-3xl font-black text-black">{trainer.certifications?.length || 0}</p>
                    <p className="text-sm text-gray-600">Certifications</p>
                  </CardContent>
                </Card>
              </div>

              {/* Specialization */}
              <div>
                <h2 className="text-2xl font-black mb-3">Specialization</h2>
                <p className="text-lg text-gray-700">{trainer.specialization}</p>
              </div>

              {/* Bio */}
              <div>
                <h2 className="text-2xl font-black mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{trainer.bio}</p>
              </div>

              {/* Training Philosophy */}
              {trainer.training_philosophy && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-black mb-3">Training Philosophy</h2>
                  <p className="text-gray-700 leading-relaxed italic">{trainer.training_philosophy}</p>
                </div>
              )}

              {/* Certifications */}
              {trainer.certifications && trainer.certifications.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black mb-4">Certifications</h2>
                  <div className="space-y-2">
                    {trainer.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {trainer.achievements && (
                <div>
                  <h2 className="text-2xl font-black mb-3">Key Achievements</h2>
                  <p className="text-gray-700 leading-relaxed">{trainer.achievements}</p>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-center">
                <h3 className="text-3xl font-black text-black mb-4">Ready to Transform?</h3>
                <p className="text-black/80 mb-6">Join {trainer.name}'s supervision program and achieve your fitness goals</p>
                <Button
                  onClick={handleJoinSupervision}
                  className="bg-black text-white hover:bg-gray-800 font-bold px-8 py-6 text-lg"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Join Supervision
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}