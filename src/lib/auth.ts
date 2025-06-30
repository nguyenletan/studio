import { cookies } from 'next/headers';
import type { AdminUser } from '@/types';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';
const SESSION_COOKIE_NAME = 'csskins_session';

export async function login(
  username?: string,
  password?: string
): Promise<{ success: boolean; error?: string }> {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    (await cookies()).set(SESSION_COOKIE_NAME, JSON.stringify({ username }), {
      expires,
      httpOnly: true,
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid username or password.' };
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<AdminUser | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  try {
    const sessionData = JSON.parse(sessionCookie.value);
    return sessionData as AdminUser;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}
