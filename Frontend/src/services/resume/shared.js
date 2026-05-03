const VITE_N8N_RESUME_TARGET = import.meta.env.VITE_N8N_RESUME_TARGET;
const VITE_N8N_COMPANY_PLAN_TARGET = import.meta.env.VITE_N8N_COMPANY_PLAN_TARGET;
const VITE_N8N_QUESTION_TARGET = import.meta.env.VITE_N8N_QUESTION_TARGET;
const VITE_N8N_ANSWER_TARGET = import.meta.env.VITE_N8N_ANSWER_TARGET;

const getN8nProxyUrl = (target) => {
  if (import.meta.env.DEV && target) {
    return target.replace("https://abrar1.app.n8n.cloud", "/n8n-api");
  }

  return target;
};

export {
  VITE_N8N_RESUME_TARGET,
  VITE_N8N_COMPANY_PLAN_TARGET,
  VITE_N8N_QUESTION_TARGET,
  VITE_N8N_ANSWER_TARGET,
  getN8nProxyUrl,
};