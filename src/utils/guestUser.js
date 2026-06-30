const STORAGE_KEY = "ecomus_user_id";
const STORAGE_EMAIL_KEY = "ecomus_user_email";
const STORAGE_PASSWORD_KEY = "ecomus_user_password";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getGuestUserId() {
  return localStorage.getItem(STORAGE_KEY) ?? null;
}

function isValidMongoId(id) {
  return id && /^[a-f\d]{24}$/i.test(id);
}

function generateCredentials() {
  const suffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  // I use gmail.com since most APIs accept it
  const email = `ecomus.guest.${suffix}@gmail.com`;
  const password = `Pass${suffix.slice(0, 6)}!9`;
  const name = "Guest User";
  return { email, password, name };
}

async function tryRegister(email, password, name) {
  // I try both role values the API might accept
  const payloads = [
    { name, email, password, role: "buyer" },
    { name, email, password, role: "user" },
    { name, email, password },
  ];

  for (const body of payloads) {
    try {
      const res = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const json = await res.json();
        const user = json?.data?.user ?? json?.data ?? json?.user ?? json;
        const id = user?._id ?? user?.id;
        if (isValidMongoId(id)) return id;
      }
    } catch {
      // try next payload
    }
  }
  return null;
}

async function tryLogin(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const json = await res.json();
      const user = json?.data?.user ?? json?.data ?? json?.user ?? json;
      const id = user?._id ?? user?.id;
      if (isValidMongoId(id)) return id;
    }
  } catch {
    // ignore
  }
  return null;
}

// I call this once on app boot to ensure a valid MongoDB _id exists
export async function ensureGuestUser() {
  const existingId = getGuestUserId();

  // I already have a valid MongoDB id, nothing to do
  if (isValidMongoId(existingId)) return existingId;

  // I had a previous session, so I try logging back in
  const savedEmail = localStorage.getItem(STORAGE_EMAIL_KEY);
  const savedPassword = localStorage.getItem(STORAGE_PASSWORD_KEY);
  if (savedEmail && savedPassword) {
    const id = await tryLogin(savedEmail, savedPassword);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
      return id;
    }
  }

  // Fresh registration
  const { email, password, name } = generateCredentials();
  const id = await tryRegister(email, password, name);

  if (id) {
    localStorage.setItem(STORAGE_KEY, id);
    localStorage.setItem(STORAGE_EMAIL_KEY, email);
    localStorage.setItem(STORAGE_PASSWORD_KEY, password);
    return id;
  }

  // I clear any stale bad ID so I retry next time
  localStorage.removeItem(STORAGE_KEY);
  console.warn("[EComus] Could not register guest user. Orders/cart may not work.");
  return null;
}
