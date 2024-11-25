"use client";
import { useState, useEffect } from 'react';
import Card from '../../../../components/card';
import WorkList from './component/work-list';

export default function AdminWork() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        employmentType: '',
        company: '',
        location: '',
        locationType: '',
        startDate: '',
        endDate: ''
    });

    const clearForm = () => {
        setFormData({
          title: '',
          employmentType: '',
          company: '',
          location: '',
          locationType: '',
          startDate: '',
          endDate: ''
        });
    }

    const optEmployeeType = [
        { label: 'Full Time', value: 'full-time' },
        { label: 'Part Time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Internship', value: 'internship' }
    ];

    const optLocation = [
        { label: 'Onsite', value: 'Onsite' },
        { label: 'WFH', value: 'WFH' },
        { label: 'Remote', value: 'Remote' },
    ];

    const inputHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function onLoadData() {
        setLoading(true);
        try {
            let res = await fetch('/api/work/work');
            let data = await res.json();
            setFormData({ ...formData, data: data.data || [] }); // Set the fetched data to display the list
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function onSubmitData() {
        try {
            const res = await fetch("/api/work/work", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const resData = await res.json();

            if (!resData.data) {
                throw new Error(resData.message);
            }

            alert("Data berhasil disimpan dengan id \n" + resData.data.insertedId);
            await onLoadData(); // Refresh the work list
            clearForm(); // Reset form after submission
        } catch (err) {
            console.error("ERR", err.message);
            alert(err.message);
        }
    }

    // Edit item handler
    const onEditItem = async (id) => {
        const response = await fetch(`/api/work/${id}`);
        let resData = await response.json();
        const workItem = resData.data[0]; // Assuming the data is an array with a single item

        // Set form data with the fetched work item
        setFormData({
            title: workItem.title,
            employmentType: workItem.employmentType,
            company: workItem.company,
            location: workItem.location,
            locationType: workItem.locationType,
            startDate: workItem.startDate,
            endDate: workItem.endDate
        });
    };

    const onUpdateData = async () => {
        try {
            let res = await fetch(`/api/work/${formData.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData), // Use formData for updating
            });

            let resData = await res.json();
            if (!resData.data) {
                throw new Error(resData.message);
            }
            alert("Data berhasil disimpan dengan id");
            clearForm();
        } catch (err) {
            console.error("ERR", err.message);
            alert(err.message);
        }
    };

    useEffect(() => {
        onLoadData(); // Load data when the component is mounted
    }, []);

    return (
        <>
            {loading && <p>Loading...</p>}
            <div className="flex mt-20 justify-center">
                <div className="md:w-3/4">
                    <div className="bg-white-800 dark:bg-black dark:text-white p-5 rounded-xl justify-content-left">
                        <h3 className="text-xl py-2"><b>Add Experience</b></h3>
                        <p className="text-red-400">*indicates required</p>
                        <div className="col-md-2 bg-sky-50 dark:text-black p-2 border-radius-50 mt-5 rounded-lg">
                            <div className="row">
                                <h4><b>Notify Network</b></h4>
                                <p>Turn on to notify your network of key profile changes (such as new job) and work anniversaries. Updates can take up to 2 hours.</p>
                                <p>Learn more about <a href='/home' className='text-blue-500 cursor-pointer'>sharing profile changes</a></p>
                            </div>
                        </div>
                        <Card title="Work Form" className="mb-5">
                            <div className="row mb-5">
                                <label className='font-bold'>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                    value={formData.title}
                                    onChange={inputHandler}
                                    placeholder="Ex: Retail Sales Manager"
                                />
                            </div>
                            <div className="row mb-5">
                                <label className='font-bold'>Employment Type</label>
                                <select
                                    name="employmentType"
                                    onChange={inputHandler}
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mt-3 mb-3 w-full"
                                    value={formData.employmentType}
                                >
                                    <option value="">Please Select</option>
                                    {optEmployeeType.map((item, key) => (
                                        <option key={key} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                                <p className='text-gray-400 text-sm'>Learn more about <a href="/employment" className="text-blue-400">employment types</a></p>
                            </div>
                            <div className="row mb-5">
                                <label className='font-bold'>Company Name *</label>
                                <input
                                    type="text"
                                    name='company'
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                    value={formData.company}
                                    onChange={inputHandler}
                                    placeholder="Ex: Microsoft"
                                />
                            </div>
                            <div className="row mb-5">
                                <label className='font-bold'>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                    value={formData.location}
                                    onChange={inputHandler}
                                    placeholder="Ex: London, United Kingdom"
                                />
                            </div>
                            <div className="row mb-5">
                                <label className='font-bold'>Location Type</label>
                                <select
                                    name="locationType"
                                    onChange={inputHandler}
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mt-3 mb-3 w-full"
                                    value={formData.locationType}
                                >
                                    <option value="">Please Select</option>
                                    {optLocation.map((item, key) => (
                                        <option key={key} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                                <p className="text-gray-400">Pick a location type (ex: remote)</p>
                            </div>
                            <div className="row mb-5">
                                <label className='font-bold'>Start Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                    value={formData.startDate}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div className="row mb-5">
                                <label className='font-bold'>End Date *</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                    value={formData.endDate}
                                    onChange={inputHandler}
                                />
                            </div>

                            <div className="flex justify-end">
                                {formData.id ? (
                                    <button
                                        onClick={onUpdateData}
                                        className="mx-1 h-9 items-center justify-center px-4 rounded-md bg-amber-500">
                                        <label>Update Data</label>
                                    </button>
                                ) : (
                                    <button
                                        onClick={onSubmitData}
                                        className="mx-1 h-9 items-center justify-center px-4 rounded-md bg-amber-500">
                                        <label>Submit Data</label>
                                    </button>
                                )}
                            </div>
                        </Card>
                        <Card title="List of Work" style="mt-5">
                            <WorkList onEditItem={onEditItem} />
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
