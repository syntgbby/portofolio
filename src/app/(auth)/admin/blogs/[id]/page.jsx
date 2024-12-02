"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';
import Card from '../../../../../components/card';
import ConfigDialog from '../../../../../components/ConfirmDialog';

export default function AdminBlogsForm() {
    const params = useParams();
    const router = useRouter();
    const editorRef = useRef(null);
    const [isOkOnly, setIsOkOnly] = useState(true);

    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        subTitle: '',
        content: '',
    });

    // Clear form data after submission or cancellation
    const clearForm = () => {
        setFormData({
            title: '',
            subTitle: '',
            content: '',
        });
    };

    // Handle input changes
    const inputHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission (create or update)
    async function onSubmitData() {
        setLoading(true);
        try {
            const method = formData._id ? "PUT" : "POST"; // POST for new blog, PUT for updating
            const url = formData._id
                ? `/api/blogs/blogs/${formData._id}`
                : "/api/blogs/blogs"; // Dynamic URL for PUT

            // If editing, update content from the editor
            if (editorRef.current) {
                formData.content = editorRef.current.getContent();
            }

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const resData = await res.json();

            if (!resData.data) {
                throw new Error(resData.message);
            }

            setModal(true);
            setModalTitle('Success');
            setModalMessage(`Data successfully saved with id: ${resData.data.insertedId || resData.data._id}`);
            router.push('/admin/blogs'); // Redirect to blogs list page (or any other desired page)
            clearForm(); // Reset form after submission
        } catch (err) {
            console.error("Error:", err.message);
            setModal(true);
            setModalTitle('Error');
            setModalMessage(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Handle form cancellation
    const onCancel = () => {
        setModal(false);
    };

    const onOkOnly = () => {
        setModal(false);
        router.push('/admin/blogs');
    };

    // Load existing data (for editing an existing blog)
    const fetDataById = async () => {
        try {
            // Validate if the ID is in the correct format (24 characters long)
            const validId = /^[a-fA-F0-9]{24}$/.test(params.id);
            
            if (!validId) {
                throw new Error('Invalid ID format');
            }
    
            const res = await fetch(`/api/blogs/${params.id}`);
            let responseData = await res.json();
            if (responseData.data) {
                setFormData(responseData.data);
            }
        } catch (err) {
            console.error("ERR", err.message);
            setModal(true);
            setModalTitle('Error');
            setModalMessage(err.message);
        }
    };
    

    // Fetch data when component mounts (for editing a blog)
    useEffect(() => {
        fetDataById();
    }, [params.id]);

    // Show the form only after data has been fetched (prevent accessing undefined data)
    if (loading || !formData) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {loading && <p>Loading...</p>}
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
                                    value={formData.title || ''} // Ensure title is never undefined
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
                                    value={formData.subTitle || ''} // Ensure subTitle is never undefined
                                    onChange={inputHandler}
                                    placeholder="Enter blog sub title"
                                />
                            </div>

                            {/* Content */}
                            <div className="row mb-5">
                                <label className="font-bold">Content *</label>
                                <Editor
                                    apiKey="hz9os6h0p1826jcqknks4q1fm8yl9khctaa7nmexkf0rnx2e"
                                    onInit={(_evt, editor) => (editorRef.current = editor)}
                                    initialValue={formData.content || ''} // Ensure content is never undefined
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
                                    {formData._id ? 'Update Blog' : 'Submit Blog'}
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal Dialog for showing info or error */}
            <ConfigDialog
                onOkOnly={onOkOnly}
                showDialog={modal}
                title={modalTitle}
                message={modalMessage}
                onCancel={onCancel}
                onOk={onCancel}
                isOkOnly={isOkOnly}
            />
        </>
    );
}
