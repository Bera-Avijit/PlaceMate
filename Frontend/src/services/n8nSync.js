/**
 * n8nSync Service
 * Relays user authentication data to n8n Webhook for Google Sheets storage.
 */

const VITE_N8N_AUTH_TARGET = import.meta.env.VITE_N8N_AUTH_TARGET;

export const syncUserToSheet = async (user, authMethod = "email") => {
  const payload = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    authMethod: authMethod,
    timestamp: new Date().toISOString(),
  };

  console.log('🚀 n8n Sync: Internal Trigger Fired', payload) ;

  if (!VITE_N8N_AUTH_TARGET) {
    console.warn('n8n Sync skipped: VITE_N8N_AUTH_TARGET is not set');
    return;
  }
  

  try {
    // Production Standard: Sending clean JSON with CORS support.
    // URL is now securely pulled from the .env file (abrar1 account)
    const response = await fetch(VITE_N8N_AUTH_TARGET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n Sync: Webhook error ${response.status}`);
    }

    console.log('✅ n8n Sync: Successfully updated Google Sheet');
  } catch (error) {
    console.error('n8n Sync Error:', error);
    throw error;
  }
};
