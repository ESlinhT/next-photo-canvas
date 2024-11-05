'use client'

import React, {useState} from 'react';
import {createUser} from '../lib/appwrite';
import {useRouter} from "next/navigation";
import Link from "next/link";
import BlueBackgroundLayout from "@/app/layouts/BlueBackgroundLayout";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter()

    const signUp = async () => {
        try {
            await createUser(email, password, username);
            router.push("/")
        } catch (e) {
            alert('Error: ' + e.message);
        }
    }

    return (
        <BlueBackgroundLayout>
            <div className="flex h-[100vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8 pb-32 lg:pb-0">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-200">Next
                        Photo
                        Canvas</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email"
                                   className="block text-sm font-medium leading-6 text-gray-200">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="block text-sm font-medium leading-6 text-gray-200">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="block text-sm font-medium leading-6 text-gray-200">
                                    Username
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={async () => {
                                    await signUp(email, password, username);
                                }}
                                type="button"
                                className="flex w-full justify-center  bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already a member?{' '}
                        <Link href={'/login'}
                              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </BlueBackgroundLayout>
    );
};

export default Signup;
