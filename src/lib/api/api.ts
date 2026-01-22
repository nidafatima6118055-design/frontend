// src/lib/api/api.ts
import api from "./axiosClient";

/**
 * Base API wrapper functions using Axios client (with token refresh interceptor)
 * The axiosClient automatically:
 *  - Attaches Authorization header from cookies
 *  - Refreshes tokens when a 401 response is encountered
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

/* -------- AUTH -------- */

export async function register(username: string, email: string, password: string) {
  const res = await api.post(`${API_URL}/api/auth/register/`, {
    username,
    email,
    password,
  });
  return res.data;
}

export async function login(email: string, password: string, keepMeLoggedIn: boolean) {
  const res = await api.post(`${API_URL}/api/auth/login/`, {
    email,
    password,
    keep_me_logged_in: keepMeLoggedIn, // ✅ send this to backend
  });
  return res.data;
}

export async function logout(refresh: string, access: string) {
  const res = await api.post(`${API_URL}/api/auth/logout/`, { refresh });
  return res.data;
}

export async function me() {
  const res = await api.get(`${API_URL}/api/auth/me/`);
  return res.data;
}

export async function refreshToken(refresh: string) {
  const res = await api.post(`${API_URL}/api/auth/token/refresh/`, { refresh });
  return res.data;
}





/* -------- PASSWORD MANAGEMENT -------- */

/**
 * Change password (requires user to be authenticated).
 * old_password and new_password are required.
 */
export async function changePassword(old_password: string, new_password: string) {
  const res = await api.post(`${API_URL}/api/auth/change-password/`, {
    old_password,
    new_password,
  });
  return res.data;
}

/**
 * Request password reset email.
 * The backend will send a reset link or log it in console (for dev).
 */
export async function requestPasswordReset(email: string) {
  const res = await api.post(`${API_URL}/api/auth/password-reset/request/`, { email });
  return res.data;
}

/**
 * Confirm password reset with UID + token + new password.
 * Called after the user clicks the reset link from their email.
 */
export async function confirmPasswordReset(uid: string, token: string, new_password: string) {
  const res = await api.post(`${API_URL}/api/auth/password-reset/confirm/`, {
    uid,
    token,
    new_password,
  });
  return res.data;
}

/**
 * (Later) Set password for social-login users who don't have one yet.
 * We'll add backend support for this after frontend integration is complete.
 */
export async function setPassword(new_password: string) {
  const res = await api.post(`${API_URL}/api/auth/set-password/`, {
    new_password,
  });
  return res.data;
}




/* -------- SOCIAL LOGIN -------- */

/**
 * Exchange Google OAuth token for backend-issued JWT + user data.
 */
export async function googleLogin(access_token: string) {
  const res = await api.post(`${API_URL}/auth/google/`, { access_token });
  return res.data; // { user, access, refresh }
}

/**
 * Exchange Facebook OAuth token for backend-issued JWT + user data.
 */
export async function facebookLogin(access_token: string) {
  const res = await api.post(`${API_URL}/api/auth/facebook/`, { access_token });
  return res.data; // { user, access, refresh }
}







/* -------- AGENTS -------- */

export async function getAgents() {
  try {
    const res = await api.get("/api/agents/");
    console.log("✅ Agents: === >", res);
    return res.data;
  } catch (err: any) {
    console.error("❌ Agents error:", err.response?.status, err.response?.data);
  }
}

export async function createAgent(data: {
  name: string;
  description: string;
  system_prompt: string;
  agent_prompts: string;
}) {
  const res = await api.post(`${API_URL}/api/agents/`, data);
  return res.data;
}

export async function updateAgent(data: {
  name: string;
  description: string;
  system_prompt: string;
  agent_prompts: string;
}) {
  const res = await api.post(`${API_URL}/api/agents/`, data);
  return res.data;
}

export async function deleteAgent(id: string | number) {
  try {
    const res = await api.delete(`/api/agents/${id}/`);
    return res.data;
  } catch (err: any) {
    console.error("❌ Delete agent error:", err.response?.status, err.response?.data);
    throw err;
  }
}




/* -------- TWILIO (PHONE MANAGEMENT) -------- */

/**
 * Fetch all available Twilio phone numbers.
 * Backend should return something like:
 * {
 *   "available_numbers": ["+15551234567", "+15557654321"],
 *   "assigned_numbers": { "+15551234567": "agent_id_123" }
 * }
 */
export async function getPhoneNumbers() {
  const res = await api.get(`${API_URL}/api/numbers/`);
  return res.data;
}

