/**
 * Analytics and dashboard metrics service.
 * Fetches real user data from Firestore to calculate KPIs and progress metrics.
 */
import { db } from "../../firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

/**
 * Calculate overall job readiness score based on company matches
 */
export const calculateJobReadiness = (companies = []) => {
  if (!companies || companies.length === 0) return 0;
  const avgScore = companies.reduce((sum, c) => sum + (c.matchScore || 0), 0) / companies.length;
  return Math.round(avgScore);
};

/**
 * Fetch skill proficiency data for user
 */
export const getSkillProficiency = async (userId) => {
  try {
    const docRef = doc(db, "placemate-user-company-recomendation", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return [];

    const companies = docSnap.data().companies || [];
    
    // Extract all skills from companies and calculate proficiency
    const skillMap = {};
    
    companies.forEach(company => {
      // Skills from interview focus areas
      (company.interviewFocus || []).forEach(skill => {
        if (!skillMap[skill]) {
          skillMap[skill] = { count: 0, score: 0 };
        }
        skillMap[skill].count += 1;
        skillMap[skill].score += company.matchScore || 0;
      });
    });

    // Convert to proficiency percentage
    const skills = Object.entries(skillMap)
      .map(([name, data]) => ({
        name,
        proficiency: Math.min(100, Math.round(data.score / data.count))
      }))
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 5);

    return skills;
  } catch (error) {
    console.error("Error fetching skill proficiency:", error);
    return [];
  }
};

/**
 * Fetch user quiz/question progress
 */
export const getQuizProgress = async (userId) => {
  try {
    const q = query(
      collection(db, "placemate-user-questions"),
      where("username", "==", userId)
    );
    const snapshot = await getDocs(q);

    let totalQuestions = 0;
    let completedQuestions = 0;
    let scoreSum = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      totalQuestions += 1;
      if (data.evaluation) {
        completedQuestions += 1;
        scoreSum += Number(data.evaluation.score || 0);
      }
    });

    return {
      completed: completedQuestions,
      total: totalQuestions,
      completionRate: totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0,
      averageScore: completedQuestions > 0 ? Math.round(scoreSum / completedQuestions) : 0
    };
  } catch (error) {
    console.error("Error fetching quiz progress:", error);
    return { completed: 0, total: 0, completionRate: 0, averageScore: 0 };
  }
};

/**
 * Fetch user achievements data
 */
export const getUserAchievements = async (userId) => {
  try {
    const docRef = doc(db, "placemate-user-achievements", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Return default achievements if not found
      return {
        streakDays: 0,
        perfectMatches: 0,
        expertModeUnlocked: false,
        achievements: []
      };
    }

    const data = docSnap.data();
    return {
      streakDays: data.currentStreak || 0,
      perfectMatches: data.perfectMatches || 0,
      expertModeUnlocked: data.expertMode || false,
      achievements: data.achievementsList || []
    };
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return {
      streakDays: 0,
      perfectMatches: 0,
      expertModeUnlocked: false,
      achievements: []
    };
  }
};

/**
 * Fetch user weekly goals and progress
 */
export const getWeeklyGoals = async (userId) => {
  try {
    const docRef = doc(db, "placemate-user-goals", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return [];

    const data = docSnap.data();
    return data.goals || [];
  } catch (error) {
    console.error("Error fetching weekly goals:", error);
    return [];
  }
};

/**
 * Fetch 7-day progress trend data
 */
export const getProgressTrend = async (userId) => {
  try {
    const q = query(
      collection(db, "placemate-user-questions"),
      where("username", "==", userId)
    );
    const snapshot = await getDocs(q);

    const dayProgress = {
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 },
      4: { total: 0, completed: 0 },
      5: { total: 0, completed: 0 },
      6: { total: 0, completed: 0 },
      7: { total: 0, completed: 0 }
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      const day = data.day || 0;
      if (day >= 1 && day <= 7) {
        dayProgress[day].total += 1;
        if (data.evaluation) {
          dayProgress[day].completed += 1;
        }
      }
    });

    const trend = Object.values(dayProgress).map(({ total, completed }) => 
      total > 0 ? Math.round((completed / total) * 100) : 0
    );

    return trend.some((value) => value > 0) ? trend : [];
  } catch (error) {
    console.error("Error fetching progress trend:", error);
    return [];
  }
};

/**
 * Fetch all analytics in one call
 */
export const getDashboardAnalytics = async (userId, companies = []) => {
  try {
    const [skillProficiency, quizProgress, achievements, weeklyGoals, progressTrend] = await Promise.all([
      getSkillProficiency(userId),
      getQuizProgress(userId),
      getUserAchievements(userId),
      getWeeklyGoals(userId),
      getProgressTrend(userId)
    ]);

    const jobReadiness = calculateJobReadiness(companies);
    const activeDays = progressTrend.filter((dayValue) => dayValue > 0).length;
    
    return {
      jobReadiness,
      dailyPrepProgress: quizProgress.completionRate || 0,
      activeDays,
      momentumScore: progressTrend.length > 0 ? progressTrend[progressTrend.length - 1] : 0,
      quizProgress,
      skillProficiency,
      achievements,
      weeklyGoals,
      progressTrend
    };
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    return {
      jobReadiness: 0,
      dailyPrepProgress: 0,
      activeDays: 0,
      momentumScore: 0,
      quizProgress: { completed: 0, total: 0, completionRate: 0, averageScore: 0 },
      skillProficiency: [],
      achievements: { streakDays: 0, perfectMatches: 0, expertModeUnlocked: false, achievements: [] },
      weeklyGoals: [],
      progressTrend: []
    };
  }
};
