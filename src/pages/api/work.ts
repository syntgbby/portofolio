import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const { method } = req;
    const { id } = req.query; // Get the ID from the request URL for DELETE

    switch (method) {
      case "POST":
        try {
          const body = req.body;  // No need to parse

          // Validate incoming data
          if (typeof body !== "object" || Array.isArray(body)) {
            throw new Error('Invalid request format');
          }
          if (!body.name) {
            throw new Error('Name is required');
          }

          // Insert data into the database
          const myWork = await db.collection("work").insertOne(body);
          res.status(201).json({ data: myWork });
        } catch (err) {
          console.error("Error in POST request:", err);
          res.status(422).json({ message: err.message });
        }
        break;

      case "GET":
        try {
          const allPosts = await db.collection("work").find({}).toArray();
          res.status(200).json({ data: allPosts });
        } catch (err) {
          console.error("Error in GET request:", err);
          res.status(500).json({ message: "Failed to fetch data" });
        }
        break;

      case "DELETE":
        try {
          if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid ID" });
          }

          const result = await db.collection("work").deleteOne({ _id: new ObjectId(id) });

          if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Entry not found" });
          }

          res.status(204).end(); // No content
        } catch (err) {
          console.error("Error in DELETE request:", err);
          res.status(500).json({ message: "Failed to delete entry" });
        }
        break;

      default:
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
