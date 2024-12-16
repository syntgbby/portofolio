import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../../lib/mongodb";
import { setCookie } from 'cookies-next';
import { comparePassword, encrypt } from "../../../lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    switch (req.method) {
        case "POST":
            try {
                // Parse and validate the incoming body
                const body = JSON.parse(req.body);
                const { email, password } = body;

                // Fetch user from the database (including user_type)
                const user = await db.collection("user_gebby").findOne({ email });

                if (!user) {
                    return res.status(400).json({ message: "Invalid email or password" });
                }

                // Compare the password with the hashed password in the database
                const isPasswordValid = await comparePassword(password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ message: "Invalid email or password" });
                }

                // Create token data to store in the cookie
                const tokenData = {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    user_type: user.user_type, // Include user_type
                };

                // Set the cookie (make sure to set options for better security)
                const token = await encrypt(tokenData);
                setCookie(`${process.env.AUTH_COOKIE_NAME}`, token, {
                    req, 
                    res, 
                    maxAge: 60 * 6 * 24, // 6 days
                    httpOnly: true, // Security: prevents JS access to cookies
                    secure: process.env.NODE_ENV === 'production', // Only secure cookies in production
                    sameSite: 'strict', // Enhances CSRF protection
                });

                // Respond with success, including user_type
                return res.status(200).json({
                    message: "Login successfully",
                    user_type: user.user_type, // Send user_type in the response
                });

            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Internal server error" });
            }

        default:
            return res.status(405).json({ message: "Method Not Allowed" });
    }
}
