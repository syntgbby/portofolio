import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const { method } = req;
    const { search } = req.query;

    switch (method) {
      case "GET":
        try {
          let filter = {};

          // Check if there's a search query and create a filter for title and category
          if (search) {
            const searchQuery = String(search).toLowerCase();

            // Filter by title and category
            filter = {
              $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { category: { $regex: searchQuery, $options: "i" } },
              ],
            };
          }

          // Fetch posts with the filter
          const allPosts = await db
            .collection("blogs_gebby")
            .find(filter)
            .toArray();
          res.status(200).json({ data: allPosts });
        } catch (err) {
          console.error("Error in GET request:", err);
          res
            .status(500)
            .json({ message: "Failed to fetch data", error: err.message });
        }
        break;

      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
