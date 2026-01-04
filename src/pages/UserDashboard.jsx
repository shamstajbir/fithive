import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  User, Camera, Mail, Phone, TrendingUp, Target, Award, 
  Calendar, Activity, Dumbbell, Apple, BarChart3, Trophy,
  Edit, Save, X, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GymLoader from '@/components/GymLoader';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [stats, setStats] = useState({
    workoutPlans: 0,
    mealPlans: 0,
    progressLogs: 0,
    achievements: 0,
    activeChallenges: 0,
    totalPoints: 0
  });
  const [progressData, setProgressData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    current_weight: '',
    target_weight: '',
    fitness_goal: 'general_fitness',
    fitness_level: 'beginner'
  });

  useEffect(() => {
    checkAuthAndLoadData();
    
    // Auto-refresh data every 30 seconds
    const interval = setInterval(() => {
      if (user) loadUserData(user);
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const checkAuthAndLoadData = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      
      if (!isAuth) {
        // Redirect to login
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Calculate BMI
      if (currentUser.current_weight && currentUser.height) {
        const heightInMeters = currentUser.height / 100;
        const calculatedBMI = (currentUser.current_weight / (heightInMeters * heightInMeters)).toFixed(1);
        setBmi(calculatedBMI);
        
        if (calculatedBMI < 18.5) setBmiCategory('Underweight');
        else if (calculatedBMI < 25) setBmiCategory('Normal');
        else if (calculatedBMI < 30) setBmiCategory('Overweight');
        else setBmiCategory('Obese');
      }

      setProfileForm({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        age: currentUser.age || '',
        height: currentUser.height || '',
        current_weight: currentUser.current_weight || '',
        target_weight: currentUser.target_weight || '',
        fitness_goal: currentUser.fitness_goal || 'general_fitness',
        fitness_level: currentUser.fitness_level || 'beginner'
      });

      await loadUserData(currentUser);
      setLoading(false);
    } catch (error) {
      console.error('Auth error:', error);
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  const loadUserData = async (currentUser) => {
    try {
      // Load user profile
      const profiles = await base44.entities.UserProfile.filter({ user_id: currentUser.id });
      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
      }

      // Load stats
      const workoutPlans = await base44.entities.WorkoutPlan.filter({ user_id: currentUser.id });
      const mealPlans = await base44.entities.MealPlan.filter({ user_id: currentUser.id });
      const progressLogs = await base44.entities.ProgressLog.filter({ user_id: currentUser.id });
      const userAchievements = await base44.entities.Achievement.filter({ user_id: currentUser.id });
      const challenges = await base44.entities.UserChallenge.filter({ user_id: currentUser.id });

      setStats({
        workoutPlans: workoutPlans.length,
        mealPlans: mealPlans.length,
        progressLogs: progressLogs.length,
        achievements: userAchievements.length,
        activeChallenges: challenges.filter(c => !c.is_completed).length,
        totalPoints: profiles[0]?.total_points || 0
      });

      setAchievements(userAchievements);

      // Format progress data for chart
      const chartData = progressLogs
        .sort((a, b) => new Date(a.log_date) - new Date(b.log_date))
        .slice(-10)
        .map(log => ({
          date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: log.weight || 0,
          bodyFat: log.body_fat_percentage || 0
        }));
      setProgressData(chartData);

      // Load leaderboard
      const allProfiles = await base44.entities.UserProfile.list('-total_points', 10);
      const leaderboardData = await Promise.all(
        allProfiles.map(async (profile) => {
          try {
            const users = await base44.entities.User.filter({ email: profile.user_id });
            return {
              name: users[0]?.full_name || 'Anonymous User',
              points: profile.total_points || 0,
              level: profile.fitness_level || 'beginner',
              email: profile.user_id
            };
          } catch (error) {
            return {
              name: 'Anonymous User',
              points: profile.total_points || 0,
              level: profile.fitness_level || 'beginner',
              email: profile.user_id
            };
          }
        })
      );
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await base44.auth.updateMe(profileForm);
      const updatedUser = { ...user, ...profileForm };
      setUser(updatedUser);
      
      // Recalculate BMI
      if (profileForm.current_weight && profileForm.height) {
        const heightInMeters = profileForm.height / 100;
        const calculatedBMI = (profileForm.current_weight / (heightInMeters * heightInMeters)).toFixed(1);
        setBmi(calculatedBMI);
        
        if (calculatedBMI < 18.5) setBmiCategory('Underweight');
        else if (calculatedBMI < 25) setBmiCategory('Normal');
        else if (calculatedBMI < 30) setBmiCategory('Overweight');
        else setBmiCategory('Obese');
      }
      
      setEditingProfile(false);
      await loadUserData(updatedUser);
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <GymLoader message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      {/* Header */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-black" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2">Welcome back, {user?.full_name || 'User'}!</h1>
                <p className="text-gray-300 text-lg">Track your fitness journey and achieve your goals</p>
              </div>
            </div>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Dumbbell, label: 'Workout Plans', value: stats.workoutPlans, color: 'blue' },
            { icon: Apple, label: 'Meal Plans', value: stats.mealPlans, color: 'green' },
            { icon: TrendingUp, label: 'Progress Logs', value: stats.progressLogs, color: 'purple' },
            { icon: Trophy, label: 'Total Points', value: stats.totalPoints, color: 'yellow' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'purple' ? 'bg-purple-100' :
                      'bg-yellow-100'
                    }`}>
                      <stat.icon className={`w-7 h-7 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-3xl font-black">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* BMI Card */}
            {bmi && (
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader>
                  <CardTitle>Your Current BMI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-5xl font-black text-yellow-600">{bmi}</p>
                      <p className="text-lg font-bold mt-2">{bmiCategory}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Weight: {user?.current_weight} kg | Height: {user?.height} cm
                      </p>
                    </div>
                    <div className="text-right">
                      <Activity className="w-16 h-16 text-yellow-400 mb-2" />
                      {user?.target_weight && (
                        <p className="text-sm text-gray-600">
                          Target: {user.target_weight} kg
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* BMI Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weight & Body Fat Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {progressData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#facc15" strokeWidth={2} name="Weight (kg)" />
                        <Line type="monotone" dataKey="bodyFat" stroke="#3b82f6" strokeWidth={2} name="Body Fat %" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No progress data yet</p>
                      <Link to={createPageUrl('ProgressTracker')}>
                        <Button className="mt-4 bg-yellow-400 text-black hover:bg-yellow-500">
                          Start Tracking
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.activeChallenges > 0 ? (
                      <div className="text-center py-8">
                        <Target className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                        <p className="text-2xl font-black mb-2">{stats.activeChallenges}</p>
                        <p className="text-gray-600">Challenges in Progress</p>
                        <Link to={createPageUrl('Challenges')}>
                          <Button className="mt-4 bg-yellow-400 text-black hover:bg-yellow-500">
                            View Challenges
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No active challenges</p>
                        <Link to={createPageUrl('Challenges')}>
                          <Button className="mt-4 bg-yellow-400 text-black hover:bg-yellow-500">
                            Join a Challenge
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Tools Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>AI Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { icon: Dumbbell, label: 'Workout Planner', link: 'WorkoutPlanner', color: 'blue' },
                    { icon: Apple, label: 'Meal Planner', link: 'MealPlanner', color: 'green' },
                    { icon: BarChart3, label: 'Progress Tracker', link: 'ProgressTracker', color: 'purple' },
                    { icon: Trophy, label: 'Challenges', link: 'Challenges', color: 'yellow' }
                  ].map((tool, index) => (
                    <Link key={index} to={createPageUrl(tool.link)}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-all cursor-pointer text-center"
                      >
                        <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                          tool.color === 'blue' ? 'bg-blue-100' :
                          tool.color === 'green' ? 'bg-green-100' :
                          tool.color === 'purple' ? 'bg-purple-100' :
                          'bg-yellow-100'
                        }`}>
                          <tool.icon className={`w-6 h-6 ${
                            tool.color === 'blue' ? 'text-blue-600' :
                            tool.color === 'green' ? 'text-green-600' :
                            tool.color === 'purple' ? 'text-purple-600' :
                            'text-yellow-600'
                          }`} />
                        </div>
                        <p className="font-bold">{tool.label}</p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  {!editingProfile && (
                    <Button variant="outline" onClick={() => setEditingProfile(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Full Name</label>
                        <Input
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <Input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Phone</label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Age</label>
                        <Input
                          type="number"
                          value={profileForm.age}
                          onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Height (cm)</label>
                        <Input
                          type="number"
                          value={profileForm.height}
                          onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Current Weight (kg)</label>
                        <Input
                          type="number"
                          value={profileForm.current_weight}
                          onChange={(e) => setProfileForm({ ...profileForm, current_weight: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Full Name</p>
                        <p className="font-bold text-lg">{user?.full_name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-bold text-lg">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-bold text-lg">{user?.phone || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Age</p>
                        <p className="font-bold text-lg">{user?.age || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Height</p>
                        <p className="font-bold text-lg">{user?.height ? `${user.height} cm` : 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Weight</p>
                        <p className="font-bold text-lg">{user?.current_weight ? `${user.current_weight} kg` : 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress Journey</CardTitle>
              </CardHeader>
              <CardContent>
                {progressData.length > 0 ? (
                  <div className="space-y-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#facc15" strokeWidth={3} name="Weight (kg)" />
                        <Line type="monotone" dataKey="bodyFat" stroke="#3b82f6" strokeWidth={3} name="Body Fat %" />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="text-center">
                      <Link to={createPageUrl('ProgressTracker')}>
                        <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                          Add New Progress Log
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 mb-6">Start tracking your progress today!</p>
                    <Link to={createPageUrl('ProgressTracker')}>
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                        Track Progress
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements ({achievements.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl text-center"
                      >
                        <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                        <h3 className="font-black text-lg mb-2">{achievement.badge_name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{achievement.badge_description}</p>
                        <p className="text-xs text-gray-500">
                          Earned: {new Date(achievement.earned_date).toLocaleDateString()}
                        </p>
                        <p className="text-yellow-600 font-bold mt-2">+{achievement.points_earned} points</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 mb-6">No achievements yet. Complete challenges to earn badges!</p>
                    <Link to={createPageUrl('Challenges')}>
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                        View Challenges
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Top Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl ${
                       member.email === user?.email ? 'bg-yellow-100 border-2 border-yellow-400' :
                       index < 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                        index === 0 ? 'bg-yellow-400 text-black' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-300 text-orange-900' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                       <p className="font-black text-lg">
                         {member.email === user?.email ? '👤 You' : member.name}
                       </p>
                       <p className="text-sm text-gray-600 capitalize">{member.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-yellow-600">{member.points}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}