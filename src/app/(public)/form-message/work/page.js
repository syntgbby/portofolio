"use client";
import { useState } from 'react';
import Card from '../../../../components/card';

export default function AdminWork() {
    const [data, setData] = useState({
        title: '',
        employmentType: '',
        company: '',
        location: '',
        locationType: '',
        startDate: '',
        endDate: ''
    });

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
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onSubmitData = async () => {
        try {
            let res = await fetch('/api/work', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                // Jika respons tidak OK, lemparkan kesalahan
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            let resData = await res.json();
            if (!resData.data) {
                throw new Error(resData.message);
            }
            alert("Data berhasil ditambahkan dengan id: " + resData.data.insertedId);
        } catch (err) {
            console.log("ERROR", err.message);
            alert(err.message);
        }
    };

    return (
        <>
        <div className="flex mt-20 justify-center">
            <div className="md:w-3/4">
                <div className="bg-white-800 dark:bg-black dark:text-white p-5 rounded-xl justify-content-left">
                    <h3 className="text-xl py-2"><b>Add Experience</b></h3>
                    <p className="text-red-400">*indicates required</p>
                    <div className="col-md-2 bg-sky-50 dark:bg-black dark:text-white p-2 border-radius-50 mt-5">
                            <div className="row">
                                <h4><b>Notify Network</b></h4>
                                <p>Turn on to notify your network of key profile changes (such as new job) and work anniversaries. Updates can take up to 2 hours.</p>
                                <p>Learn more about <a href='/home' className='text-blue-500 cursor-pointer'>sharing profile changes</a></p>
                            </div>
                    </div>
                    {/* Title Input */}
                    <Card title="Work Form" className="mb-5">
                        <div className="row mb-5">
                            <label className='font-bold'>Title *</label>
                            <input
                                type="text"
                                name="title"
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                value={data.title}
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
                            >
                                <option value="">Please Select</option>
                                {
                                    optEmployeeType.map((item, key) =>
                                        <option key={key} value={item.value}>{item.label}</option>
                                    )
                                }
                            </select>
                            <p className='text-gray-400 text-sm'>Learn more about <a href="/employment" className="text-blue-400">employment types</a></p>
                        </div>
                        <div className="row mb-5">
                            <label className='font-bold'>Company Name *</label>
                            <input
                                type="text"
                                name='company'
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                onChange={inputHandler}
                                placeholder="Ex: Microsoft"
                            />
                        </div>
                        <div className="row mb-5">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                onChange={inputHandler}
                                placeholder="Ex: London, United Kingdom"
                            />
                        </div>
                        <div className="row mb-5">
                            <label>Location Type</label>
                            <select
                                name="locationType"
                                onChange={inputHandler}
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mt-3 mb-3 w-full"
                            >
                                <option value="">Please Select</option>
                                {
                                    optLocation.map((item, key) =>
                                        <option key={key} value={item.value}>{item.label}</option>
                                    )
                                }
                            </select>
                            <p className="text-gray-400">Pick a location type (ex: remote)</p>
                        </div>
                        <div className="row mb-5">
                            <input
                                type="checkbox"
                                className="border-2 border-blue-300 bg-transparent hover:bg-blue-300 focus:outline-none focus:border-blue-500 h-5 w-5"
                                value="Submit"
                            />
                            <label className="ml-2"> I am currently working in this role</label>
                        </div>
                        <div className="row mb-5">
                            <label>Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                onChange={inputHandler}
                            />
                        </div>
                        <div className="row mb-5">
                            <label>End Date *</label>
                            <input
                                type="date"
                                name="endDate"
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                onChange={inputHandler}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onSubmitData}
                                className=" text-white font-bold py-2 px-4 hover:bg-rose-400 focus:outline-none justify-center rounded-md bg-rose-600"
                            >
                                Submit Data
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
        </>
    );
}