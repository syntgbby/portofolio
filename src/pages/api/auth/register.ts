import { NextApiRequest, NextApiResponse } from 'next';
import { RegisterFormSchema } from '@/lib/definitions';
import clientPromise from '../../../lib/mongodb';
import { createSession } from '../../../lib/session';
import bcrypt from 'bcryptjs';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  // 1. Validate form fields
  const validatedFields = RegisterFormSchema.safeParse(req.body);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return res.status(400).json({
      errors: validatedFields.error.flatten().fieldErrors,
    });
  }

  // 2. Prepare data for insertion into the database
  const { name, email, password } = validatedFields.data;

  // Connect to the database
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_NAME);

  try {
    // Check if the user already exists
    const existingUser = await db.collection('user_gebby').findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        errors: {
          email: ['User already exists'],
        },
      });
    }

    // Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert the user into the database
    const data = await db.collection('user_gebby').insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const user = { id: data.insertedId, name, email };

    // 4. Create user session
    await createSession(user.id);

    // 5. Return success response
    return res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
