/**
 * resumeService.js
 * Handles file uploads, AI parsing signals, and Firestore data retrieval for user resumes.
 */
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const VITE_N8N_RESUME_TARGET = import.meta.env.VITE_N8N_RESUME_TARGET;
const VITE_N8N_COMPANY_PLAN_TARGET = import.meta.env
  .VITE_N8N_COMPANY_PLAN_TARGET;

  const VITE_N8N_QUESTION_TARGET = import.meta.env.VITE_N8N_QUESTION_TARGET;
const VITE_N8N_ANSWER_TARGET = import.meta.env.VITE_N8N_ANSWER_TARGET;
export const uploadResume = async (file, userId, email) => {
  if (!file) return { success: false, error: "No file provided" };

  // Create a FormData object as per latest documentation (only userId and resume)
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("resume", file);

  try {
    const response = await fetch(VITE_N8N_RESUME_TARGET, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload Failed: ${response.status}`);
    }

    const rawData = await response.json();

    // Transform new detailed Firestore-style JSON to a clean object
    const cleanedData = rawData.fields
      ? {
          level: rawData.fields.level?.stringValue || "unknown",
          username: rawData.fields.username?.stringValue || "user",
          companies:
            rawData.fields.company?.arrayValue?.values?.map((v) => {
              const f = v.mapValue.fields;
              return {
                name: f.name?.stringValue || "Unknown Company",
                location: f.location?.stringValue || "Remote",
                type: f.type?.stringValue || "General",
                rank: f.rank?.integerValue || "0",
                matchScore: f.match_score?.integerValue || "0",
                matchReason: f.match_reason?.stringValue || "",
                applyReadiness: f.apply_readiness?.stringValue || "needs_prep",
                careersUrl: f.careers_url?.stringValue || "#",
                skillOverlap:
                  f.skill_overlap?.arrayValue?.values?.map(
                    (sv) => sv.stringValue,
                  ) || [],
                interviewFocus:
                  f.interview_focus?.arrayValue?.values?.map(
                    (sv) => sv.stringValue,
                  ) || [],
                weakAreaWarning: f.weak_area_warning?.stringValue || "",
              };
            }) || [],
        }
      : rawData;

    // PERSISTENCE: Save the results to Firestore immediately
    await saveUserResults(userId, cleanedData);

    return { success: true, data: cleanedData };
  } catch (error) {
    console.error("Resume Upload Error:", error);
    return { success: false, error: error.message };
  }
};

export const getUserResults = async (userId) => {
  try {
 
    const docRef = doc(db, "placemate-user-company-recomendation", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    // Transform Firestore data back to the UI structure
    const parseFields = (d) => ({
      level: d.level || "unknown",
      username: userId || "user",
      companies:
        d.company?.map((c) => ({
          name: c.name || "Unknown Company",
          location: c.location || "Remote",
          type: c.type || "General",
          rank: c.rank || "0",
          matchScore: parseInt(c.match_score || c.matchScore || "0"),
          matchReason: c.match_reason || c.matchReason || "",
          applyReadiness: c.apply_readiness || c.applyReadiness || "needs_prep",
          careersUrl: c.careers_url || c.careersUrl || "#",
          skillOverlap: c.skill_overlap || c.skillOverlap || [],
          interviewFocus: c.interview_focus || c.interviewFocus || [],
          weakAreaWarning: c.weak_area_warning || c.weakAreaWarning || "",
        })) || [],
    });

    return parseFields(data);
  } catch (error) {
    console.error("❌ Error fetching persistent results:", error);
    return null;
  }
};

export const saveUserResults = async (userId, data) => {
  try {
    // Map the cleaned UI data to the Firestore structure
    // We nest the companies inside a 'company' array to match your n8n naming convention
    const firestoreData = {
      level: data.level,
      username: userId,
      company: data.companies.map((c) => ({
        name: c.name,
        location: c.location,
        type: c.type,
        rank: c.rank,
        match_score: c.matchScore || c.match_score || 0,
        match_reason: c.matchReason || c.match_reason || "",
        apply_readiness: c.applyReadiness || c.apply_readiness || "needs_prep",
        careers_url: c.careersUrl || c.careers_url || "#",
        skill_overlap: c.skillOverlap || c.skill_overlap || [],
        interview_focus: c.interviewFocus || c.interview_focus || [],
        weak_area_warning: c.weakAreaWarning || c.weak_area_warning || "",
      })),
     
      hasParsed: true,
      lastUpdated: new Date().toISOString(),
    };
 console.log("Saving to Firestore with structure:", firestoreData);
    const docRef = doc(db, "placemate-user-company-recomendation", userId);
    await setDoc(docRef, firestoreData);
    console.log("✅ Resume analysis saved to Firestore for persistent access.");
  } catch (error) {
    console.error("❌ Error saving results to Firestore:", error);
  }
};

export const generateCompanyPlan = async (userId, userName, level, companyData) => {
  try {
    // 1. Check if the plan already exists in Firestore
    const safeCompanyName = companyData.name.replace(/[^a-zA-Z0-9]/g, "_");
    const docId = `${userId}_${safeCompanyName}`;
    const docRef = doc(db, "placemate-company-plans", docId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(
        `✅ Loaded existing plan for ${companyData.name} from Firestore.`,
      );
      return { success: true, data: docSnap.data().planData };
    }

    // 2. If not in DB, prepare the payload to fetch from n8n
    const payload = {
      username: userId,
      level: level,
      selected_company: {
        name: companyData.name || "",
        type: companyData.type || "",
        rank: companyData.rank || 0,
        match_score: companyData.matchScore || 0,
        match_reason: companyData.matchReason || "",
        apply_readiness: companyData.applyReadiness || "",
        careers_url: companyData.careersUrl || "",
        skill_overlap: companyData.skillOverlap || [],
        interview_focus: companyData.interviewFocus || [],
        weak_area_warning: companyData.weakAreaWarning || "",
      },
    };

    const response = await fetch(VITE_N8N_COMPANY_PLAN_TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Plan Generation Failed: ${response.status}`);
    }

    const rawData = await response.json();

    // N8N often returns an array containing the output or just the object
    const data = Array.isArray(rawData) ? rawData[0] : rawData;

    // 3. Save the newly generated plan to Firestore to prevent future n8n hits
    await setDoc(docRef, {
      userId,
      companyName: companyData.name,
      planData: data,
      generatedAt: new Date().toISOString(),
    });
    console.log(`✅ Saved new plan for ${companyData.name} to Firestore.`);

    return { success: true, data };
  } catch (error) {
    console.error("Company Plan Generation Error:", error);
    return { success: false, error: error.message };
  }
};



