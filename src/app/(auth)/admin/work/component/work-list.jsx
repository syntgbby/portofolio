"use client";
import { useState, useEffect } from "react";
import ConfigDialog from '../../../../../components/ConfirmDialog';
import { useRouter } from "next/navigation";

export default function WorkList({ onEditItem: editItemProp }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalBtnOk, setModalBtnOk] = useState("");
    const [isOkOnly, setIsOkOnly] = useState(false);

    // Fetch the data for work list
    async function onLoadData() {
        setLoading(true);
        try {
            const res = await fetch('/api/work/work');
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            setData(data.data);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    }

    // Handle delete action
    const onDeleteItem = (id) => {
        setIsOkOnly(false);
        setModal(true);
        setModalBtnOk("Delete");
        setModalMessage(`Do you want to delete this item with ID ${id}?`);
        setModalTitle("Confirm Delete?");
        setDeleteId(id);
    };

    // Edit item (using prop method)
    const onEditHandler = (id) => {
        editItemProp(id); // Call the prop function passed to this component
    };

    // Cancel modal
    const onCancel = () => {
        setModal(false);
        setDeleteId(null);
    };

    // Submit the delete request
    const onSubmitDelete = async () => {
        if (deleteId === null) return; // Ensure deleteId is set

        setModal(false);
        try {
            const response = await fetch(`/api/work/work?id=${deleteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the entry');
            }

            setModal(true);
            setModalMessage(`Data has been successfully deleted.`);
            setModalTitle("Info");
            setIsOkOnly(true);

            // Update the data state to remove the deleted entry
            setData(prevData => prevData.filter(item => item._id !== deleteId));
        } catch (error) {
            console.error("Error deleting entry:", error);
            setModal(true);
            setModalMessage("Failed to delete the entry.");
            setModalTitle("Error");
            setIsOkOnly(true);
        }
    };

    useEffect(() => {
        onLoadData();
    }, []);

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

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-rose-200">
                        <th className="py-2 px-4 border-b">No</th>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Employment Type</th>
                        <th className="py-2 px-4 border-b">Company Name</th>
                        <th className="py-2 px-4 border-b">Location</th>
                        <th className="py-2 px-4 border-b">Start Date</th>
                        <th className="py-2 px-4 border-b">End Date</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <tr><td colSpan={8}>Loading...</td></tr>}
                    {!loading && data.map((item, idx) => (
                        <tr key={item._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{idx + 1}</td>
                            <td className="py-2 px-4 border-b">{item.title}</td>
                            <td className="py-2 px-4 border-b">{item.employmentType}</td>
                            <td className="py-2 px-4 border-b">{item.company}</td>
                            <td className="py-2 px-4 border-b">{item.location}</td>
                            <td className="py-2 px-4 border-b">{item.startDate}</td>
                            <td className="py-2 px-4 border-b">{item.endDate}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <div className="inline-flex text-[12px]">
                                    <button 
                                        onClick={() => onEditHandler(item._id)} 
                                        className="bg-green-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-l">
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => onDeleteItem(item._id)} 
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-r">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
