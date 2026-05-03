import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  LayoutDashboard, 
  Briefcase, 
  BookOpen,
  Settings,
  ArrowRight,
  FileText,
  Zap,
  Crown,
  Award,
  Flame,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getUserResults, getDashboardAnalytics } from '../services/resumeService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parsedData, setParsedData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unlockedCompany, setUnlockedCompany] = useState(localStorage.getItem('unlockedCompany') || null);
  const quizProgress = analytics?.quizProgress || { completed: 0, total: 0, completionRate: 0, averageScore: 0 };
  const progressTrend = analytics?.progressTrend || [];
  const skillProficiency = analytics?.skillProficiency || [];
  const weeklyGoals = analytics?.weeklyGoals || [];
  const activeDays = analytics?.activeDays || progressTrend.filter((value) => value > 0).length;
  const dailyPrepProgress = analytics?.dailyPrepProgress || 0;
  const momentumScore = analytics?.momentumScore || 0;

  const handleViewPlan = (companyName) => {
    if (!unlockedCompany) {
      localStorage.setItem('unlockedCompany', companyName);
      setUnlockedCompany(companyName);
      navigate(`/plan/${companyName}`);
    } else if (unlockedCompany === companyName) {
      navigate(`/plan/${companyName}`);
    } else {
      navigate('/pricing');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user?.uid) {
        setLoading(true);
        try {
          const data = await getUserResults(user.uid);
          if (data) {
            setParsedData(data);
            // Fetch analytics after getting company data
            const analyticsData = await getDashboardAnalytics(user.uid, data.companies || []);
            setAnalytics(analyticsData);
          }
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-12">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl font-black">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase italic mb-1">
                  {user?.displayName || 'User'}
                </h1>
                <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                  {user?.email}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center gap-3 px-6 py-3 bg-black border border-amber-500/30 rounded-2xl hover:border-amber-500/60 transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 group-hover:text-amber-400">
                {sidebarOpen ? 'Focus' : 'Expand'}
              </span>
              <LayoutDashboard size={16} className="text-amber-500" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className={`${sidebarOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-8 transition-all duration-500`}>
            
            {loading ? (
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading Analytics...</p>
              </div>
            ) : (
              <>
              {!parsedData ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-amber-500/20 rounded-xl">
                      <Zap className="text-amber-500" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black uppercase">Get Started with Resume Analysis</h3>
                      <p className="text-slate-400 text-xs font-medium mt-1">Upload your resume to unlock personalized prep plans for your target companies</p>
                    </div>
                    <button
                      onClick={() => navigate('/resume-parsing')}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      Upload Resume
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Job Readiness', value: `${analytics?.jobReadiness ?? 0}%`, icon: Briefcase, color: 'from-amber-500 to-amber-600', change: 'From company matches' },
                      { label: 'Daily Prep', value: `${dailyPrepProgress}%`, icon: TrendingUp, color: 'from-green-500 to-green-600', change: `${quizProgress.completed}/${quizProgress.total} answered • ${momentumScore}% momentum` },
                      { label: 'Companies', value: `${parsedData.companies?.length || 0}`, icon: Target, color: 'from-blue-500 to-blue-600', change: 'Real matches' },
                      { label: 'Average Score', value: `${quizProgress.averageScore || 0}%`, icon: BookOpen, color: 'from-purple-500 to-purple-600', change: `${activeDays} active days` },
                    ].map((metric, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{metric.label}</span>
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} shadow-lg`}>
                            <metric.icon size={16} className="text-white" />
                          </div>
                        </div>
                        <div className="text-2xl font-black mb-2">{metric.value}</div>
                        <p className="text-[9px] text-slate-500 font-bold">{metric.change}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Chart & Skills Heatmap */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Improvement Graph */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-1">Progress Trend</h3>
                          <p className="text-[10px] font-bold text-slate-500">Actual completion rate by day</p>
                        </div>
                        <BarChart3 size={20} className="text-amber-500" />
                      </div>

                      {progressTrend.length > 0 ? (
                        <div className="space-y-4">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                            const value = progressTrend[idx] || 0;
                            const height = Math.max(18, value * 1.25);
                            return (
                              <div key={idx} className="flex items-end gap-3">
                                <span className="text-[9px] font-bold text-slate-600 w-8">{day}</span>
                                <div className="flex-1 flex items-end gap-1">
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}px` }}
                                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                                    className="flex-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-sm"
                                  />
                                </div>
                                <span className="text-[9px] font-bold text-slate-600 w-6">{value}%</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-[260px] flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02] px-6">
                          <BarChart3 size={28} className="text-slate-600 mb-3" />
                          <p className="text-sm font-black text-white mb-1">No daily prep data yet</p>
                          <p className="text-xs text-slate-500 max-w-sm">Answer a few practice questions and the dashboard will build a real trend line from your activity.</p>
                        </div>
                      )}
                    </motion.div>

                    {/* Skills Distribution Heatmap */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-1">Skills Proficiency</h3>
                          <p className="text-[10px] font-bold text-slate-500">Derived from your matched companies</p>
                        </div>
                        <Flame size={20} className="text-amber-500" />
                      </div>

                      {skillProficiency.length > 0 ? (
                        <div className="space-y-3">
                          {skillProficiency.map((skill, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-slate-400">{skill.name}</span>
                                <span className="text-[9px] font-black text-slate-500">{skill.proficiency}%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.proficiency}%` }}
                                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.8 }}
                                  className={`h-full bg-gradient-to-r ${
                                    skill.proficiency >= 80 ? 'from-green-500 to-green-600' : 
                                    skill.proficiency >= 60 ? 'from-amber-500 to-amber-600' : 
                                    'from-red-500 to-red-600'
                                  } rounded-full`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-[220px] flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02] px-6">
                          <Flame size={28} className="text-slate-600 mb-3" />
                          <p className="text-sm font-black text-white mb-1">No skill profile yet</p>
                          <p className="text-xs text-slate-500 max-w-sm">Company matches will populate this chart with real proficiency signals once your resume analysis is available.</p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Company Match Heatmap */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-1">Company Match Heatmap</h3>
                        <p className="text-[10px] font-bold text-slate-500">{parsedData.companies?.length || 0} companies analyzed</p>
                      </div>
                      <Target size={20} className="text-amber-500" />
                    </div>

                    <div className="space-y-6">
                      {parsedData.companies?.slice(0, 6).map((company, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs font-black text-white">
                                {company.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-black uppercase">{company.name}</p>
                                <p className="text-[9px] text-slate-500 font-bold">{company.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-amber-500">{company.matchScore}%</p>
                              <p className="text-[9px] text-slate-500 font-bold">Match Score</p>
                            </div>
                          </div>
                          
                          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, company.matchScore)}%` }}
                              transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                              className={`h-full rounded-full ${
                                company.matchScore >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                company.matchScore >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                'bg-gradient-to-r from-orange-500 to-orange-600'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {parsedData.companies?.length > 6 && (
                      <button 
                        onClick={() => navigate('/resume-parsing')}
                        className="w-full mt-8 py-3 border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 text-amber-500 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        View All {parsedData.companies.length} Companies
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </motion.div>

                  {/* Prep Plans Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-8 mt-8 pt-8 border-t border-white/5"
                  >
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Your Prep Plans</h3>
                      <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-amber-500/20">{parsedData.companies?.length || 0} Active</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {parsedData.companies?.map((company, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-black uppercase italic">{company.name}</h4>
                              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{company.location}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black text-amber-500">{company.matchScore}%</div>
                              <p className="text-[9px] text-slate-600 font-bold">Match</p>
                            </div>
                          </div>
                          
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, company.matchScore)}%` }}
                              transition={{ delay: 0.6 + i * 0.1 + 0.3, duration: 0.8 }}
                              className="h-full bg-amber-500"
                            />
                          </div>
                          
                          <p className="text-slate-400 text-xs mb-4 leading-relaxed">{company.matchReason}</p>
                          
                          <button 
                            onClick={() => handleViewPlan(company.name)}
                            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[9px] rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                          >
                            {unlockedCompany === company.name ? 'View Plan' : (unlockedCompany ? 'Upgrade' : 'Start Free')}
                            <ArrowRight size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
              </>
            )}
          </div>

          {/* Sidebar / Advanced Analytics */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-4 space-y-8"
              >
                {/* Weekly Goals */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar size={18} className="text-amber-500" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">This Week&apos;s Goals</h3>
                  </div>
                  {weeklyGoals.length > 0 ? (
                    <div className="space-y-4">
                      {weeklyGoals.map((goal, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-slate-400">{goal.task}</span>
                            <span className="text-[9px] font-black text-amber-500">{goal.completed}/{goal.total}</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.total > 0 ? (goal.completed / goal.total) * 100 : 0}%` }}
                              transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                      <Calendar size={24} className="text-slate-600 mx-auto mb-3" />
                      <p className="text-sm font-black text-white mb-1">No weekly goals found</p>
                      <p className="text-xs text-slate-500">Add goals in Firestore to show your live weekly prep plan here.</p>
                    </div>
                  )}
                </motion.div>

                {/* Achievements */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Award size={18} className="text-amber-500" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Achievements</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: '🔥', label: `${analytics?.achievements?.streakDays || 0}-Day Streak`, unlocked: (analytics?.achievements?.streakDays || 0) > 0 },
                      { icon: '⭐', label: 'Expert Mode', unlocked: analytics?.achievements?.expertModeUnlocked || false },
                      { icon: '🎯', label: `${analytics?.achievements?.perfectMatches || 0} Perfect Matches`, unlocked: (analytics?.achievements?.perfectMatches || 0) > 0 }
                    ].map((achievement, idx) => (
                      <div 
                        key={idx}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all ${achievement.unlocked ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-white/5 border border-white/10 opacity-50'}`}
                      >
                        <span className="text-2xl mb-1">{achievement.icon}</span>
                        <p className="text-[8px] font-bold uppercase text-slate-400">{achievement.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8"
                >
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6">Quick Links</h3>
                  <nav className="space-y-3">
                    {[
                      { icon: FileText, label: 'Resume Analysis', action: () => navigate('/resume-parsing'), active: false },
                      { icon: Target, label: 'Interview Prep', action: () => {}, active: false },
                      { icon: BarChart3, label: 'Analytics', action: () => {}, active: true },
                      { icon: Settings, label: 'Preferences', action: () => {}, active: false }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.action}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-left font-bold ${item.active ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' : 'hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white'}`}
                      >
                        <item.icon size={16} />
                        <span className="text-[11px] uppercase">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </motion.div>

                {/* Premium CTA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-black relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] -mr-16 -mt-16 rounded-full" />
                  <div className="flex items-center gap-2 mb-3">
                    <Crown size={18} />
                    <h3 className="font-black text-sm uppercase">Premium</h3>
                  </div>
                  <p className="text-[11px] font-bold mb-6 leading-relaxed">Unlock AI mock interviews, direct HR referrals & advanced analytics.</p>
                  <button className="w-full py-3 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all active:scale-[0.98]">Upgrade Now</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;