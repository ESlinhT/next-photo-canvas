'use client'

import React, {useState} from "react";
import Sidebar from "@/app/components/Sidebar";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import AuthCheck from "@/app/components/AuthCheck";
import UserMenu from "@/app/components/UserMenu";
import Loading from "@/app/components/Loading";
import PhotoBook from "@/app/components/PhotoBook";
import AuthLayout from "@/app/layouts/AuthLayout";

export default function Photobooks() {
    const {loading} = useGlobalContext();

    if (loading) {
        return <Loading/>;
    }
    return (
        <AuthLayout path={'photobooks'}>
            <PhotoBook/>
        </AuthLayout>
    )
}
