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
            <main className="py-2">
                <div className="flex flex-col justify-center items-center">
                    <div className="mb-1 p-2 relative">
                        <PhotoCanvas canvasId={`photo`} path="photos"/>
                    </div>
                </div>
            </main>
        </AuthLayout>
    )
}
