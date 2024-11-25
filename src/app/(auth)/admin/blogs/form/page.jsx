'use client';
import { useState, useEffect } from 'react';
import Card from '../../../../../components/card';
import ConfigDialog from '../../../../../components/ConfirmDialog';

export default function AdminBlogsForm() {
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        subTitle: '',
        content: '',
        id: ''
    });

    // Clear form data after submission or cancellation
    const clearForm = () => {
        setFormData({
            title: '',
            subTitle: '',
            content: '',
            id: ''
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
            const method = formData.id ? "PUT" : "POST"; // POST for new blog, PUT for updating
            const url = formData.id ? `/api/blogs/blogs/${formData.id}` : "/api/blogs/blogs"; // Dynamic URL for PUT

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
            await onLoadData(); // Refresh the blogs list (if applicable)
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
        setModalTitle('');
        setModalMessage('');
    };

    // Function to load data when editing an existing blog
    const onEditItem = async (id) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/blogs/blogs/${id}`);
            const resData = await res.json();
            if (resData.data) {
                setFormData({
                    title: resData.data.title,
                    subTitle: resData.data.subTitle,
                    content: resData.data.content,
                    id: resData.data._id
                });
            }
        } catch (err) {
            console.error('Error fetching data:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load existing data (for editing an existing blog)
    const onLoadData = async () => {
        // Placeholder for loading the list of blogs if needed
    };

    useEffect(() => {
        // This function can be used to load data when the component is mounted
        onLoadData();
    }, []);

    return (
        <>
            {loading && <p>Loading...</p>}
            <div className="flex mt-20 justify-center">
                <div className="md:w-3/4">
                    <div className="bg-white-800 dark:bg-black dark:text-white p-5 rounded-xl">
                        <h3 className="text-xl py-2">
                            <b>{formData.id ? 'Edit Blog' : 'Add Blog'}</b>
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
                                    value={formData.title}
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
                                    value={formData.subTitle}
                                    onChange={inputHandler}
                                    placeholder="Enter blog sub title"
                                />
                            </div>

                            {/* Content */}
                            <div className="row mb-5">
                                <label className="font-bold">Content *</label>
                                <textarea
                                    name="content"
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                    value={formData.content}
                                    onChange={inputHandler}
                                    placeholder="Enter content"
                                    rows="5"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={onSubmitData}
                                    className="mx-1 h-9 items-center justify-center px-4 rounded-md bg-amber-500"
                                >
                                    {formData.id ? 'Update Blog' : 'Submit Blog'}
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal Dialog for showing info or error */}
            <ConfigDialog
                onOkOnly={onCancel}
                showDialog={modal}
                title={modalTitle}
                message={modalMessage}
                onCancel={onCancel}
                onOk={onCancel}
                isOkOnly={true}
            />
        </>
    );
}
