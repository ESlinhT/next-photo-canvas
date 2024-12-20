import React, {useEffect, useRef, useState} from 'react';
import {
    addText,
    displayBookCoverText,
    initializeCanvas,
    setupDragAndDrop,
    toggleBookCoverColor
} from './CanvasControls';
import {applyCrop, deleteImage, enableCrop, flipImage, resizeCanvas, rotateCanvas,} from '../utils/ImageUtils';
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";
import ReusableDialog from "@/app/components/ReusableDialog";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import {createSavedProject, updateSavedProject} from "@/app/lib/appwrite";
import {useRouter} from "next/navigation";
import {ArrowLongDownIcon, ArrowLongRightIcon} from "@heroicons/react/16/solid";

export default function PhotoCanvas({
                                        item = null,
                                        path = "photos",
                                        disableHalf = false,
                                        canvasId,
                                        projectId = null,
                                        existingProjectName = ''
                                    }) {
    const {
        primaryBorder,
        secondaryBorder,
        canvasSize,
        setCanvasSize,
        selectedPhoto,
        setSelectedPhoto,
        bookCoverColors,
        addCanvas,
        itemsToSave,
        lastOffset,
        setLastOffset,
        viewport,
        setViewport,
        dpi
    } = useCanvasOptionsContext();
    const {saveProject, setSaveProject, user} = useGlobalContext();
    const canvasRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [croppedObject, setCroppedObject] = useState(null);
    const [guidelines, setGuidelines] = useState([]);
    const [open, setOpen] = useState(false);
    const [openBookCoverText, setOpenBookCoverText] = useState(false);
    const [selectedBookCoverColor, setSelectedBookCoverColor] = useState({})
    const [bookCoverText, setBookCoverText] = useState('');
    const [projectName, setProjectName] = useState(existingProjectName);
    const [updatedItem, setUpdatedItem] = useState(item);
    const [isSaving, setIsSaving] = useState(false);
    const [itemDeleted, setItemDeleted] = useState(false);
    const router = useRouter();

    const [croppedDimensions, setCroppedDimensions] = useState({
        height: 0,
        width: 0,
        top: 0,
        left: 0,
    });

    useEffect(() => {
        let passedInItem = path !== 'photos' ? item : updatedItem;
        if (passedInItem === '[]') {
            passedInItem = '';
        }
        const canvas = initializeCanvas(passedInItem, canvasRef, setCanvas, canvasSize, guidelines, setGuidelines, selectedPhoto, path, disableHalf, primaryBorder, secondaryBorder, canvasId, addCanvas, projectId, itemDeleted, lastOffset, setLastOffset, viewport, setViewport);
        const cleanupDragAndDrop = setupDragAndDrop(canvasRef, canvas, disableHalf);

        if (path !== 'photos') {
            resizeCanvas(canvas, path, canvasSize)
        }

        if (croppedObject) {
            croppedObject.on('modified', () => {
                const {top, left, width, height} = croppedObject.getBoundingRect();
                setCroppedDimensions({top, left, width, height});
            });
        }

        return () => {
            cleanupDragAndDrop();
            canvas.dispose();
        };
    }, [item, updatedItem, selectedPhoto, path, primaryBorder, secondaryBorder, croppedObject, guidelines, canvasSize, disableHalf, itemDeleted]);

    useEffect(() => {
        const handleResize = () => {
            resizeCanvas(canvas, path, canvasSize);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [canvas]);

    const handleConfirmSave = async () => {
        let newRoute;
        if (user) {
            try {
                setIsSaving(true);
                const filtered = [...itemsToSave].filter((item) => item.canvasId !== 'canvasSize' && item.canvasId !== 'lastOffset' && item.canvasId !== 'viewport' && item.canvasId !== 'border');
                filtered.push({
                    canvasId: 'canvasSize',
                    size: canvasSize
                });
                if (path === 'photos') {
                    filtered.push({
                        canvasId: 'lastOffset',
                        lastOffset
                    });
                    filtered.push({
                        canvasId: 'viewport',
                        viewport
                    });
                    filtered.push({
                        canvasId: 'border',
                        border: {
                            primaryBorder,
                            secondaryBorder
                        }
                    })
                }

                if (projectId) {
                    await updateSavedProject(projectId, projectName, JSON.stringify(filtered))
                } else {
                    newRoute = await createSavedProject(projectName, JSON.stringify(filtered), path === 'photos' ? 'photo' : 'photobook');
                }

                canvas.renderAll()
                setSaveProject(!saveProject)
                setIsSaving(false)
                projectId ? router.refresh() : router.replace(`/my-projects/${newRoute.$id}`);
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleRemoveObject = (selectedObject, setSelectedObject) => {
        try {
            deleteImage(canvas, setSelectedObject);
            setCanvas(canvas)
        } catch (e) {
            console.error(e)
        } finally {
            setUpdatedItem('')
            setItemDeleted(true)
        }
    }

    const handleAddToCart = () => {
        // const book = {
        //     name: projectName,
        //     content: getCanvasItemsFromLocalStorage()
        // }
        // const cart = localStorage.getItem('cart')
        //     ? JSON.parse(localStorage.getItem('cart'))
        //     : [];
        //
        // cart.push(book);

        // localStorage.setItem('cart', JSON.stringify(cart));
    }

    const getCanvasItemsFromLocalStorage = () => {
        const canvasItems = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key.includes('canvas') && path !== 'photos') {
                const item = localStorage.getItem(key);
                canvasItems.push({key, item});
            }
            if (path === 'photos' && key === 'photo') {
                const item = localStorage.getItem(key);
                canvasItems.push({key, item});
            }
            if (key === 'canvas-size') {
                const item = localStorage.getItem(key);
                canvasItems.push({key, item});
            }
        }

        return canvasItems;
    }

    const handleBookCoverBackgroundColorSelect = (color) => {
        if (color === selectedBookCoverColor) {
            setSelectedBookCoverColor({});
        } else {
            setSelectedBookCoverColor(color)
        }
        toggleBookCoverColor(canvas, color);
    }

    const handleBookCoverTextConfirm = () => {
        displayBookCoverText(canvas, bookCoverText);
        const json = canvas?.toJSON();
        addCanvas(json, canvasId)
        setOpenBookCoverText(false)
    }

    return (
        <div className="relative">
            <div className="flex flex-col items-center">
                {path === 'photobooks' && <>
                    <div className="flex my-5">
                        <button onClick={() => addText(canvas)}
                                className="px-2 py-2 bg-blue-500 text-white disabled:opacity-20 text-center w-[4rem] xl:w-[10rem]">
                            Add Text
                        </button>
                        <button onClick={() => flipImage('horizontal', canvas)} disabled={!canvas?.getActiveObject()}
                                className="flex justify-center px-2 py-2 bg-blue-900 text-white ml-2 disabled:opacity-20 text-center w-[4rem] xl:w-[10rem]">
                            <p className="mr-2">Flip</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                        </button>
                        <button onClick={() => flipImage('vertical', canvas)} disabled={!canvas?.getActiveObject()}
                                className="flex justify-center px-2 py-2 bg-blue-500 text-white ml-2 disabled:opacity-20 text-center w-[4rem] xl:w-[10rem]">
                            <p className="mr-2">Flip</p>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6 rotate-90">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => enableCrop(selectedImage, isCropping, setIsCropping, canvas, croppedObject, setCroppedObject)}
                            disabled={!canvas?.getActiveObject()}
                            className="px-2 py-2 bg-green-800 text-white ml-2 disabled:opacity-20 text-center w-[4rem] xl:w-[10rem]">
                            Crop Image
                        </button>
                        <button
                            onClick={() => applyCrop(croppedObject, selectedImage, croppedDimensions, canvas, setCroppedObject, setIsCropping)}
                            disabled={!canvas?.getActiveObject()}
                            className="px-2 py-2 bg-green-500 text-white ml-2 disabled:opacity-20 text-center w-[4rem] xl:w-[10rem]">
                            Apply Crop
                        </button>
                        <button onClick={() => handleRemoveObject(selectedImage, setSelectedImage)}
                                className={`px-2 py-2 bg-red-500 text-white disabled:opacity-20 w-[4rem] xl:w-[10rem] text-sm xl:text-lg text-center ml-2 ${canvas?.getActiveObject() ? 'block' : 'hidden'}`}>
                            Remove
                        </button>
                    </div>
                </>
                }
                {path === 'photos' && <>
                    <div className="flex mb-10">
                        {/*<button onClick={() => addText(canvas)}*/}
                        {/*        className="px-2 py-2 bg-blue-500 text-white disabled:opacity-20 w-[4rem] xl:w-[10rem] text-sm xl:text-lg text-center">*/}
                        {/*    Add Text*/}
                        {/*</button>*/}
                        <button onClick={() => flipImage('horizontal', canvas)} disabled={!selectedPhoto}
                                className="flex justify-center px-2 py-2 bg-blue-900 text-white ml-2 disabled:opacity-20 w-[4rem] xl:w-[10rem] text-sm xl:text-lg text-center">
                            <p className="mr-2">Flip</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                        </button>
                        <button onClick={() => flipImage('vertical', canvas)} disabled={!selectedPhoto}
                                className="flex justify-center px-2 py-2 bg-blue-500 text-white ml-2 disabled:opacity-20 w-[4rem] xl:w-[10rem] text-sm xl:text-lg text-center">
                            <p className="mr-2">Flip</p>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6 rotate-90">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                        </button>
                        <button onClick={() => {
                            rotateCanvas(canvas, setCanvasSize);
                        }} disabled={!selectedPhoto}
                                className="px-2 py-2 bg-blue-900 ml-2 text-white disabled:opacity-20 w-[4rem] xl:w-[10rem] text-sm xl:text-lg text-center">
                            Rotate
                        </button>
                        <button onClick={() => handleRemoveObject(selectedPhoto, setSelectedPhoto)}
                                className={`px-2 py-2 bg-red-500 text-white disabled:opacity-20 w-[4rem] xl:w-[10rem] text-sm xl:text-lg text-center ml-2 ${selectedPhoto ? 'block' : 'hidden'}`}>
                            Remove
                        </button>
                    </div>
                </>
                }
                {path === 'photobookcover' && <>
                    <div className="flex my-5 mb-10">
                        <button onClick={() => setOpenBookCoverText(true)}
                                className="text-center w-[4rem] xl:w-[10rem] px-2 py-2 bg-blue-700 text-white hover:bg-blue-500">
                            Text
                        </button>
                        <button onClick={() => setOpen(true)}
                                className="text-center w-[4rem] xl:w-[10rem] px-2 py-2 bg-indigo-500 text-white hover:bg-indigo-300 ml-2">
                            Color
                        </button>
                    </div>
                </>}

                <div className="relative bg-white pb-5">
                    {path === 'photobooks' &&
                        <div style={{height: `${canvas?.height}px`}}
                             className={`w-[2px] bg-gray-600 opacity-30 z-20 absolute right-[50%]`}/>}
                    <div
                        className={`${path === 'photos' ? 'flex' : 'hidden'} vertical-text absolute ${JSON.stringify(primaryBorder).includes('#') ? '-left-14 -bottom-2' : '-left-8 bottom-8'} justify-center items-center`}>
                        <p className="text-gray-500 text-sm">{canvasSize.height / dpi} in </p>
                        <ArrowLongDownIcon
                            aria-hidden="true" className="h-[30px] w-10 text-gray-400"/>
                    </div>
                    <canvas id={canvasId} ref={canvasRef}></canvas>
                    <div
                        className={`${path === 'photos' ? 'flex' : 'hidden'} absolute ${JSON.stringify(primaryBorder).includes('#') ? '-left-4 -bottom-[3.5rem]' : 'left-3 -bottom-3'} justify-center items-center`}>
                        <p className="text-gray-500 text-sm">{canvasSize.width / dpi} in </p>
                        <ArrowLongRightIcon
                            aria-hidden="true" className="h-[30px] w-8 text-gray-400"/>
                    </div>
                </div>
                {selectedPhoto &&
                    <p className={`text-xl text-center ${JSON.stringify(primaryBorder).includes('#') ? 'pt-6' : 'pt-1'}`}>
                        (Scroll on image to zoom)
                    </p>}

            </div>
            <ReusableDialog
                open={open}
                setOpen={setOpen}
                title="Cover Color"
                handleConfirm={() => setOpen(!open)}
                handleCancel={() => setOpen(!open)}
            >
                <div className="grid grid-cols-3">
                    {bookCoverColors.map((bookCoverColor, index) => (
                        <div key={index}
                             className={`flex flex-col items-center justify-center px-1 py-2 rounded-md ${bookCoverColor.src === selectedBookCoverColor.src ? 'border-2 border-indigo-200' : ''}`}>
                            <button
                                onClick={() => handleBookCoverBackgroundColorSelect(bookCoverColor)}
                                className="h-[100px] text-center w-[4rem] xl:w-[10rem] rounded-md shadow-2xl book-cover-button"
                                style={{backgroundImage: `url(${bookCoverColor.src})`}}
                            />
                            <span className="text-xs text-gray-600 pt-1">{bookCoverColor.name}</span>
                        </div>
                    ))}
                </div>
            </ReusableDialog>
            <ReusableDialog
                open={openBookCoverText}
                setOpen={setOpenBookCoverText}
                title="Cover Text"
                handleConfirm={handleBookCoverTextConfirm}
                handleCancel={() => setOpenBookCoverText(!openBookCoverText)}
            >
                <textarea
                    value={bookCoverText}
                    onChange={(e) => setBookCoverText(e.target.value)}
                    className="w-full overflow-auto rounded-md p-1 resize-none whitespace-nowrap dialog-text-area text-center h-[126px]"></textarea>
            </ReusableDialog>
            <ReusableDialog
                open={saveProject}
                setOpen={setSaveProject}
                title="Enter a Project Name to Save"
                handleConfirm={handleConfirmSave}
                handleCancel={() => setSaveProject(!saveProject)}
                isSaving={isSaving}
            >
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)}
                       className="px-2 w-full lg:w-[50%] text-center border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </ReusableDialog>
        </div>
    );
}