export const generateQuestions = async (userId, companyName, dayNumber) => {
  try {
    // 1. Check if questions already exist in Firestore
    const q = query(
      collection(db, "placemate-user-questions"),
      where("username", "==", userId),
      where("target_company", "==", companyName),
      where("day", "==", parseInt(dayNumber)),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log(
        `✅ Loaded ${querySnapshot.size} questions from Firestore cache.`,
      );
      const questions = [];
      querySnapshot.forEach((doc) => {
        questions.push({ docId: doc.id, ...doc.data() });
      });
      return { success: true, data: questions };
    }

    // 2. Not found, fetch from n8n
    // Rewrite URL to use Vite proxy in local development to bypass CORS completely
    let baseUrl = VITE_N8N_QUESTION_TARGET;
    if (import.meta.env.DEV) {
      baseUrl = baseUrl.replace("https://abrar1.app.n8n.cloud", "/n8n-api");
    }
    const url = `${baseUrl}?userId=${userId}&companyName=${encodeURIComponent(companyName)}&dayNumber=${dayNumber}`;

    // We use a POST request with the Vite Proxy (which completely prevents CORS).
    // We send data both in the URL (query param) and the Body (JSON) so n8n can catch it either way!
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, companyName, dayNumber }),
    });

    if (!response.ok) {
      throw new Error(`Question Generation Failed: ${response.status}`);
    }

    const rawData = await response.json();

    if (!rawData || !rawData.data) {
      throw new Error("Invalid response format from question generation.");
    }

    // 3. Clean the REST API format to a normal JS object structure
    const cleanedQuestions = rawData.data.map((doc) => {
      const f = doc.fields;
      return {
        question: f.question?.stringValue || "",
        level: f.level?.stringValue || "",
        id: f.id?.stringValue || "",
        topic: f.topic?.stringValue || "",
        session_tip: f.session_tip?.stringValue || "",
        resource_url: f.resource_url?.stringValue || "",
        difficulty: f.difficulty?.stringValue || "",
        why_this_matters: f.why_this_matters?.stringValue || "",
        type: f.type?.stringValue || "",
        username: f.username?.stringValue || "",
        task_id: f.task_id?.stringValue || "",
        target_company: f.target_company?.stringValue || "",
        resource_label: f.resource_label?.stringValue || "",
        session: parseInt(f.session?.integerValue || "0"),
        title: f.title?.stringValue || "",
        day_title: f.day_title?.stringValue || "",
        estimated_total_time: f.estimated_total_time?.stringValue || "",
        platform: f.platform?.stringValue || "",
        link: f.link?.stringValue || "",
        expected_time: f.expected_time?.stringValue || "",
        hint: f.hint?.stringValue || "",
        day: parseInt(f.day?.integerValue || "0"),
      };
    });

    // 4. Save the generated questions to Firestore to cache them for future visits
    const questionsCollection = collection(db, "placemate-user-questions");
    await Promise.all(cleanedQuestions.map(async (q) => {
      // Auto-generate a document ID for each question
      const newDocRef = doc(questionsCollection);
      q.docId = newDocRef.id; // Assign ID to the local object so the UI can use it
      await setDoc(newDocRef, q);
    }));
    console.log(`✅ Saved ${cleanedQuestions.length} AI generated questions to Firestore cache.`);

    return { success: true, data: cleanedQuestions };
  } catch (error) {
    console.error("Question Generation Error:", error);
    return { success: false, error: error.message };
  }
};



