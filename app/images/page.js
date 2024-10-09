'use client'

import React, {useState} from "react";
import PhotoCanvas from "../components/PhotoCanvas";
import ImageSidebar from "@/app/components/ImageSidebar";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import BlueBackground from "@/app/components/BlueBackground";
import AuthCheck from "@/app/components/AuthCheck";
import UserMenu from "@/app/components/UserMenu";
import Loading from "@/app/components/Loading";

export default function Images() {
    const {user, loading} = useGlobalContext();
    const dpi = 96;
    const [canvasSize, setCanvasSize] = useState({
        height: 7 * dpi,
        width: 5 * dpi,
    });

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {!user ?
                <BlueBackground>
                    <AuthCheck />
                </BlueBackground> : <>
                    <ImageSidebar dpi={dpi} canvasSize={canvasSize} setCanvasSize={setCanvasSize}/>
                    <div className="lg:pl-72 bg-white">
                        <div
                            className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">

                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                                <div className="flex items-center gap-x-4 lg:gap-x-6">
                                    <UserMenu />
                                </div>
                            </div>
                        </div>

                        <main className="py-10">
                            <div className="flex m-5 justify-center">
                                <PhotoCanvas canvasSize={canvasSize}/>
                            </div>
                        </main>
                    </div>
                </>}
        </>
    )
}
