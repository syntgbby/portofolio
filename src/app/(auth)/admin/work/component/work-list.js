"use client"
import { useState, useEffect } from "react"
import ConfigDialog from '../../../../../components/ConfirmDialog'

export default function WorkList(){
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [deleteId, setDeleteId]= useState(null)
    const [modal, setModal] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [modalBtnOk, setModalBtnOk] = useState("")
    const [isOkOnly, setIsOkOnly]= useState(false)

    async function onLoadData() {
        setLoading(true)
        let res = await fetch('/api/work')
        let data = await res.json()
        setData(data.data)
        setLoading(false)
    }

    const onDeleteItem = async (id)=>{
        setIsOkOnly(false)
        setModal(true);
        setModalBtnOk("Delete");
        setModalMessage(`Do you want to delete this item ${id}`);
        setModalTitle("Confirm Delete?")
        setDeleteId(id);
    }

    const onCancel=()=>{
        setModal(false);
        setDeleteId(null);
    }

    const onSubmitDelete = async () => {
        if (deleteId === null) return; // Ensure deleteId is set
    
        setModal(false);
        try {
            const response = await fetch(`/api/work?id=${deleteId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete the entry');
            }
    
            setModal(true);
            setModalMessage(`Data Berhasil Dihapus`);
            setModalTitle("Info");
            setIsOkOnly(true);
    
            // Update the data state to remove the deleted entry
            setData(prevData => prevData.filter(item => item._id !== deleteId));
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };
    

    useEffect(() => {
        onLoadData()
    }, [])

    return (
        <>
            <ConfigDialog  
                onCancel={onCancel} 
                onOk={onSubmitDelete} 
                onOkOny={onCancel} 
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
                    { loading &&  <tr><td colSpan={8}>Loading...</td></tr> }
                    {!loading && data.map((item,idx)=>{

                        return (
                            <tr key={idx} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{idx + 1}</td>
                                <td className="py-2 px-4 border-b">{item.title} </td>
                                <td className="py-2 px-4 border-b">{item.employmentType}</td>
                                <td className="py-2 px-4 border-b">{item.company}</td>
                                <td className="py-2 px-4 border-b">{item.location}</td>
                                <td className="py-2 px-4 border-b">{item.startDate}</td>
                                <td className="py-2 px-4 border-b">{item.endDate}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className="inline-flex text-[12px]">
                                        <button className=" bg-green-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-l">
                                            Edit
                                        </button>
                                        <button onClick={()=>onDeleteItem(item._id)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-r">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                        })
                    }
                    
                </tbody>
            </table>
        </>
    )
}