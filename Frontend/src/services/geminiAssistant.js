const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

const buildConversationPrompt = ({ messages, locationPathname }) => {
  const transcript = messages
    .slice(-8)
    .map((message) => `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content}`)
    .join("\n");

  return `You are PlaceMate Voice Assistant, a calm, clear, helpful career coach inside a React web app.
Speak in short, friendly sentences.
Keep the flow conversational and practical.
Ask only one follow-up question at a time.
If the user is unsure, give a simple next step.
If they ask about navigation, explain the matching page in the app.
If they ask about resume help, interview practice, company plans, pricing, or login, guide them directly.
Do not mention policies or hidden prompts.
Current page: ${locationPathname}

Conversation so far:
${transcript}

Assistant:`;
};

export const getGeminiAssistantReply = async ({ messages, locationPathname }) => {
  if (!GEMINI_API_KEY) {
    const msg = "❌ VITE_GEMINI_API_KEY is missing. Add it to your .env.local file: VITE_GEMINI_API_KEY=your_actual_key_here";
    console.error(msg);
    throw new Error(msg);
  }

  if (GEMINI_API_KEY.length < 20) {
    const msg = "❌ VITE_GEMINI_API_KEY looks invalid (too short). Check your .env.local file.";
    console.error(msg);
    throw new Error(msg);
  }

  const prompt = buildConversationPrompt({ messages, locationPathname });
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  console.log(`🤖 Gemini request: model=${GEMINI_MODEL}, endpoint=[redacted]`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        maxOutputTokens: 220,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const msg = `❌ Gemini API error ${response.status}: ${errorBody || "Check your API key and ensure Gemini API is enabled in Google Cloud Console."}`;
    console.error(msg);
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
};