'use client'

import React, {useEffect, useState} from "react";
import Sidebar from "@/app/components/Sidebar";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import AuthCheck from "@/app/components/AuthCheck";
import UserMenu from "@/app/components/UserMenu";
import Loading from "@/app/components/Loading";
import {Dialog, DialogBackdrop, DialogPanel, TransitionChild} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/16/solid";

export default function AuthLayout({children, path = 'Next Photo Canvas', projectId = null, type = 'photobook'}) {
    const {user, loading, setSaveProject} = useGlobalContext();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [images, setImages] = useState([]);

    if (loading) {
        return <Loading/>;
    }
    return (
        <>
            {!user ? (
                <AuthCheck/>
            ) : (
                <>
                    <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-20 lg:hidden">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                        />

                        <div className="fixed inset-0 flex">
                            <DialogPanel
                                transition
                                className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                            >
                                <TransitionChild>
                                    <div
                                        className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                        <button type="button" onClick={() => setSidebarOpen(false)}
                                                className="-m-2.5 p-2.5">
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white"/>
                                        </button>
                                    </div>
                                </TransitionChild>
                                <Sidebar path={path} isHidden={sidebarOpen} type={type} images={images} setImages={setImages}/>
                            </DialogPanel>
                        </div>
                    </Dialog>
                    <Sidebar path={path} type={type} images={images} setImages={setImages}/>
                    <div className="lg:pl-56">
                        <div
                            className="sticky top-0 z-20 w-full flex justify-between lg:justify-end h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
                            <button type="button" onClick={() => setSidebarOpen(true)}
                                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon aria-hidden="true" className="h-6 w-6"/>
                            </button>
                            <div className="flex items-center justify-end">
                                <button onClick={() => setSaveProject(true)}
                                        className="flex items-center space-x-2 group pb-1">
                                    <svg className="h-6 w-6 stroke-blue-500 group-hover:stroke-blue-400" fill="none"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M11 19H6.931A1.922 1.922 0 015 17.087V8h12.069C18.135 8 19 8.857 19 9.913V11"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M14 7.64L13.042 6c-.36-.616-1.053-1-1.806-1H7.057C5.921 5 5 5.86 5 6.92V11M17 15v4M19 17h-4"></path>
                                    </svg>
                                    <h3 className="text-gray-800 group-hover:text-blue-400 text-sm font-bold">{projectId ? 'Update' : 'Save'}</h3>
                                </button>

                                <div aria-hidden="true" className="h-6 w-px mx-2 bg-gray-900/10"/>

                                <div className="flex gap-x-4 lg:gap-x-6">
                                    <div className="flex items-center">
                                        <UserMenu/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`${images.length ? 'flex' : 'hidden'} lg:hidden sticky top-0 z-20 w-full overflow-x-scroll justify-between h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm`}>
                            {images.map((image, key) => (
                                <img
                                    key={key}
                                    src={image}
                                    alt={`img-${key}`}
                                    className="cursor-pointer h-[60px] w-[80px] border"
                                    draggable={true}
                                    onDragStart={(e) => e.dataTransfer.setData('imageUrl', image)}
                                />
                            ))}
                        </div>

                        <main className="py-2 mt-14">
                            <div className="flex m-2 justify-center">
                                {children}
                            </div>
                        </main>
                    </div>
                </>
            )}
        </>
    );
}
