"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Card from "../../../../../../../components/card";
import ConfigDialog from "../../../../../../../components/ConfirmDialog";
import { Editor } from "@tinymce/tinymce-react";

export default function EditBlogs() {
  const router = useRouter();
  const editorRef = useRef(null);
  const params = useParams();
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isOkOnly, setIsOkOnly] = useState(true);
  const [data, setData] = useState({
    title: "",
    subTitle: "",
    content: "",
    category: "",
  });

  const fetDataById = async () => {
    try {
      const res = await fetch(`/api/blogs/list-blogs/${params.id}`);
      const responseData = await res.json();
      setData(responseData.data);
    } catch (err) {
      console.error("ERR", err.message);
      setModal(true);
      setModalTitle("Err");
      setModalMessage(err.message);
    }
  };

  const onCancel = () => {
    setModal(false);
  };

  const onOkOnly = () => {
    setModal(false);
    router.push("/admin-page/blogs/list");
  };

  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const optCategory = [
    { label: "ReactJS", value: "ReactJS" },
    { label: "PHP Programming", value: "PHP Programming" },
    { label: "VueJS", value: "VueJS" },
    { label: "React Native", value: "React Native" },
  ];

  const onSubmitData = async () => {
    try {
      if (editorRef.current) {
        const body = { ...data };
        body.content = editorRef.current.getContent();

        let res = await fetch(`/api/blogs/list-blogs/${data._id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });

        let resData = await res.json();
        setModal(true);
        setModalTitle("Info");
        setModalMessage(resData.message);
        router.push("/admin-page/blogs/list");
      }
    } catch (err) {
      console.error("ERR", err.message);
      setModal(true);
      setModalTitle("Err");
      setModalMessage(err.message);
    }
  };

  useEffect(() => {
    fetDataById();
  }, []);

  return (
    <>
      <div className="flex mt-20 justify-center">
        <div className="md:w-3/4">
          <div className="bg-white-800 dark:bg-black dark:text-white p-5 rounded-xl">
            <h3 className="text-xl py-2">
              <b>Edit Blog</b>
            </h3>
            <p className="text-red-400">*indicates required</p>
            <Card title="Blog Form" className="mb-5">
              {/* Title */}
              <div className="row mb-5">
                <label className="font-bold">Title *</label>
                <input
                  type="text"
                  name="title"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={data.title || ""} // Ensure title is never undefined
                  onChange={inputHandler}
                  placeholder="Enter blog title"
                />
              </div>

              {/* Sub Title */}
              <div className="row mb-5">
                <label className="font-bold">Sub Title *</label>
                <input
                  type="text"
                  name="subTitle"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={data.subTitle || ""} // Ensure subTitle is never undefined
                  onChange={inputHandler}
                  placeholder="Enter blog sub title"
                />
              </div>

              {/* Category */}
              <div className="row mb-5">
                <label className="font-bold">Category *</label>
                <select
                  name="category"
                  onChange={inputHandler}
                  className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={data.category}
                >
                  <option value="">Please Select</option>
                  {optCategory.map((item, key) => (
                    <option key={key} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div className="row mb-5">
                <label className="font-bold">Content *</label>
                <Editor
                  apiKey="hz9os6h0p1826jcqknks4q1fm8yl9khctaa7nmexkf0rnx2e"
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  initialValue={data.content || ""} // Ensure content is never undefined
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={onSubmitData}
                  className="mx-1 h-9 items-center justify-center px-4 rounded-md bg-amber-500"
                >
                  {data._id ? "Update Blog" : "Submit Blog"}
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ConfigDialog
        onOkOnly={() => onOkOnly()}
        showDialog={modal}
        title={modalTitle}
        message={modalMessage}
        onCancel={() => onCancel()}
        onOk={() => onConfirmOk()}
        isOkOnly={isOkOnly}
      />
    </>
  );
}
