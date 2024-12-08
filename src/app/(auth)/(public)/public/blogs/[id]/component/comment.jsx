"use client";

import { useState } from "react";

export default function CommentSection({
  blogId,
  commentList,
  loadCommentList,
}) {
  const [dataComment, setDataComment] = useState({
    name: "",
    email: "",
    subTitle: "",
    comment: "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setDataComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!dataComment.name || !dataComment.comment) {
      alert("Name and comment are required");
      return;
    }

    try {
      const res = await fetch(
        `/api/blogs/list-blogs/comments/${blogId}/comment`,
        {
          method: "POST",
          body: JSON.stringify(dataComment),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check the response from the server
      const data = await res.json();
      if (res.ok) {
        setDataComment({
          name: "",
          email: "",
          subTitle: "",
          comment: "",
        });
        loadCommentList(); // Reload comments after submission
      } else {
        console.error("Failed to submit comment:", data);
        alert(data.message || "Failed to submit comment");
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
          {commentList.length > 0 ? (
            commentList.map((comment) => (
              <li key={comment._id} className="mt-2 p-2 border-b">
                <strong>{comment.name}</strong>
                {comment.subTitle && (
                  <p className="font-medium">{comment.subTitle}</p>
                )}
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
