"use client";

import { useState, useEffect } from "react";

export default function CommentSection({ blogId, loadCommentList }) {
  const [dataComment, setDataComment] = useState({
    name: "",
    email: "",
    subTitle: "",
    comment: "",
  });
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch comment list
  useEffect(() => {
    loadCommentList();
  }, [loadCommentList]);

  const inputHandler = (e) => {
    setDataComment({ ...dataComment, [e.target.name]: e.target.value });
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!dataComment.name || !dataComment.comment) {
      alert("Name and comment are required");
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        body: JSON.stringify(dataComment),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setDataComment({
          name: "",
          email: "",
          subTitle: "",
          comment: "",
        });
        loadCommentList(); // Reload comments after submission
      } else {
        alert("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    }
  };

  return (
    <div className="mt-6">
      {/* Comment Form */}
      <h4 className="text-xl font-semibold">Leave a Comment:</h4>
      <form onSubmit={submitComment} className="mt-4">
        <input
          type="text"
          name="name"
          value={dataComment.name}
          onChange={inputHandler}
          className="w-full p-2 border rounded-md mb-2"
          placeholder="Your Name"
        />
        <input
          type="email"
          name="email"
          value={dataComment.email}
          onChange={inputHandler}
          className="w-full p-2 border rounded-md mb-2"
          placeholder="Your Email (optional)"
        />
        <input
          type="text"
          name="subTitle"
          value={dataComment.subTitle}
          onChange={inputHandler}
          className="w-full p-2 border rounded-md mb-2"
          placeholder="Comment Title (optional)"
        />
        <textarea
          name="comment"
          value={dataComment.comment}
          onChange={inputHandler}
          className="w-full p-2 border rounded-md"
          rows="4"
          placeholder="Write your comment here..."
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit Comment
        </button>
      </form>

      {/* Display Submitted Comments */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold">Comments:</h4>
        <ul>
          {loading ? (
            <p>Loading comments...</p>
          ) : commentList.length > 0 ? (
            commentList.map((comment, index) => (
              <li key={index} className="mt-2 p-2 border-b">
                <strong>{comment.name}</strong>
                <p>{comment.comment}</p>
              </li>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
