import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { createSession } from '../../../lib/session';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    if (method === 'POST') {
        const { email, password } = req.body;

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_NAME); // Ensure this env variable is set
            
            // Find the user by email
            const user = await db.collection('user_gebby').findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Compare the provided password with the stored hashed password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Create a session for the authenticated user
            await createSession({ userId: user._id });

            return res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${method} not allowed` });
    }
}