export const submitAnswer = async (userId, questionDocId, questionId, userAnswer) => {
  try {
    let baseUrl = VITE_N8N_ANSWER_TARGET;
    if (import.meta.env.DEV) {
      baseUrl = baseUrl.replace("https://abrar1.app.n8n.cloud", "/n8n-api");
    }

    const url = `${baseUrl}?userId=${userId}&questionId=${questionId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, questionId, userAnswer }),
    });

    if (!response.ok) {
      throw new Error(`Answer Submission Failed: ${response.status}`);
    }

    const rawData = await response.json();
    
    // N8N often returns an array or wrapped object
    const resultData = Array.isArray(rawData) ? rawData[0] : (rawData.data ? rawData.data[0] : rawData);

    const evaluation = {
      score: resultData.score || 0,
      verdict: resultData.verdict || "unknown",
      feedback: resultData.feedback || "",
      improvement: resultData.improvement || "",
      idealAnswer: resultData.idealAnswer || "",
      userAnswer: userAnswer,
    };

    // Save the evaluation back to the specific question document in Firestore
    if (questionDocId) {
      const docRef = doc(db, "placemate-user-questions", questionDocId);
      await setDoc(docRef, { evaluation: evaluation }, { merge: true });
      console.log(`✅ Saved AI Evaluation to Firestore for question ${questionId}`);
    }

    return { success: true, data: evaluation };
  } catch (error) {
    console.error("Answer Submission Error:", error);
    return { success: false, error: error.message };
  }
};

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
