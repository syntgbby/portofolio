"use client";
import { useState, useEffect } from "react";
import Card from "../../../../components/card";

export default function AdminWork() {
  const [data, setData] = useState({
    name: "",
    email: "",
    subjek: "",
    message: "",
  });

  const [dataContact, setDataContact] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    onLoadData();
  }, []);

  async function onLoadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Network response was not ok");
      const contactData = await res.json();
      setDataContact(contactData);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  }

  const ItemCard = ({ label, value }) => (
    <div className="flex gap-4 bg-white rounded-md m-2 p-2">
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );

  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  async function onSubmitData() {
    const { name, email, subjek, message } = data;

    try {
      const res = await fetch("/api/work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!resData.data) {
        throw new Error(resData.message);
      }

      alert("Data berhasil disimpan dengan id \n" + resData.data.insertedId);
    } catch (err) {
      console.error("ERR", err.message);
      alert(err.message);
    }
  }

  return (
    <>
      <div className="flex mt-20 justify-center">
        <div className="md:w-2/4">
          <div className="bg-rose-50 dark:bg-black dark:text-white p-5 mt-5 mb-5 rounded-xl">
            <h3 className="text-xl py-2 text-center">
              <b>Get In Touch</b>
            </h3>
            <p className="text-red-400">Leave a message</p>

            <Card title="Work Form" className="mb-5">
              <div className="flex flex-col md:flex-row md:space-x-4 mb-5">
                <div className="flex-1">
                  <label className="font-bold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={inputHandler}
                    placeholder="Ex: Nama"
                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-800 w-full"
                  />
                </div>

                <div className="flex-1">
                  <label className="font-bold">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={data.email}
                    onChange={inputHandler}
                    placeholder="Ex: Email@gmail.com"
                    className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-800 w-full"
                  />
                </div>
              </div>

              <div className="row mb-5">
                <label className="font-bold">Subject</label>
                <input
                  name="subjek"
                  type="text"
                  onChange={inputHandler}
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>

              <div className="row mb-5">
                <label className="font-bold">Message</label>
                <textarea
                  name="message"
                  onChange={inputHandler}
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full h-24 resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                onClick={onSubmitData}
                className="text-white font-bold py-2 px-4 hover:bg-rose-400 focus:outline-none justify-center rounded-md bg-rose-600"
              >
                Submit Data
              </button>
            </Card>
          </div>
        </div>
        <div className="md:w-1/3">
          <div>
            <Card>
              <div className="bg-rose-50 dark:bg-black dark:text-white justify-center p-10">
                {!isLoading && dataContact ? (
                  <>
                    {dataContact.location &&
                      Object.entries(dataContact.location).length > 0 && (
                        <>
                          {Object.entries(dataContact.location).map(
                            ([key, value]) => (
                              <ItemCard label={key} value={value} key={key} />
                            )
                          )}
                        </>
                      )}
                    {dataContact.phone &&
                      Object.entries(dataContact.phone).length > 0 && (
                        <>
                          {Object.entries(dataContact.phone).map(
                            ([key, value]) => (
                              <ItemCard label={key} value={value} key={key} />
                            )
                          )}
                        </>
                      )}
                    {dataContact.social &&
                      Object.entries(dataContact.social).length > 0 && (
                        <>
                          {Object.entries(dataContact.social).map(
                            ([key, value]) => (
                              <ItemCard label={key} value={value} key={key} />
                            )
                          )}
                        </>
                      )}
                  </>
                ) : (
                  <p>Loading...</p> // Optional loading state
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
