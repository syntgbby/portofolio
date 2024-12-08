import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const { method } = req;
    const { id } = req.query;  // Blog post ID

    // Ensure id is a valid ObjectId
    if (!ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    switch (method) {
      case "POST":
        // Add a new comment to a specific blog post
        try {
          const { name, email, subTitle, comment } = req.body;

          // Validate the incoming comment data
          if (!name || !comment) {
            return res.status(400).json({ message: "Name and comment are required" });
          }

          const newComment = {
            name,
            email: email || "",  // Email is optional
            subTitle: subTitle || "",
            comment,
            createdAt: new Date(),
          };

          // Insert the comment into the comments collection of the blog post
          const result = await db.collection("comment-blog_gebby").updateOne(
            { _id: new ObjectId(id as string) },
            { $push: { comments: newComment } }
          );

          if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Blog post not found" });
          }

          res.status(201).json({ message: "Comment added successfully", data: newComment });
        } catch (err) {
          console.error("Error in POST request:", err);
          res.status(422).json({ message: err.message });
        }
        break;

      case "GET":
        // Fetch all comments for a specific blog post
        try {
          const blogPost = await db.collection("comment-blog_gebby").findOne({ _id: new ObjectId(id as string) });

          if (!blogPost) {
            return res.status(404).json({ message: "Blog post not found" });
          }

          // Return the comments of the blog post
          res.status(200).json({ data: blogPost.comments || [] });
        } catch (err) {
          console.error("Error in GET request:", err);
          res.status(500).json({ message: "Failed to fetch comments", error: err.message });
        }
        break;

      case "DELETE":
        // Delete a specific comment from the blog post
        try {
          const { commentId } = req.query; // Assuming you pass commentId in the query

          if (!ObjectId.isValid(commentId as string)) {
            return res.status(400).json({ message: "Invalid comment ID" });
          }

          const result = await db.collection("comment-blog_gebby").updateOne(
            { _id: new ObjectId(id as string) },
            { $pull: { comments: { _id: new ObjectId(commentId as string) } } }
          );

          if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Comment not found" });
          }

          res.status(204).end(); // No content
        } catch (err) {
          console.error("Error in DELETE request:", err);
          res.status(500).json({ message: "Failed to delete comment" });
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