/**
 * Assign a Twilio phone number to an agent.
 * Expects: { agent_id, phone_number }
 * Returns: { success: true, agent_id, phone_number }
 */
export async function assignNumberToAgent(agentId: string, phoneNumber: string) {
  const res = await api.post(`${API_URL}/api/numbers/assign/`, {
    agent_id: agentId,
    sid: phoneNumber,
  });
  return res.data;
}

/**
 * Unassign a Twilio phone number from an agent.
 * Expects: { agent_id, phone_number }
 */
export async function unassignNumberFromAgent(agentId: string, phoneNumber: string) {
  const res = await api.post(`${API_URL}/api/numbers/unassign/`, {
    agent_id: agentId,
    phone_number: phoneNumber,
  });
  return res.data;
}

/**
 * Get the phone number currently assigned to an agent.
 * Optional helper to show current mapping in UI.
 */
export async function getAssignedNumber(agentId: string) {
  const res = await api.get(`${API_URL}/api/twilio/assigned/${agentId}/`);
  return res.data;
}






/* ==============================
   🧾 BILLING & SUBSCRIPTIONS API
   ============================== */

/** Get full billing summary: credits, active subscription, transactions */
export async function getBillingSummary() {
  const res = await api.get("/api/billing/summary/");
  return res.data; // { credits, subscription, transactions }
}

/** Get all available subscription plans */
export async function getAvailablePlans() {
  const res = await api.get("/api/billing/plans/");
  return res.data; // [ { id, name, description, price_usd, credits, interval } ]
}

/** Create a Stripe checkout session to top up wallet balance */
export async function createTopUpSession(amount: number) {
  const res = await api.post("/api/billing/topup/", { amount });
  return res.data; // { url }
}

/** Subscribe to a new plan using Stripe Checkout */
export async function createSubscriptionSession(planId: string) {
  const res = await api.post("/api/billing/subscribe/", { plan_id: planId });
  return res.data; // { url }
}

/** Cancel the current active subscription */
export async function cancelSubscription() {
  const res = await api.post("/api/billing/cancel/");
  return res.data; // { success: true }
}

/** Open Stripe customer billing portal */
export async function createPortalSession() {
  const res = await api.post("/api/billing/portal/");
  return res.data; // { url }
}

/** Get only user credits */
export async function getMyCredits() {
  const res = await api.get("/api/billing/my-credits/");
  return res.data; // { credits }
}



/* ======================================
   🧪 MOCK MODE: Frontend-only test data
   ====================================== */

  //  if (MOCK_MODE) {
  //   console.warn("⚠️ Billing API is running in MOCK MODE — using fake test data");
  
  //   const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
  
  //   export async function getBillingSummary() {
  //     await delay(500);
  //     return {
  //       credits: 230.5,
  //       subscription: {
  //         id: "sub_123",
  //         plan_name: "Pro Plan",
  //         status: "active",
  //         current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  //       },
  //       transactions: [
  //         {
  //           id: "tx_1",
  //           type: "topup",
  //           amount: 100,
  //           status: "completed",
  //           created_at: new Date(Date.now() - 86400000).toISOString(),
  //           description: "Top-up via Stripe",
  //         },
  //         {
  //           id: "tx_2",
  //           type: "subscription",
  //           amount: 20,
  //           status: "completed",
  //           created_at: new Date(Date.now() - 43200000).toISOString(),
  //           description: "Monthly Pro Plan",
  //         },
  //       ],
  //     };
  //   }
  
  //   export async function getAvailablePlans() {
  //     await delay(200);
  //     return [
  //       { id: "plan_basic", name: "Basic", price: 10, interval: "month" },
  //       { id: "plan_pro", name: "Pro", price: 20, interval: "month" },
  //       { id: "plan_enterprise", name: "Enterprise", price: 49, interval: "month" },
  //     ];
  //   }
  
  //   export async function createTopUpSession(amount: number) {
  //     await delay(300);
  //     console.log("💳 Mock top-up of", amount);
  //     return { url: "#" };
  //   }
  
  //   export async function createSubscriptionSession(planId: string) {
  //     await delay(300);
  //     console.log("🪙 Mock subscribe to", planId);
  //     return { url: "#" };
  //   }
  
  //   export async function cancelSubscription() {
  //     await delay(300);
  //     console.log("🚫 Mock cancel subscription");
  //     return { success: true };
  //   }
  
  //   export async function createPortalSession() {
  //     await delay(200);
  //     console.log("🧾 Mock open portal");
  //     return { url: "#" };
  //   }
  // }
  