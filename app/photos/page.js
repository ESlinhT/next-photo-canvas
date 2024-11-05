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
            <PhotoCanvas canvasId={`photo`} path="photos"/>
        </AuthLayout>
    )
}
