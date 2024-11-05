'use client'

import React from "react";
import PhotoCanvas from "@/app/components/PhotoCanvas";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import Loading from "@/app/components/Loading";
import {ArrowLongDownIcon, ArrowLongRightIcon} from "@heroicons/react/16/solid";
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";
import AuthLayout from "@/app/layouts/AuthLayout";

export default function Photos() {
    const {user, loading, setSaveProject} = useGlobalContext();
    const {canvasSize, dpi, primaryBorder} = useCanvasOptionsContext();

    if (loading) {
        return <Loading/>;
    }

    return (
        <AuthLayout path={'photos'} type="photo">
            <main className="py-2 mt-14">
                <div className="flex flex-col justify-center items-center">
                    <div className="my-1 p-2 relative">
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
        </AuthLayout>
    )
}
