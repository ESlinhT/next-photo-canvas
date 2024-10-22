'use client'

import React, {useState} from "react";
import Sidebar from "@/app/components/Sidebar";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import AuthCheck from "@/app/components/AuthCheck";
import UserMenu from "@/app/components/UserMenu";
import Loading from "@/app/components/Loading";
import PhotoBook from "@/app/components/PhotoBook";

export default function Images() {
    const {user, loading, setSaveProject} = useGlobalContext();

    if (loading) {
        return <Loading/>;
    }

    return (
        <>
            {!user ?
                <AuthCheck/>
                : <>
                    <Sidebar path="photobooks" />
                    <div className="lg:pl-56 bg-white w-full overflow-x-scroll">
                        <div
                            className="fixed w-full top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white shadow-sm pr-5 right-0">
                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                                <button onClick={() => setSaveProject(true)} className="flex items-center space-x-3 group absolute right-[41%] top-[30%]">
                                    <svg className="h-6 w-6 stroke-blue-500 group-hover:stroke-blue-400" fill="none"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M11 19H6.931A1.922 1.922 0 015 17.087V8h12.069C18.135 8 19 8.857 19 9.913V11"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M14 7.64L13.042 6c-.36-.616-1.053-1-1.806-1H7.057C5.921 5 5 5.86 5 6.92V11M17 15v4M19 17h-4"></path>
                                    </svg>
                                    <h3 className="text-slate-900 group-hover:text-blue-400 text-xs font-semibold">Save
                                        project (WIP)</h3>
                                </button>
                                <div className="flex items-center">
                                    <UserMenu/>
                                </div>
                            </div>
                        </div>

                        <main className="py-2 mt-14">
                            <div className="flex m-2 justify-center">
                                <PhotoBook />
                            </div>
                        </main>
                    </div>
                </>
            }
        </>
    )
}
