/**
 * resumeService.js
 * Handles file uploads and AI parsing signals for user resumes.
 */

const N8N_RESUME_URL = "/n8n-api-test/resume-parse";

export const uploadResume = async (file, userId, email) => {
  if (!file) return { success: false, error: 'No file provided' };

  // Create a FormData object to send the file to n8n
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('uid', userId);
  formData.append('email', email);
  formData.append('timestamp', new Date().toISOString());

  try {
    const response = await fetch(`${N8N_RESUME_URL}?t=${Date.now()}`, {
      method: 'POST',
      body: formData, // Standard Multi-part/Form-Data
    });

    if (!response.ok) {
        throw new Error(`Upload Failed: ${response.status}`);
    }

    // Since we are using production-standard JSON, we can wait for success
    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    console.error('Resume Upload Error:', error);
    return { success: false, error: error.message };
  }
};
