"use client"
import { useRouter } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'
import { signup } from './actions/auth'

export default function Register(){
    const [state, action] = useFormState(signup, undefined);
    const router = useRouter();

    const onSubmitLogin=()=>{
        router.push('/admin')
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
                Sign up your account
            </h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="" method="POST" className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    {state?.errors?.name && <p className="text-red-500">{state.errors.name}</p>}
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
                            required
                            autoComplete="email"
                            className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    {state?.errors?.email && <p className="text-red-500">{state.errors.email}</p>}
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                        </label>
                        <div className="text-sm">
                            <a href="#" className="font-semibold text-rose-600 hover:text-rose-400">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    {state?.errors?.password && <p className="text-red-500">{state.errors.password}</p>}
                </div>

                {state?.errors?.password && (
                    <div>
                        <p>Password must:</p>
                        <ul>
                            {state.errors.password.map((error) => (
                                <li key={error}>- {error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            
                <div>
                    <button
                        type="button"
                        onClick={onSubmitLogin}
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
            </div> 
        </div>
        </>
    );
}