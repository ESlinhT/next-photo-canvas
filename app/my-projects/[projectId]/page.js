'use client'

import {getSavedProject} from "@/app/lib/appwrite";
import React, {useEffect, useState} from "react";
import Loading from "@/app/components/Loading";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import AuthLayout from "@/app/layouts/AuthLayout";
import PhotoBook from "@/app/components/PhotoBook";
import PhotoCanvas from "@/app/components/PhotoCanvas";
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";

export default function Page({params}) {
    const {loading, setLoading} = useGlobalContext();
    const {setSelectedPhoto, canvasSize, setCanvasSize, setItemsToSave, setLastOffset, setViewport, setPrimaryBorder, setSecondaryBorder} = useCanvasOptionsContext()
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
                    const photo = JSON.parse(res.content).find((obj) => obj.canvasId === 'photo');
                    setSelectedPhoto(photo.objects[0].src)
                    setItem(photo.objects[0]);

                    if (keyExists(res.content, 'lastOffset')) {
                        const lastOffset = keyExists(res.content, 'lastOffset').lastOffset;
                        setLastOffset(lastOffset)
                    }
                    if (keyExists(res.content, 'viewport')) {
                        const viewport = keyExists(res.content, 'viewport').viewport;
                        setViewport(viewport)
                    }
                    if (keyExists(res.content, 'border')) {
                        const border = keyExists(res.content, 'border').border;
                        setPrimaryBorder(border.primaryBorder);
                        setSecondaryBorder(border.secondaryBorder);
                    }
                }

                if (JSON.parse(res.content).length) {
                    setItemsToSave(JSON.parse(res.content))
                }
                if (JSON.parse(res.content).find((item) => item.canvasId === 'canvasSize')) {
                    const resSize = JSON.parse(res.content).find((item) => item.canvasId === 'canvasSize').size;
                    if (resSize) {
                        setSize(resSize)
                    }
                }
            });

        } catch (e) {
            setProject([]);
            console.error(e);
        } finally {
            setLoading(false)
        }
    }

    const keyExists = (content, key) => {
        return JSON.parse(content).find((item) => item.canvasId === key)
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
        <AuthLayout path={'my projects'} projectId={projectId} type={project.type}>
            {project.type === 'photobook'
                ? <PhotoBook content={JSON.parse(project.content)} projectId={projectId} projectName={project.name}/>
                : <PhotoCanvas item={item} projectId={projectId} existingProjectName={project.name} canvasId={`photo`}/>
            }
        </AuthLayout>
    )
}