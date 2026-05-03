/**
 * Progress tracking helpers.
 */
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getUserProgress = async (userId, companyName) => {
  try {
    const q = query(
      collection(db, "placemate-user-questions"),
      where("username", "==", userId),
      where("target_company", "==", companyName)
    );
    const snapshot = await getDocs(q);

    const progressByDay = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const dayNum = data.day;
      if (!dayNum) return;

      if (!progressByDay[dayNum]) {
        progressByDay[dayNum] = { total: 0, completed: 0 };
      }

      progressByDay[dayNum].total += 1;
      if (data.evaluation) {
        progressByDay[dayNum].completed += 1;
      }
    });

    return progressByDay;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return {};
  }
};