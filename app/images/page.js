'use client'

import PhotoCanvas from "../components/PhotoCanvas";
import ImageSidebar from "@/app/components/ImageSidebar";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import {signOut} from "@/app/lib/appwrite";
import {useRouter} from "next/navigation";
import Link from "next/link";
import React from "react";
import BlueBackground from "@/app/components/BlueBackground";


const userNavigation = [{name: 'Your profile', href: '#'}, {name: 'Sign out', href: '#'},]


export default function Images() {
    const {user, loading} = useGlobalContext();
    const router = useRouter()

    const handleItemClick = (item) => {
        if (item.name === 'Sign out') {
            return (
                <MenuItem key={item.name}>
                    <button
                        onClick={() => {
                            signOut().then(r => router.push('/login'))
                        }}
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                    >
                        {item.name}
                    </button>
                </MenuItem>
            )
        }
        return (
            <MenuItem key={item.name}>
                <a
                    href={item.href}
                    className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                >
                    {item.name}
                </a>
            </MenuItem>
        )
    }

    if (loading) {
        return <div>Loading...</div>; // Or show a loading spinner
    }

    return (
        <>
            {!user ?
                <BlueBackground>
                    <div className="h-[100vh] flex flex-col justify-center items-center">
                        <h2 className="text-3xl font-bold text-gray-200">Please login to use this feature</h2>
                        <div className="mt-10 ">
                            <Link href={'/login'}
                                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:indigo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </BlueBackground> : <>
                    <ImageSidebar/>
                    <div className="lg:pl-72 bg-white">
                        <div
                            className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">

                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                                <div className="flex items-center gap-x-4 lg:gap-x-6">

                                    <Menu as="div" className="relative">
                                        <MenuButton className="-m-1.5 flex items-center p-1.5">
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                alt=""
                                                src={user?.avatar}
                                                className="h-8 w-8 rounded-full bg-gray-50"
                                            />
                                            <span className="hidden lg:flex lg:items-center">
                                                  <span aria-hidden="true"
                                                        className="ml-4 text-sm font-semibold leading-6 text-gray-900 capitalize">
                                                    {user?.username}
                                                  </span>
                                                  <ChevronDownIcon aria-hidden="true"
                                                                   className="ml-2 h-5 w-5 text-gray-400"/>
                                                </span>
                                        </MenuButton>
                                        <MenuItems
                                            transition
                                            className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                        >
                                            {userNavigation.map((item) => handleItemClick(item))}
                                        </MenuItems>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <main className="py-10">
                            <div className="flex m-5 justify-center">
                                <PhotoCanvas/>
                            </div>
                        </main>
                    </div>
                </>}
        </>
    )
}
