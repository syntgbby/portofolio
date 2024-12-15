"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ConfigDialog from "../../../../../../components/ConfirmDialog";
// import CommentSection from "./component/comment"; // Import CommentSection

export default function SeeBlogs() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  // const [commentList, setCommentList] = useState([]); // Add state for comment list

  const [data, setData] = useState({
    title: "",
    subTitle: "",
    content: "",
  });

  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Fetch blog data by ID
  const fetchDataById = async () => {
    try {
      const res = await fetch(`/api/blogs/list-blogs/${params.id}`); // Fetch blog data
      const responseData = await res.json();
      setData(responseData.data);
    } catch (err) {
      console.error("Error:", err.message);
      showModal("Error", err.message);
    }
  };

  // Load comment list
  // const loadCommentList = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`/api/blogs/list-blogs/comments`); // Fetch comments for specific blog post
  //     const data = await res.json();
  //     setCommentList(data.data || []);
  //   } catch (error) {
  //     console.error("Failed to load comment list:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Show modal with title and message
  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModal(true);
  };

  const onCancel = () => setModal(false);

  const onOkOnly = () => {
    setModal(false);
    router.push("/public/blogs");
  };

  useEffect(() => {
    fetchDataById();
    // loadCommentList(); // Fetch comments when the page loads
  }, [params.id]); // Ensure it re-fetches if the blog ID changes

  return (
    <>
      <div className="flex mt-40 justify-center">
        <div className="md:w-3/4">
          <div className="bg-rose-50 p-5 rounded-xl">
            {/* Blog Title */}
            <h3 className="text-3xl font-semibold py-2 text-center">
              {data.title || "Loading..."}
            </h3>

            {/* Blog Subtitle */}
            <p className="text-lg text-gray-600 text-center">
              {data.subTitle || ""}
            </p>

            {/* Blog Content */}
            <div className="mt-6">
              <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: data.content || "Loading content...",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      {/* <CommentSection
        blogId={params.id}
        commentList={commentList} // Pass the comment list to CommentSection
        loadCommentList={loadCommentList} // Reload comment list after adding a comment
      /> */}

      {/* Modal for errors or success */}
      <ConfigDialog
        onOkOnly={onOkOnly}
        showDialog={modal}
        title={modalTitle}
        message={modalMessage}
        onCancel={onCancel}
        isOkOnly={true}
      />
    </>
  );
}
