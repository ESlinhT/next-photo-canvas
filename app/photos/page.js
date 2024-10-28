'use client'

import React from "react";
import PhotoCanvas from "@/app/components/PhotoCanvas";
import Sidebar from "@/app/components/Sidebar";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import AuthCheck from "@/app/components/AuthCheck";
import UserMenu from "@/app/components/UserMenu";
import Loading from "@/app/components/Loading";
import {ArrowLongDownIcon, ArrowLongRightIcon} from "@heroicons/react/16/solid";
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";

export default function Photos() {
    const {user, loading, setSaveProject} = useGlobalContext();
    const {canvasSize, dpi, primaryBorder} = useCanvasOptionsContext();

    if (loading) {
        return <Loading/>;
    }

    return (
        <>
            {!user ?
                <AuthCheck/>
                : <div className="flex w-full">
                    <Sidebar path="photos"/>
                    <div className="w-full bg-white">
                        <div
                            className="fixed w-full top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white shadow-sm pr-5 right-0">
                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                                <button onClick={() => setSaveProject(true)}
                                        className="flex items-center space-x-2 px-1 group absolute left-[15rem] bottom-5">
                                    <svg className="h-6 w-6 stroke-blue-500 group-hover:stroke-blue-400" fill="none"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M11 19H6.931A1.922 1.922 0 015 17.087V8h12.069C18.135 8 19 8.857 19 9.913V11"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M14 7.64L13.042 6c-.36-.616-1.053-1-1.806-1H7.057C5.921 5 5 5.86 5 6.92V11M17 15v4M19 17h-4"></path>
                                    </svg>
                                    <h3 className="text-black group-hover:text-blue-400 text-sm font-semibold">Save</h3>
                                </button>
                                <div className="flex items-center">
                                    <UserMenu/>
                                </div>
                            </div>
                        </div>

                        <main className="py-2 mt-14">
                            <div className="ml-[14rem] flex flex-col justify-center items-center">
                                <div className="my-1 p-2 relative w-fit">
                                    <div
                                        className={`vertical-text absolute ${JSON.stringify(primaryBorder).includes('#') ? '-left-12 bottom-0' : '-left-8 bottom-8'} flex justify-center items-center`}>
                                        <p className="text-gray-500 text-sm">{canvasSize.height / dpi} in </p>
                                        <ArrowLongDownIcon
                                            aria-hidden="true" className="h-[30px] w-10 text-gray-400"/>
                                    </div>
                                    <PhotoCanvas canvasId={`photo`} path="photos"/>
                                    <div
                                        className={`absolute ${JSON.stringify(primaryBorder).includes('#') ? '-left-1 -bottom-[45px]' : 'left-3 -bottom-3'} left-3 -bottom-3 flex justify-center items-center`}>
                                        <p className="text-gray-500 text-sm">{canvasSize.width / dpi} in </p>
                                        <ArrowLongRightIcon
                                            aria-hidden="true" className="h-[30px] w-8 text-gray-400"/>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            }
        </>
    )
}
