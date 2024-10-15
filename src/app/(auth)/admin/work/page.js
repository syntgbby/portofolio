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
    <div className="flex gap-2 bg-white dark:bg-black dark:text-white rounded-md m-2 p-2 text-sm">
      <div className="flex flex-row justify-between w-full">
        <div className="font-bold mr-2">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );

  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  async function onSubmitData() {
    const { name, email, subjek, message } = data;

    if (!name || !email || !subjek || !message) {
      alert("Please fill in all fields");
      return;
    }

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
      <div className="flex mt-28 justify-center">
        <div className="md:w-2/4 md:p-2 md:mb-0 mb-5">
          <div className="bg-rose-100 dark:bg-black dark:text-white p-5 mt-5 mb-5 rounded-xl">
            <h3 className="text-xl py-2 text-center">
              <b>Get In Touch</b>
            </h3>
            <p className="text-red-500 font-serif font-light text-center text-sm mb-5">
              Leave a message here and I will get back to you as soon as
              possible
            </p>

            <Card className="mb-5">
              <div className="flex flex-col md:flex-row md:space-x-4 mb-5">
                <div className="flex-1 md:mb-0 mb-5">
                  <label className="font-bold text-sm">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={inputHandler}
                    placeholder="Ex: Nama"
                    className="border-b-2 border-gray-300 focus:outline-none focus:border-rose-800 w-full placeholder:text-sm placeholder:font-normal placeholder:text-gray-400"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                </div>

                <div className="flex-1">
                  <label className="font-bold text-sm">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={data.email}
                    onChange={inputHandler}
                    placeholder="Ex: Email@gmail.com"
                    className="border-b-2 border-gray-300 focus:outline-none focus:border-rose-800 w-full placeholder:text-sm placeholder:font-normal placeholder:text-gray-400"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                </div>
              </div>

              <div className="row mb-5">
                <label className="font-bold text-sm">Subject</label>
                <input
                  name="subjek"
                  type="text"
                  onChange={inputHandler}
                  className="border-b-2 border-gray-300 focus:outline-none focus:borde100rose-500 w-full"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>

              <div className="row mb-2">
                <label className="font-bold text-sm">Message</label>
                <textarea
                  name="message"
                  onChange={inputHandler}
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-rose-500 w-full h-24 resize-none placeholder:text-sm placeholder:font-normal placeholder:text-gray-400"
                  placeholder="Write your message here..."
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={onSubmitData}
                  className="text-white font-semibold text-sm py-2 px-4 hover:bg-rose-400 focus:outline-none rounded-md bg-rose-600"
                >
                  Submit Data
                </button>
              </div>
            </Card>
          </div>
        </div>
        <div className="md:w-1/3">
          <Card>
            <div className="bg-rose-100 dark:bg-black dark:text-white justify-center p-5 rounded-xl py-10 mb-5">
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
    </>
  );
}
