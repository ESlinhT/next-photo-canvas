'use client'

import React from "react";
import PhotoCanvas from "../components/PhotoCanvas";
import Sidebar from "@/app/components/Sidebar";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import AuthCheck from "@/app/components/AuthCheck";
import UserMenu from "@/app/components/UserMenu";
import Loading from "@/app/components/Loading";

export default function Images() {
    const {user, loading} = useGlobalContext();

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
                            <div className="flex ml-[250px] justify-center ">
                                <PhotoCanvas path="photos" />
                            </div>
                        </main>
                    </div>
                </div>
            }
        </>
    )
}
