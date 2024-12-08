"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ConfigDialog from "../../../../../../../components/ConfirmDialog";

export default function SeeBlogs() {
  const router = useRouter();
  const params = useParams();

  const [data, setData] = useState({
    title: "",
    subTitle: "",
    content: "",
    _id: "",
  });
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Fetch blog data by ID
  const fetchDataById = async () => {
    try {
      const res = await fetch(`/api/blogs/list-blogs/${params.id}`, {
        method: "GET",
      });

      const responseData = await res.json();
      setData(responseData.data);
    } catch (err) {
      console.error("Error:", err.message);
      showModal("Error", err.message);
    }
  };

  // Show modal with title and message
  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModal(true);
  };

  const onCancel = () => setModal(false);

  const onOkOnly = () => {
    setModal(false);
    router.push("/blogs");
  };

  useEffect(() => {
    fetchDataById();
  }, []);

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
