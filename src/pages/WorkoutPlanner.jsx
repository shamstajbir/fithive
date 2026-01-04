import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Sparkles, Loader2, Calendar, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function WorkoutPlanner() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fitness_goal: 'muscle_gain',
    fitness_level: 'intermediate',
    workout_days_per_week: 4,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const profiles = await base44.entities.UserProfile.filter({ user_id: currentUser.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setFormData({
          fitness_goal: profiles[0].fitness_goal,
          fitness_level: profiles[0].fitness_level,
          workout_days_per_week: profiles[0].workout_days_per_week,
        });
      } else {
        setShowForm(true);
      }

      const plans = await base44.entities.WorkoutPlan.filter({ user_id: currentUser.email, is_active: true });
      if (plans.length > 0) {
        setWorkoutPlan(plans[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const generateWorkoutPlan = async () => {
    setLoading(true);
    try {
      let currentProfile = profile;
      
      if (!currentProfile) {
        currentProfile = await base44.entities.UserProfile.create({
          user_id: user.email,
          ...formData,
        });
        setProfile(currentProfile);
      } else {
        await base44.entities.UserProfile.update(currentProfile.id, formData);
      }

      const prompt = `Generate a detailed ${formData.workout_days_per_week}-day per week workout plan for someone with the following profile:
- Fitness Goal: ${formData.fitness_goal}
- Fitness Level: ${formData.fitness_level}
- Days per Week: ${formData.workout_days_per_week}

Create a structured 4-week progressive workout plan with specific exercises, sets, reps, and rest periods for each day.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            plan_name: { type: 'string' },
            weeks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  week_number: { type: 'number' },
                  days: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        day_name: { type: 'string' },
                        exercises: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                              sets: { type: 'number' },
                              reps: { type: 'string' },
                              rest: { type: 'string' },
                              notes: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const plan = await base44.entities.WorkoutPlan.create({
        user_id: user.email,
        plan_name: result.plan_name,
        duration_weeks: 4,
        plan_data: result,
        is_active: true,
      });

      setWorkoutPlan(plan);
      setShowForm(false);
    } catch (error) {
      console.error('Error generating plan:', error);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Dumbbell className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-5xl md:text-7xl font-black mb-6">AI Workout Planner</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Get personalized workout plans tailored to your goals
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          {!workoutPlan || showForm ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <h2 className="text-3xl font-black mb-8">Tell us about yourself</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Fitness Goal</label>
                  <select
                    value={formData.fitness_goal}
                    onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Fitness Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({ ...formData, fitness_level: level })}
                        className={`py-3 rounded-xl font-bold transition-all ${
                          formData.fitness_level === level
                            ? 'bg-yellow-400 text-black'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Workout Days per Week: {formData.workout_days_per_week}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={formData.workout_days_per_week}
                    onChange={(e) => setFormData({ ...formData, workout_days_per_week: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={generateWorkoutPlan}
                  disabled={loading}
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500 py-6 text-lg font-bold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate AI Workout Plan
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg">
                <div>
                  <h2 className="text-3xl font-black mb-2">{workoutPlan.plan_data.plan_name}</h2>
                  <p className="text-gray-600">Your personalized {workoutPlan.duration_weeks}-week program</p>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
                >
                  Generate New Plan
                </Button>
              </div>

              {workoutPlan.plan_data.weeks.map((week) => (
                <motion.div
                  key={week.week_number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                    Week {week.week_number}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {week.days.map((day, idx) => (
                      <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-400 transition-all">
                        <h4 className="text-xl font-black mb-4">{day.day_name}</h4>
                        <div className="space-y-3">
                          {day.exercises.map((exercise, exIdx) => (
                            <div key={exIdx} className="bg-gray-50 rounded-lg p-4">
                              <h5 className="font-bold mb-2">{exercise.name}</h5>
                              <div className="flex gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  {exercise.sets} sets × {exercise.reps}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {exercise.rest}
                                </span>
                              </div>
                              {exercise.notes && (
                                <p className="text-xs text-gray-500 mt-2">{exercise.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}