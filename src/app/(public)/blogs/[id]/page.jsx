"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function SeeBlog() {
  const { id } = useParams();
  const [comments, setComments] = useState([]); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ name: "", email: "", comment: "" });
  const [loadingComments, setLoadingComments] = useState(false);
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState(false);  // New loading state for replies

  useEffect(() => {
    fetchBlogDetails();
    fetchComments();
  }, [id]);

  // Fetch blog details
  const fetchBlogDetails = async () => {
    try {
      const res = await fetch(`/api/blogs/list-blogs/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog details");
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      console.error("Error fetching blog details:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/comment/${id}`);
      const response = await res.json();
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  // Fetch replies for each comment
  useEffect(() => {
    const fetchReplies = async () => {
      setLoadingReplies(true);
      const repliesData = {};
      for (const comment of comments) {
        try {
          const replyRes = await fetch(`/api/reply-comment/${comment._id}`);
          const replyData = await replyRes.json();
          repliesData[comment._id] = replyData.data;
        } catch (err) {
          console.error(`Error fetching replies for comment ${comment._id}:`, err.message);
        }
      }
      setReplies(repliesData);
      setLoadingReplies(false);
    };

    if (comments.length > 0) {
      fetchReplies();
    }
  }, [comments]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.comment) {
      toast.error("Name, Email, and Comment are required");
      return;
    }
    try {
      const res = await fetch(`/api/comment/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      const response = await res.json();
      setNewComment({ name: "", email: "", comment: "" });
      toast.success("Comment successfully added");
      fetchComments(); // Refresh comments after adding a new one
    } catch (err) {
      console.error("Error submitting comment:", err.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!data) {
    return <p className="text-center mt-20 text-red-500">Blog not found</p>;
  }

  return (
    <div className="flex flex-col mt-40 justify-center items-center md:3/3">
      <Toaster />
      <div className="md:w-1/4 mb-10">
        <div className=" bg-rose-50 p-5 rounded-xl">
          <h3 className="text-3xl font-semibold py-2 text-center">{data.title}</h3>
          <p className="text-lg text-gray-600 text-center mb-4">{data.subTitle}</p>
          <div className="mt-6 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: data.content }}></div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="md:w-1/4">
        <h4 className="text-2xl font-semibold">Comments</h4>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Your Email"
            value={newComment.email}
            onChange={(e) => setNewComment((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Your Name"
            value={newComment.name}
            onChange={(e) => setNewComment((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Your Comment"
            value={newComment.comment}
            onChange={(e) => setNewComment((prev) => ({ ...prev, comment: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg"
          ></textarea>
          <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded-lg">
            Submit Comment
          </button>
        </form>

        {/* Comment List */}
        {loadingComments ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {comments.map((comment) => (
              <li key={comment._id} className="p-4 bg-rose-100 rounded-lg mb-4">
                <div className="text-sm">
                <p className="font-semibold mb-2">From: {comment.name}</p>
                <p className="text-gray-700 mb-2">{comment.comment}</p>
                <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>

                {/* Display replies */}
                {replies[comment._id] && replies[comment._id].length > 0 && (
                  <div className="mt-4 pl-6 text-sm">
                    <h5 className="text-sm font-semibold">Replies from admin:</h5>
                    <ul>
                      {replies[comment._id].map((reply, idx) => (
                        <li key={idx} className="bg-rose-50 p-2 rounded-md mb-2 text-right" >
                          <p className="text-gray-700">{reply.reply}</p>
                          <p className="text-sm text-gray-500">{new Date(reply.date).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
