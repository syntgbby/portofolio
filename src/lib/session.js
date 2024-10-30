// lib/session.js
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(res, userId) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);

    res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Lax`);
}

export async function verifySession(sessionToken) {
    const { payload } = await jwtVerify(sessionToken, encodedKey);
    return payload.userId;
}