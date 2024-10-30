import { cookies } from 'next/headers';
import { verifySession } from './session';

export async function getSession() {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie) return null;

  const session = await verifySession(sessionCookie.value);
  return session;
}
