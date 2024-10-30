"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Ensure this is the correct import path
import ConfirmRegisterDialog from '@/components/ConfirmRegisterDialog'; // Update the path as needed

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic validation for password length
        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            setIsOpen(true);
            return;
        }

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            router.push('/login');
        } else {
            setError(data.error || "User already exists.");
            setIsOpen(true);
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="/logo.png"
                        width={90}
                        height={90}
                        className="mx-auto"
                    />
                    <h2 className="mt-8 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign up for your account
                    </h2>
                </div>

                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    onChange={onHandleChange}
                                    required
                                    autoComplete="name"
                                    className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={onHandleChange}
                                    required
                                    autoComplete="email"
                                    className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={onHandleChange}
                                    required
                                    autoComplete="current-password"
                                    className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <a href="/login" className="font-semibold leading-6 text-rose-600 hover:text-rose-400">
                            Sign in
                        </a>
                    </p>

                    <div className="mt-3">
                        <Button className="mt-3 px-6 py-1 dark:bg-rose-400 dark:hover:bg-rose-500" onClick={() => router.push('/')}>
                            Back
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmRegisterDialog
            showDialog={isOpen}
            onOk={() => setIsOpen(false)} // This function closes the dialog
            onCancel={() => setIsOpen(false)} // This function also closes the dialog
            title="Error"
            message={error}
            />
        </>
    );
}
