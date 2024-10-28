'use client'

import {getSavedProject} from "@/app/lib/appwrite";
import React, {useEffect, useState} from "react";
import Loading from "@/app/components/Loading";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import PhotoBookLayout from "@/app/layouts/PhotoBookLayout";
import PhotoBook from "@/app/components/PhotoBook";
import PhotoCanvas from "@/app/components/PhotoCanvas";
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";

export default function Page({params}) {
    const {loading, setLoading} = useGlobalContext();
    const {setSelectedPhoto} = useCanvasOptionsContext()
    const [project, setProject] = useState({});
    const [item, setItem] = useState({});
    const {projectId} = params;

    async function getProject() {
        try {
            setLoading(true)
            await getSavedProject(projectId).then((res) => {
                setProject(res);
                setItem(JSON.parse(JSON.parse(res.content)[0].item));
            });
            await blobUrlToFile(item.photoUrl, 'newFile.jpeg');

        } catch (e) {
            setProject([]);
            console.error(e);
        } finally {
            setLoading(false)
        }
    }
    async function blobUrlToFile(blobUrl, fileName) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();

        const file = new File([blob], fileName, { type: blob.type });
        setSelectedPhoto(file);
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
                : <PhotoCanvas item={item} />
            }

        </PhotoBookLayout>
    )
}