/**
 * n8nSync Service
 * Relays user authentication data to n8n Webhook for Google Sheets storage.
 */

const VITE_N8N_AUTH_TARGET = import.meta.env.VITE_N8N_AUTH_TARGET;

export const syncUserToSheet = async (user, authMethod = "email") => {
  if (!VITE_N8N_AUTH_TARGET) return;

  const payload = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    authMethod: authMethod,
    timestamp: new Date().toISOString(),
  };

  console.log('🚀 n8n Sync: Internal Trigger Fired', payload) ;
  

  try {
    // Production Standard: Sending clean JSON with CORS support.
    // URL is now securely pulled from the .env file (abrar1 account)
    fetch(VITE_N8N_AUTH_TARGET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => {
      if (!res.ok) console.warn('n8n Sync: Webhook error', res.status);
      else console.log('✅ n8n Sync: Successfully updated Google Sheet');
    }).catch(err => {
      console.error('❌ n8n Sync: Network/CORS Error', err);
    });
  } catch (error) {
    console.error('n8n Sync Error:', error);
  }
};
