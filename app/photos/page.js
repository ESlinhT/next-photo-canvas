'use client'

import React from "react";
import PhotoCanvas from "@/app/components/PhotoCanvas";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import Loading from "@/app/components/Loading";
import AuthLayout from "@/app/layouts/AuthLayout";

export default function Photos() {
    const {loading} = useGlobalContext();

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
