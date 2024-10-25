'use client'

import {getSavedProject} from "@/app/lib/appwrite";
import React, {useEffect, useState} from "react";
import Loading from "@/app/components/Loading";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import PhotoBookLayout from "@/app/layouts/PhotoBookLayout";
import PhotoBook from "@/app/components/PhotoBook";
import PhotoCanvas from "@/app/components/PhotoCanvas";

export default function Page({params}) {
    const {loading, setLoading} = useGlobalContext();
    const [project, setProject] = useState({});
    const {projectId} = params;

    async function getProject() {
        try {
            setLoading(true)
            const project = await getSavedProject(projectId);
            console.log(JSON.parse(project.content)[0].item)
            setProject(project);
        } catch (e) {
            setProject([]);
            console.error(e);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProject();
    }, []);

    if (loading) {
        return <Loading/>;
    }
    return (
        <PhotoBookLayout path={'my projects'}>
            {project.type === 'photobook'
                ? <PhotoBook content={JSON.parse(project.content)}/>
                : <PhotoCanvas item={JSON.parse(project.content)[0].item} />
            }

        </PhotoBookLayout>
    )
}