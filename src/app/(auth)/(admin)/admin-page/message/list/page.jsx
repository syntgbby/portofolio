"use client";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export default function MessageList() {
  const [messageData, setMessageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMessageData() {
      try {
        const response = await fetch("/api/message");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setMessageData(data.data); // Assuming your response structure is { data: [...] }
      } catch (error) {
        console.error("Error fetching work data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessageData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        const response = await fetch(`/api/message?id=${id}`, {
          method: "DELETE",
        });

        toast.success("Data berhasil dihapus");
        setMessageData(messageData.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast.error("Error deleting entry");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-20 mt-20">
      <h2 className="text-xl font-bold mb-4 text-center dark:text-white">
        List Of Messages
      </h2>
      <Toaster />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-rose-200">
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Subjek</th>
              <th className="py-2 px-4 border-b">Message</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messageData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.email}</td>
                <td className="py-2 px-4 border-b">{item.subjek}</td>
                <td className="py-2 px-4 border-b text-center">
                  {item.message}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
