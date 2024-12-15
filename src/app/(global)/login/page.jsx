"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ConfigDialog from "@/components/ConfirmDialog";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  // const [modal, setModal] = useState(false);
  // const [modalTitle, setModalTitle] = useState("");
  // const [modalMessage, setModalMessage] = useState("");

  // State untuk data form dan error message
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  // const [error, setError] = useState("");

  // Handler untuk mengatasi perubahan input
  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handler untuk tombol "Back"
  const onBack = () => {
    router.push("/");
  };

  // const clearForm = () => {
  //   setData({
  //     title: "",
  //     subTitle: "",
  //     content: "",
  //     id: "",
  //   });
  // };

  // const onCancel = () => {
  //   setModal(false);
  //   setModalTitle("");
  //   setModalMessage("");
  //   clearForm(); // Clear form data on cancel
  // };

  // Handler untuk tombol "Sign Up"
  const onSignUp = () => {
    router.push("/register");
  };

  // Handler untuk form submit
  const onSubmitLogin = async (e) => {
    e.preventDefault(); // Prevent page reload on submit

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.status === 200) {
        const responseData = await res.json();

        // Assuming the response contains the user_type
        const userType = responseData.user_type;

        // Conditional routing based on user_type
        if (userType === "ADM") {
          router.push("/admin");
        } else if (userType === "MBR") {
          router.push("/public");
        }
        // else {
        //   setModal(true);
        //   setModalTitle("Error");
        //   setModalMessage("Unexpected user type");
        // }
      } else {
        const response = await res.json();
        // Handle error response
        // setError(response.message || "Login failed, please try again.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      // setModal(true);
      // setModalTitle("Error");
      // setModalMessage(err.message);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src="/logo.png"
            width={90}
            height={90}
            className="mx-auto"
          />
          <h2 className="mt-8 text-center text-xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={inputHandler}
                  required
                  autoComplete="email"
                  className="dark:bg-white dark:text-black pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-rose-500 hover:text-rose-400"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={inputHandler}
                  required
                  autoComplete="current-password"
                  className="dark:bg-white dark:text-black pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Menampilkan pesan error jika login gagal */}
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

            <div>
              <button
                type="submit"
                onClick={onSubmitLogin}
                className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Dont have an account?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-rose-600 hover:text-rose-500"
              onClick={onSignUp}
            >
              Sign Up
            </a>
          </p>

          <div className="mt-3">
            <Button
              className="mt-3 px-6 py-1 dark:bg-rose-400 dark:hover:bg-rose-500"
              onClick={onBack}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
      {/* <ConfigDialog
        onOkOnly={onCancel}
        showDialog={modal}
        title={modalTitle}
        message={modalMessage}
        onCancel={onCancel}
        onOk={onCancel}
        isOkOnly={true}
      /> */}
    </>
  );
}
