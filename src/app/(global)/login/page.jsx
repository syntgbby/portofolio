"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export default function Login(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onBack = ()=>{
        router.push('/')
    }

    const onSignUp = ()=>{
        router.push('/register')
    }

    const handleLogin = async (e)=>{
        e.preventDefault();

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if(response.ok){
            router.push('/admin');
        }else{
            console.error('Login error: ', data.message);
        }
    }

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
                Sign in to your account
            </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleLogin} method="POST" className="space-y-6">
                <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                </label>
                <div className="mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="dark:bg-dark dark:text-white pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink sm:text-sm sm:leading-6"
                    />
                </div>
                </div>

                <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                    </label>
                    <div className="text-sm">
                    <a href="#" className="font-semibold hover:text-rose-500">
                        Forgot password?
                    </a>
                    </div>
                </div>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="dark:bg-dark dark:text-white pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink sm:text-sm sm:leading-6"
                    />
                </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                    >
                        Sign in
                    </button>
                </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <a href="#" className="font-semibold leading-6 text-rose-600 hover:text-rose-500" onClick={onSignUp}>
                Sign Up
                </a>
            </p>

                <div className="mt-3">
                    <Button className="mt-3 px-6 py-1 dark:bg-rose-400 dark:hover:bg-rose-500" onClick={onBack}>
                        Back
                    </Button>
                </div>
            </div>
        </div>
        </>
    );
}