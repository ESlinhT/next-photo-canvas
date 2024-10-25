import React, {useEffect, useRef, useState} from 'react';
import {
    addText,
    displayBookCoverText,
    initializeCanvas,
    setupDragAndDrop,
    toggleBookCoverColor
} from './CanvasControls';
import {applyCrop, deleteImage, enableCrop, flipImage, rotateCanvas,} from '../utils/ImageUtils';
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";
import ReusableDialog from "@/app/components/ReusableDialog";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import {createSavedProject, getSavedProjects} from "@/app/lib/appwrite";
import * as fabric from "fabric";

export default function PhotoCanvas({item, path = "photos", disableHalf = false, canvasId}) {
    const {
        primaryBorder,
        secondaryBorder,
        canvasSize,
        selectedPhoto,
        setSelectedPhoto,
        bookCoverColors
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
    const [confirmSave, setConfirmSave] = useState(false);
    const [selectedBookCoverColor, setSelectedBookCoverColor] = useState({})
    const [bookCoverText, setBookCoverText] = useState('');
    const [projectName, setProjectName] = useState('');

    const [croppedDimensions, setCroppedDimensions] = useState({
        height: 0,
        width: 0,
        top: 0,
        left: 0,
    });

    useEffect(() => {
        const canvas = initializeCanvas(canvasRef, setCanvas, setSelectedImage, guidelines, setGuidelines, canvasSize, selectedPhoto, path, disableHalf, primaryBorder, secondaryBorder);
        const cleanupDragAndDrop = setupDragAndDrop(canvasRef, canvas, disableHalf);

        if (croppedObject) {
            croppedObject.on('modified', () => {
                const {top, left, width, height} = croppedObject.getBoundingRect();
                setCroppedDimensions({top, left, width, height});
            });
        }

        if (item) {
            canvas.loadFromJSON(item).then(() => {
                canvas.renderAll();
            })
        }

        return () => {
            cleanupDragAndDrop();
            canvas.dispose();
        };
    }, [item, canvasSize.height, canvasSize.width, selectedPhoto, path, primaryBorder, secondaryBorder, croppedObject, guidelines, canvasSize, disableHalf]);

    useEffect(() => {
        deleteImage(canvas, selectedImage, setSelectedImage, selectedPhoto, setSelectedPhoto)
        saveCanvasAsJSON();
    }, [canvas, selectedImage]);

    useEffect(() => {
        toggleBookCoverColor(canvas, selectedBookCoverColor);
    }, [canvas, selectedBookCoverColor]);

    const handleConfirmSave = async (confirmSave) => {
        if (confirmSave && user) {
            await createSavedProject(projectName, JSON.stringify(getCanvasItemsFromLocalStorage()), path === 'photos' ? 'photo' : 'photobook');

            setConfirmSave(false)
            setSaveProject(!saveProject)
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
                canvasItems.push({ key, item });
            }
            if (path === 'photos' && key === 'photo') {
                const item = localStorage.getItem(key);
                canvasItems.push({ key, item });
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
        saveCanvasAsJSON();
    }

    const handleBookCoverTextConfirm = () => {
        displayBookCoverText(canvas, bookCoverText);
        setOpenBookCoverText(false)
        saveCanvasAsJSON();
    }

    const saveCanvasAsJSON = () => {
        const canvasJSON = canvas?.toJSON();
        localStorage.setItem(canvasId, JSON.stringify(canvasJSON));
    };

    return (
        <div className="relative">
            <div className="flex flex-col items-center">
                {path === 'photobooks' && <>
                    <div className="flex my-5 mb-10">
                        <button onClick={() => addText(canvas)}
                                className="px-4 py-2 bg-blue-500 text-white disabled:opacity-20 w-[150px]">
                            Add Text
                        </button>
                        <button onClick={() => flipImage('horizontal', canvas)} disabled={!selectedImage}
                                className="flex justify-center px-4 py-2 bg-blue-900 text-white ml-2 disabled:opacity-20 w-[150px]">
                            <p className="mr-2">Flip</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                        </button>
                        <button onClick={() => flipImage('vertical', canvas)} disabled={!selectedImage}
                                className="flex justify-center px-4 py-2 bg-blue-500 text-white ml-2 disabled:opacity-20 w-[150px]">
                            <p className="mr-2">Flip</p>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6 rotate-90">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => enableCrop(selectedImage, isCropping, setIsCropping, canvas, croppedObject, setCroppedObject)}
                            disabled={!selectedImage}
                            className="px-4 py-2 bg-green-800 text-white ml-2 disabled:opacity-20 w-[150px]">
                            Crop Image
                        </button>
                        <button
                            onClick={() => applyCrop(croppedObject, selectedImage, croppedDimensions, canvas, setCroppedObject, setIsCropping)}
                            disabled={!selectedImage}
                            className="px-4 py-2 bg-green-500 text-white ml-2 disabled:opacity-20 w-[150px]">
                            Apply Crop
                        </button>
                    </div>
                </>
                }
                {path === 'photos' && <>
                    <div className="flex my-5 mb-10">
                        <button onClick={() => addText(canvas)}
                                className="px-4 py-2 bg-blue-500 text-white disabled:opacity-20 w-[100px]">
                            Add Text
                        </button>
                        <button onClick={() => flipImage('horizontal', canvas)} disabled={!selectedPhoto}
                                className="flex justify-center px-4 py-2 bg-blue-900 text-white ml-2 disabled:opacity-20 w-[100px]">
                            <p className="mr-2">Flip</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                        </button>
                        <button onClick={() => flipImage('vertical', canvas)} disabled={!selectedPhoto}
                                className="flex justify-center px-4 py-2 bg-blue-500 text-white ml-2 disabled:opacity-20 w-[100px]">
                            <p className="mr-2">Flip</p>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6 rotate-90">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                            </svg>
                        </button>
                        <button onClick={() => {
                            rotateCanvas(canvas);
                        }} disabled={!selectedPhoto}
                                className="px-4 py-2 bg-blue-900 ml-2 text-white disabled:opacity-20 w-[100px]">
                            Rotate
                        </button>
                    </div>
                </>
                }
                {path === 'photobookcover' && <>
                    <div className="flex my-5 mb-10">
                        <button onClick={() => setOpenBookCoverText(true)}
                                className="w-[150px] px-4 py-2 bg-blue-700 text-white hover:bg-blue-500">
                            Text
                        </button>
                        <button onClick={() => setOpen(true)}
                                className="w-[150px] px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-300 ml-2">
                            Color
                        </button>
                    </div>
                </>}

                <div className="relative bg-white pb-5">
                    {path === 'photobooks' &&
                        <div
                            className={`${canvasSize.height === canvasSize.width ? 'h-[97%]' : 'h-[97.5%]'} w-[2px] bg-gray-600 opacity-30 z-20 absolute right-[50%]`}/>}
                    <canvas id={canvasId} ref={canvasRef}></canvas>
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
                                className="h-[100px] w-[150px] rounded-md shadow-2xl book-cover-button"
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
                handleConfirm={() => handleConfirmSave(true)}
                handleCancel={() => setSaveProject(!saveProject)}
            >
                <input type="text" onChange={(e) => setProjectName(e.target.value)} className="px-2 w-[50%] text-center border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            </ReusableDialog>
        </div>
    );
}
