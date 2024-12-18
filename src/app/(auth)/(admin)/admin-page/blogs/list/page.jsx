"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfigDialog from "../../../../../../components/ConfirmDialog";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML
import {Toaster, toast} from 'sonner';

export default function AdminBlogs() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalBtnOk, setModalBtnOk] = useState("");
  const [isOkOnly, setIsOkOnly] = useState(false);
  const [comments, setComments] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [deleteType, setDeleteType] = useState(null); // Track the delete type (blog/comment)

  // State for replying to comments
  const [replyComment, setReplyComment] = useState(null);
  const [replyText, setReplyText] = useState("");

  const onEditHandler = (id) => {
    // Arahkan ke halaman form untuk mengedit item berdasarkan ID
    router.push(`/admin-page/blogs/list/${id}`);
  };

  useEffect(() => {
    onLoadData();
  }, []);

  async function onLoadData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs`);
      let responseData = await res.json();

      setData(responseData.data);
      setFilteredBlogs(responseData.data);

      const commentsData = await Promise.all(
        responseData.data.map(async (data) => {
          const commentRes = await fetch(`/api/comment/${data._id}`);
          const commentData = await commentRes.json();
          return { ...data, comments: commentData.data };
        })
      );

      setComments(commentsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const onCancel = () => {
    setModal(false);
  };

  const truncateContent = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the HTML
    return sanitizedContent.length > 200
      ? sanitizedContent.slice(0, 200) + "..."
      : sanitizedContent;
  };

  const onDeleteItem = (id) => {
    setIsOkOnly(false);
    setDeleteType("blog"); // Set the type to blog
    setModal(true);
    setModalBtnOk("Delete");
    setModalMessage(`Are you sure you want to delete this blog?`);
    setModalTitle("Confirm Delete");
    setDeleteId(id);
  };

  const onDeleteCommentItem = (commentId) => {
    setIsOkOnly(false);
    setDeleteType("comment");
    setModal(true);
    setDeleteId(commentId); // Directly set commentId for deletion
    setModalTitle("Confirm Delete");
    setModalBtnOk("Delete");
    setModalMessage("Are you sure you want to delete this comment?");
  };

  const onAddNew = () => {
    router.push("/admin-page/blogs/list/form");
  };

  const onSubmitDelete = async () => {
    setModal(false);
    try {
      if (deleteType === "blog") {
        const response = await fetch(`/api/blogs/list-blogs/${deleteId}`, {
          method: "DELETE",
        });
      } else {
        const response = await fetch(`/api/comment/commentId/${deleteId}`, {
          method: "DELETE",
        });
      }

      // setModal(true);
      // setModalMessage(`Data has been successfully deleted.`);
      // setModalTitle("Info");
      // setIsOkOnly(true);
      
      if(deleteType === "blog"){
        setData((prevData) => prevData.filter((item) => item._id !== deleteId));
      }else{
        setComments((prevComments) => prevComments.filter((item) => item._id !== deleteId));
      }
      toast.success("Data has been successfully deleted.");
    } catch (error) {
      console.error("Error deleting entry:", error);
      setModal(true);
      setModalMessage("Failed to delete the entry.");
      setModalTitle("Error");
      setIsOkOnly(true);
    }
  };

  const handleReplyClick = (comment) => {
    setReplyComment(comment);
    setReplyText("");
  };

  const onViewHandler = (id) => {
    router.push(`/admin-page/blogs/view/${id}`);
  };

  const handleReplySubmit = async (e) => {
  e.preventDefault();

  if (!replyText.trim()) {
    alert("Reply cannot be empty");
    return;
  }

  try {
    const response = await fetch("/api/reply-comment", { // Menggunakan URL tanpa parameter commentId
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply: replyText, // Mengirim balasan
        commentId: replyComment._id, // Mengirim commentId yang dipilih untuk balasan
      }),
    });

    const result = await response.json();

    if (result.success) {
      toast.success("Reply added successfully!");
      setReplyText(""); // Mengosongkan input balasan
      setReplyComment(null); // Menutup form balasan

      // Menambahkan balasan pada komentar
      // setComments((prevComments) => {
      //   return prevComments.map((item) => {
      //     if (item._id === replyComment.blogId) { // Menggunakan blogId untuk mencocokkan blog
      //       return {
      //         ...item,
      //         comments: [...item.comments, { reply: replyText, name: "Admin", date: new Date() }],
      //       };
      //     }
      //     return item;
      //   });
      // });
    } else {
      toast.error("Error adding reply: " + result.message);
    }
  } catch (error) {
    console.error("Error while submitting reply:", error);
    toast.error("Error submitting reply: " + error.message);
  }
};

  return (
    <>
      <ConfigDialog
        onCancel={onCancel}
        onOk={onSubmitDelete}
        onOkOnly={onCancel}
        showDialog={modal}
        title={modalTitle}
        message={modalMessage}
        okBtnMessage={modalBtnOk}
        isOkOnly={isOkOnly}
      />

      <div className="pt-20 mt-20">
        <Toaster />
        <div className="px-4 my-2">
              <h3 className="flex-1 text-2xl py-2 text-center">List Blogs</h3>
            <div>
              <button
                onClick={onAddNew}
                className="text-[12px] bg-green-300 hover:bg-green-400 text-gray-80 py-2 px-4 mb-5 rounded"
              >
                Add New
              </button>
            </div>
            <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-rose-200">
                  <th className="py-2 px-4 border-b">No</th>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Sub Title</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Content</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8}>Loading...</td>
                  </tr>
                )}
                {!loading &&
                  data.map((item, idx) => (
                    <tr key={item._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b text-sm">{idx + 1}</td>
                      <td className="py-2 px-4 border-b text-sm">
                        {item.title}
                      </td>
                      <td className="py-2 px-4 border-b text-sm">
                        {item.subTitle}
                      </td>
                      <td className="py-2 px-4 border-b text-sm">
                        {item.category}
                      </td>
                      <td
                        className="py-2 px-4 border-b text-sm"
                        dangerouslySetInnerHTML={{
                          __html: truncateContent(item.content), // Display truncated content
                        }}
                      ></td>
                      <td className="py-2 px-4 border text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => onViewHandler(item._id)}
                            className="bg-blue-300 hover:bg-blue-400 text-gray-800 py-2 px-4 rounded-md"
                          >
                            View
                          </button>
                          <button
                            onClick={() => onEditHandler(item._id)}
                            className="bg-green-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteItem(item._id)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            </div>
        </div>
        <div className="px-4 my-2">
              <h3 className="flex-1 text-2xl py-2 text-center">List Comments</h3>
              <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-rose-200">
                  <th className="py-2 px-4 border-b">No</th>
                  <th className="py-2 px-4 border-b">Blog Title</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Comment</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8}>Loading...</td>
                  </tr>
                )}
                {!loading &&
                  comments.map((item, idx) => {
                    return item.comments.map((comment, key) => (
                      <tr key={key} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b text-sm">{idx + 1}</td>
                        <td className="py-2 px-4 border-b text-sm">
                          {item.title}
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {comment.name}
                        </td>
                        <td className="py-2 px-4 border-b text-sm">
                          {comment.comment}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          <div className="flex justify-center gap-2">
                            <button
                            onClick={() => onViewHandler(item._id)}
                            className="bg-blue-300 hover:bg-blue-400 text-gray-800 py-2 px-4 rounded-md"
                          >
                            View
                          </button>
                            <button
                            onClick={() => handleReplyClick(comment)}
                            className="bg-green-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-md"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => onDeleteCommentItem(comment._id)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      </tr>
                    ));
                  })}
              </tbody>
            </table>
            </div>

            {replyComment && (
              <div className="md:w-4/4 md:p-2 md:mb-0 mb-5 pt-2">
                <h3 className="text-sm">Reply To : {replyComment.name}</h3>
                <h3 className="text-sm">Comment : {replyComment.comment}</h3>
                <form onSubmit={handleReplySubmit} className="mt-5">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Write your reply here..."
                  />
                  <button type="submit" className="bg-green-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-l">
                    Submit
                  </button>
                </form>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
