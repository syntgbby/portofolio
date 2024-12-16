"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfigDialog from "../../../../../../components/ConfirmDialog";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML

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

  const onEditHandler = (id) => {
    // Arahkan ke halaman form untuk mengedit item berdasarkan ID
    router.push(`/admin/blogs/list/${id}`);
  };

  useEffect(() => {
    onLoadData();
  }, []);

  async function onLoadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs/list-blogs/blogs");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setData(data.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const onCancel = () => {
    setModal(false);
    setDeleteId(null);
  };

  const truncateContent = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the HTML
    return sanitizedContent.length > 200
      ? sanitizedContent.slice(0, 200) + "..."
      : sanitizedContent;
  };

  const onDeleteItem = (id) => {
    setIsOkOnly(false);
    setModal(true);
    setModalBtnOk("Delete");
    setModalMessage(`Do you want to delete this item with ID ${id}?`);
    setModalTitle("Confirm Delete?");
    setDeleteId(id);
  };

  const onAddNew = () => {
    router.push("/admin/blogs/list/form");
  };

  const onSubmitDelete = async () => {
    if (deleteId === null) return;

    setModal(false);
    try {
      const response = await fetch(`/api/blogs/list-blogs/${deleteId}`, {
        method: "DELETE",
      });

      setModal(true);
      setModalMessage(`Data has been successfully deleted.`);
      setModalTitle("Info");
      setIsOkOnly(true);

      setData((prevData) => prevData.filter((item) => item._id !== deleteId));
    } catch (error) {
      console.error("Error deleting entry:", error);
      setModal(true);
      setModalMessage("Failed to delete the entry.");
      setModalTitle("Error");
      setIsOkOnly(true);
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

      <div className="flex mt-28 justify-center">
        <div className="md:w-4/4 md:p-2 md:mb-0 mb-5 pt-2">
          <div>
            <button
              onClick={onAddNew}
              className="text-[12px] bg-green-300 hover:bg-green-400 text-gray-80 py-2 px-4 mb-5 rounded"
            >
              Add New
            </button>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
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
                    <td className="py-2 px-4 border-b text-sm">{item.title}</td>
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
                    <td className="py-2 px-4 border-b text-center">
                      <div className="inline-flex text-[12px]">
                        <button
                          onClick={() => onEditHandler(item._id)}
                          className="bg-green-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-l"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteItem(item._id)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-r"
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
    </>
  );
}
