"use client";
import { Switch } from "@nextui-org/react";
import { useState } from 'react';
import Card from '../../../../components/card';

export default function Contact() {
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
        { label: 'Onsite', value: 'onsite' },
        { label: 'WFH', value: 'wfh' },
    ];

    const inputHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // Handle form submission (e.g., send data to an API)
        console.log(data);
        // You can add any form submission logic here
    };

    return (
        <div className="flex mt-20 justify-content-center">
            <div className="md:w-4/4">
                <div className="bg-white-800 dark:bg-black dark:text-white p-10 rounded-xl justify-content-center">
                    <h3 className="text-2xl py-2"><b>Add Experience</b></h3>
                    <p>*indicates required</p>
                    <div className='mt-5 mb-5'>
                        <div className="col-md-12 bg-sky-50 p-5 border-radius-50">
                            <div className="row">
                                <h4><b>Notify Network</b></h4>
                                <p>Turn on to notify your network of key profile changes (such as new job) and work anniversaries. Updates can take up to 2 hours.</p>
                                <p>Learn more about <a href='/home' className='text-blue-500 cursor-pointer'>sharing profile changes</a></p>
                            </div>
                            {/* Switch */}
                            <div>
                                {/* You can include the Switch component here if needed */}
                            </div>
                        </div>
                    </div>
                    {/* Title Input */}
                    <Card title="Work Form">
                        <div className="row mb-5">
                            <label>Title *</label>
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
                            <label>Employment Type</label>
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
                            <p>Learn more about <a href="/employment" className="text-blue-400">employment types</a></p>
                        </div>
                        <div className="row mb-5">
                            <label>Company Name *</label>
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
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                            >
                                Submit
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
