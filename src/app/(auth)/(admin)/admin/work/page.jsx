"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Card from "../../../../../components/card";
import WorkList from "../../../../../components/comment-list";

export default function AdminWork() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    employmentType: "",
    company: "",
    location: "",
    locationType: "",
    startDate: "",
    endDate: "",
  });
  const [workList, setWorkList] = useState([]); // State to store the work list

  const clearForm = () => {
    setFormData({
      title: "",
      employmentType: "",
      company: "",
      location: "",
      locationType: "",
      startDate: "",
      endDate: "",
    });
  };

  const optEmployeeType = [
    { label: "Full Time", value: "Full-time" },
    { label: "Part Time", value: "Part-time" },
    { label: "Contract", value: "Contract" },
    { label: "Internship", value: "Internship" },
  ];

  const optLocation = [
    { label: "Onsite", value: "Onsite" },
    { label: "WFH", value: "WFH" },
    { label: "Remote", value: "Remote" },
  ];

  const inputHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadWorkList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/work/work");
      const data = await res.json();
      setWorkList(data.data || []);
    } catch (error) {
      console.error("Failed to load work list:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitData = async () => {
    try {
      const res = await fetch("/api/work/work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (res.ok) {
        alert("Data berhasil disimpan");
        clearForm();
        loadWorkList(); // Refresh the work list
      } else {
        throw new Error(resData.message || "Failed to save data");
      }
    } catch (err) {
      console.error("Error saving data:", err.message);
      alert(err.message);
    }
  };

  const updateData = async () => {
    try {
      const endpoint = `/api/work/${formData._id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (res.ok) {
        alert("Data berhasil diubah");
        clearForm();
        router.push(`/admin/work`); // Refresh the work list
      } else {
        throw new Error(resData.message || "Failed to update data");
      }
    } catch (err) {
      console.error("Error updating data:", err.message);
      alert(err.message);
    }
  };

  const editItem = async (id) => {
    try {
      const response = await fetch(`/api/work/${id}`);
      const resData = await response.json();

      if (!resData.data) {
        alert("Data not found!");
        return;
      }

      const workItem = resData.data;

      // Populate form with fetched data
      setFormData({
        _id: workItem._id,
        title: workItem.title,
        employmentType: workItem.employmentType,
        company: workItem.company,
        location: workItem.location,
        locationType: workItem.locationType,
        startDate: workItem.startDate,
        endDate: workItem.endDate,
      });
    } catch (err) {
      console.error("Error editing item:", err);
      alert("Failed to load item data");
    }
  };

  useEffect(() => {
    loadWorkList(); // Load data when the component mounts
  }, []);

  return (
    <>
      {loading && <p>Loading...</p>}
      <div className="flex justify-center">
        <div className="w-full max-w-screen-lg pt-36">
          <div className="bg-white p-5 rounded-xl">
            <h3 className="text-xl py-2">
              <b>Add Experience</b>
            </h3>
            <p className="text-red-400">*indicates required</p>
            <Card title="Work Form" className="mb-5">
              <div className="row mb-5">
                <label className="font-bold">Title *</label>
                <input
                  type="text"
                  name="title"
                  className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={formData.title}
                  onChange={inputHandler}
                  placeholder="Ex: Retail Sales Manager"
                />
              </div>
              <div className="row mb-5">
                <label className="font-bold">Employment Type</label>
                <select
                  name="employmentType"
                  onChange={inputHandler}
                  className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={formData.employmentType}
                >
                  <option value="">Please Select</option>
                  {optEmployeeType.map((item, key) => (
                    <option key={key} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row mb-5">
                <label className="font-bold">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={formData.company}
                  onChange={inputHandler}
                  placeholder="Ex: Microsoft"
                />
              </div>
              <div className="row mb-5">
                <label className="font-bold">Location</label>
                <input
                  type="text"
                  name="location"
                  className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={formData.location}
                  onChange={inputHandler}
                  placeholder="Ex: London, United Kingdom"
                />
              </div>
              <div className="row mb-5">
                <label className="font-bold">Location Type</label>
                <select
                  name="locationType"
                  onChange={inputHandler}
                  className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={formData.locationType}
                >
                  <option value="">Please Select</option>
                  {optLocation.map((item, key) => (
                    <option key={key} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row mb-5">
                <label className="font-bold">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={formData.startDate}
                  onChange={inputHandler}
                />
              </div>
              <div className="row mb-5">
                <label className="font-bold">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  className="bg-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  value={formData.endDate}
                  onChange={inputHandler}
                />
              </div>
              <div className="flex justify-end">
                {!formData._id ? (
                  <button
                    onClick={submitData}
                    className="mx-1 h-9 items-center justify-center px-4 rounded-md bg-amber-500"
                  >
                    <label>Submit Data</label>
                  </button>
                ) : (
                  <button
                    onClick={updateData}
                    className="mx-1 h-9 items-center justify-center px-4 rounded-md bg-blue-500"
                  >
                    <label>Update Data</label>
                  </button>
                )}
              </div>
            </Card>
            <Card title="List of Work">
              <WorkList workList={workList} onEditItem={editItem} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
