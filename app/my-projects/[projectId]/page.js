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
    const {selectedPhoto, setSelectedPhoto, canvasSize, setCanvasSize} = useCanvasOptionsContext()
    const [project, setProject] = useState({});
    const [item, setItem] = useState({});
    const [size, setSize] = useState({});
    const {projectId} = params;

    async function getProject() {
        try {
            setLoading(true)
            await getSavedProject(projectId).then((res) => {
                setProject(res);

                if (res.type === 'photo') {
                    setItem(JSON.parse(JSON.parse(res.content)[0].item));
                }

                if (JSON.parse(res.content).find((item) => item.key === 'canvas-size')) {
                    const resSize = JSON.parse(res.content).find((item) => item.key === 'canvas-size').item;
                    if (resSize) {
                        setSize(JSON.parse(resSize))
                    }
                }
            });
            await blobUrlToFile(item, 'newFile.jpeg');

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

        const file = new File([blob], fileName, {type: blob.type});
        setSelectedPhoto(file);
    }

    useEffect(() => {
        getProject();
    }, []);

    useEffect(() => {
        const newCanvasSize = {
            height: !isNaN(size.height) ? Math.round(size.height) : canvasSize.height,
            width: !isNaN(size.width) ? Math.round(size.width) : canvasSize.width
        };
        setCanvasSize(newCanvasSize)
    }, [size, project]);

    if (loading) {
        return <Loading/>;
    }
    return (
        <PhotoBookLayout path={'my projects'} projectId={projectId}>
            {project.type === 'photobook'
                ? <PhotoBook content={JSON.parse(project.content)} projectId={projectId} projectName={project.name}/>
                : <PhotoCanvas item={item} projectId={projectId} existingProjectName={project.name} canvasId={`photo`}/>
            }
        </PhotoBookLayout>
    )
}