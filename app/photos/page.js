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

export default function Images() {
    const {user, loading} = useGlobalContext();
    const {canvasSize, dpi, primaryBorder} = useCanvasOptionsContext();

    if (loading) {
        return <Loading/>;
    }

    return (
        <>
            {!user ?
                <AuthCheck/>
                : <div className="flex w-full">
                    <Sidebar path="photos" />
                    <div className="w-full bg-white">
                        <div
                            className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                                <div className="flex items-center">
                                    <UserMenu/>
                                </div>
                            </div>
                        </div>

                        <main className="py-2">
                            <div className="ml-[14rem] flex flex-col justify-center items-center">
                                <div className="my-1 p-2 relative w-fit">
                                    <div
                                        className={`vertical-text absolute ${JSON.stringify(primaryBorder).includes('#') ? '-left-12 bottom-0' : '-left-8 bottom-8'} flex justify-center items-center`}>
                                        <p className="text-gray-500 text-sm">{canvasSize.height / dpi} in </p>
                                        <ArrowLongDownIcon
                                            aria-hidden="true" className="h-[30px] w-10 text-gray-400"/>
                                    </div>
                                    <PhotoCanvas path="photos"/>
                                    <div className={`absolute ${JSON.stringify(primaryBorder).includes('#') ? '-left-1 -bottom-[45px]' : 'left-3 -bottom-3'} left-3 -bottom-3 flex justify-center items-center`}>
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
