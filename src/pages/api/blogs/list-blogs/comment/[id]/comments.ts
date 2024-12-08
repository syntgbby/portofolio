import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const { method } = req;
    const { id } = req.query; // Blog post ID (from URL)

    // Ensure id is a valid ObjectId
    if (!ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    switch (method) {
      case "POST":
        try {
          const { name, email, subTitle, comment } = req.body;

          // Validate the incoming comment data
          if (!name || !comment) {
            return res.status(400).json({ message: "Name and comment are required" });
          }

          const newComment = {
            _id: new ObjectId(), // Unique ID for the comment
            blogId: id, // Associate comment with blog ID
            name,
            email: email || "", // Optional email
            subTitle: subTitle || "",
            comment,
            createdAt: new Date(),
          };

          // Insert the comment into the comments array of the blog post
          const result = await db.collection("comment-blog_gebby").updateOne(
            { _id: new ObjectId(id as string) },
            { $push: { comments: newComment } }
          );

          if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Blog post not found" });
          }

          // Return the newly added comment with a success message
          res.status(201).json({ message: "Comment added successfully", data: newComment });
        } catch (err) {
          console.error("Error in POST request:", err);
          res.status(422).json({ message: "Error adding comment", error: err.message });
        }
        break;

      case "GET":
        try {
          // Fetch the blog post and its comments
          const blogPost = await db
            .collection("comment-blog_gebby")
            .findOne({ _id: new ObjectId(id as string) });

          if (!blogPost) {
            return res.status(404).json({ message: "Blog post not found" });
          }

          // Return the list of comments (if any)
          res.status(200).json({ data: blogPost.comments || [] });
        } catch (err) {
          console.error("Error in GET request:", err);
          res.status(500).json({ message: "Failed to fetch comments", error: err.message });
        }
        break;

      case "DELETE":
        try {
          const { commentId } = req.query;

          // Ensure the commentId is a valid ObjectId
          if (!ObjectId.isValid(commentId as string)) {
            return res.status(400).json({ message: "Invalid comment ID" });
          }

          // Remove the specified comment from the blog post's comments array
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
          res.status(500).json({ message: "Failed to delete comment", error: err.message });
        }
        break;

      default:
        res.setHeader("Allow", ["POST", "GET", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
