import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_NAME);
  const { id } = req.query;

  // Validate the `id` format
  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const objectId = new ObjectId(id); // Convert the `id` to MongoDB ObjectId

  try {
    switch (req.method) {
      case "GET":
        // Fetch a single document by its `_id`
        const work = await db
          .collection("blogs_gebby")
          .findOne({ _id: objectId });

        if (!work) {
          return res.status(404).json({ message: "Data not found" });
        }

        res.status(200).json({ data: work });
        break;

      case "PUT":
        const body = JSON.parse(req.body);
        const filter = { _id: id};
        
        const updateDoc = {
          $set: {
            title: body.title,
            category: body.category,
            subTitle: body.subTitle,
            content: body.content,
          },
        };

        const result = await db
          .collection("blogs_gebby")
          .updateOne({ _id: objectId }, updateDoc, { upsert: true });

        res.status(200).json({ message: "Data successfully updated" });
        break;

        case "DELETE":
        try {
          if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid ID" });
          }

          const result = await db
            .collection("blogs_gebby")
            .deleteOne({ _id: new ObjectId(id) });

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
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (err: any) {
    console.error("Error handling request:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
