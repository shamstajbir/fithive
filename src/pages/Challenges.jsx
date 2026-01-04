import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Award, Star, TrendingUp, Loader2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Challenges() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const allChallenges = await base44.entities.Challenge.filter({ is_active: true });
      setChallenges(allChallenges);

      const profiles = await base44.entities.UserProfile.filter({ user_id: currentUser.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      const myUserChallenges = await base44.entities.UserChallenge.filter({ user_id: currentUser.email });
      setUserChallenges(myUserChallenges);

      const myAchievements = await base44.entities.Achievement.filter({ user_id: currentUser.email }, '-earned_date', 20);
      setAchievements(myAchievements);

      const allProfiles = await base44.entities.UserProfile.list('-total_points', 10);
      
      // Enrich with user names
      const enrichedLeaderboard = await Promise.all(
        allProfiles.map(async (profile, idx) => {
          try {
            const users = await base44.entities.User.filter({ email: profile.user_id });
            return {
              ...profile,
              rank: idx + 1,
              name: users[0]?.full_name || 'Anonymous User',
              email: profile.user_id
            };
          } catch (error) {
            return {
              ...profile,
              rank: idx + 1,
              name: 'Anonymous User',
              email: profile.user_id
            };
          }
        })
      );
      
      setLeaderboard(enrichedLeaderboard);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const joinChallenge = async (challenge) => {
    try {
      await base44.entities.UserChallenge.create({
        user_id: user.email,
        challenge_id: challenge.id,
        current_progress: 0,
        is_completed: false,
      });
      await loadData();
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const getChallengeIcon = (type) => {
    const icons = {
      workout_streak: Flame,
      weight_goal: Target,
      distance: TrendingUp,
      time_based: Star,
    };
    return icons[type] || Trophy;
  };

  const getUserChallenge = (challengeId) => {
    return userChallenges.find(uc => uc.challenge_id === challengeId);
  };

  if (loading) {
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
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-5xl md:text-7xl font-black mb-6">Challenges & Rewards</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Complete challenges, earn badges, and climb the leaderboard
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Your Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 text-black"
              >
                <h2 className="text-3xl font-black mb-6">Your Stats</h2>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">{profile?.total_points || 0}</div>
                    <div className="text-sm opacity-80">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">{achievements.length}</div>
                    <div className="text-sm opacity-80">Badges Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">{userChallenges.filter(uc => uc.is_completed).length}</div>
                    <div className="text-sm opacity-80">Challenges Won</div>
                  </div>
                </div>
              </motion.div>

              {/* Active Challenges */}
              <div>
                <h2 className="text-3xl font-black mb-6">Active Challenges</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {challenges.map((challenge, idx) => {
                    const Icon = getChallengeIcon(challenge.challenge_type);
                    const userChallenge = getUserChallenge(challenge.id);
                    const progress = userChallenge ? (userChallenge.current_progress / challenge.target_value) * 100 : 0;
                    
                    return (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-yellow-400">{challenge.points_reward}</div>
                            <div className="text-xs text-gray-500">points</div>
                          </div>
                        </div>

                        <h3 className="text-xl font-black mb-2">{challenge.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>

                        {userChallenge ? (
                          <>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-bold">Progress</span>
                                <span className="font-bold">{userChallenge.current_progress} / {challenge.target_value}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-yellow-400 h-3 rounded-full transition-all"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                            </div>
                            {userChallenge.is_completed ? (
                              <div className="text-center py-2 bg-green-100 text-green-800 font-bold rounded-lg">
                                ✓ Completed
                              </div>
                            ) : (
                              <div className="text-center py-2 bg-blue-100 text-blue-800 font-bold rounded-lg">
                                In Progress
                              </div>
                            )}
                          </>
                        ) : (
                          <Button
                            onClick={() => joinChallenge(challenge)}
                            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
                          >
                            Join Challenge
                          </Button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Your Badges */}
              {achievements.length > 0 && (
                <div>
                  <h2 className="text-3xl font-black mb-6">Your Badges</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {achievements.map((achievement, idx) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-xl p-4 shadow-lg text-center hover:scale-105 transition-all"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Award className="w-8 h-8 text-black" />
                        </div>
                        <h4 className="font-black text-sm mb-1">{achievement.badge_name}</h4>
                        <p className="text-xs text-gray-500">{new Date(achievement.earned_date).toLocaleDateString()}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Crown className="w-8 h-8 text-yellow-400" />
                    <h2 className="text-2xl font-black">Leaderboard</h2>
                  </div>

                  <div className="space-y-4">
                    {leaderboard.map((player, idx) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                         player.email === user?.email
                           ? 'bg-yellow-100 border-2 border-yellow-400'
                           : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                          idx === 0 ? 'bg-yellow-400 text-black' :
                          idx === 1 ? 'bg-gray-300 text-black' :
                          idx === 2 ? 'bg-orange-300 text-black' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold">
                            {player.email === user?.email ? '👤 You' : player.name}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">{player.fitness_goal?.replace('_', ' ')}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-yellow-400">{player.total_points || 0}</div>
                          <div className="text-xs text-gray-500">pts</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}