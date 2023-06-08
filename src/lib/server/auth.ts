import { z } from 'zod';
import { db } from '$lib/server/prisma';

// Types
import type { Cookies } from '@sveltejs/kit';

// DB schemas
import type { User } from '@prisma/client';

// Zod validation schema
const sessionSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	expiresAt: z.date()
});

const sessionCookieSchema = z.string().min(1).max(1000);

const sessionCookieContentSchema = z.object({
	id: z.string(),
	expiresAt: z.date(),
	linkedIP: z.string(),
	user: z.object({
		id: z.string()
	})
});

// Functions
export async function createSession(cookies: Cookies, user: User, expiresIn = 7) {
	// Create session
	// Generate random session ID, 128 bits
	const sessionID = crypto.getRandomValues(new Uint8Array(16)).join('');

	try {
		// Create session in DB
		const session = await db.session.create({
			data: {
				id: sessionID,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * expiresIn), // 24 hours by default, configurable
				user: {
					connect: {
						id: user.id
					}
				}
			}
		});

		// Validate session with Zod
		sessionSchema.parse(session);

		// Set session cookie
		cookies.set('session', JSON.stringify(session), {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * expiresIn // 7 days by default, configurable
		});
	} catch (err) {
		console.error(err);
		return {
			success: false,
			error: 'Failed to create session'
		};
	}
}

export async function invalidateSession(cookies: Cookies) {
	const session = getSessionFromCookie(cookies);

	try {
		// Delete session from DB
		await db.session.delete({
			where: {
				id: session.id
			}
		});

		removeSession(cookies);
	} catch (err) {
		console.error(err);
	}
}

export async function garbageCollectSessions() {
	// Delete expired sessions
	const deletedSessions = await db.session.deleteMany({
		where: {
			expiresAt: {
				lt: new Date()
			}
		}
	});

	console.log(`Deleted ${deletedSessions.count} expired sessions`);
}

function removeSession(cookies: Cookies) {
	// Remove session cookie
	cookies.set('session', '', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 0
	});
}

function getSessionFromCookie(cookies: Cookies) {
	// Get session cookie
	const sessionCookie = cookies.get('session');

	// Return null if session cookie doesn't exist
	if (!sessionCookie) return null;

	try {
		// Validate session cookie with Zod
		sessionCookieSchema.parse(sessionCookie);

		// Parse session cookie content
		const sessionCookieContent = JSON.parse(sessionCookie);

		// Validate session cookie content with Zod
		sessionCookieContentSchema.parse(sessionCookieContent);

		// Return session cookie content
		return sessionCookieContent;
	} catch (err) {
		console.error(err);
	}

	// Return null if session cookie is invalid
	return null;
}
