import React, {useEffect, useRef, useState} from 'react';
import {initializeCanvas, setupDragAndDrop, toggleBookCoverColor, toggleBorder, addText, displayBookCoverText} from './CanvasControls';
import {
    deleteImage,
    rotateCanvas,
    flipImage,
    enableCrop,
    applyCrop,
} from '../utils/ImageUtils';
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";
import ReusableDialog from "@/app/components/ReusableDialog";

export default function PhotoCanvas({images, path = "photos", disableHalf = false}) {
    const {
        primaryBorder,
        secondaryBorder,
        canvasSize,
        selectedPhoto,
        setSelectedPhoto,
        bookCoverColors
    } = useCanvasOptionsContext();
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

    const [croppedDimensions, setCroppedDimensions] = useState({
        height: 0,
        width: 0,
        top: 0,
        left: 0,
    });

    useEffect(() => {
        const canvas = initializeCanvas(canvasRef, setCanvas, setSelectedImage, guidelines, setGuidelines, canvasSize, selectedPhoto, path, disableHalf, primaryBorder, secondaryBorder);
        const cleanupDragAndDrop = setupDragAndDrop(canvasRef, canvas, disableHalf);

        return () => {
            cleanupDragAndDrop();
            canvas.dispose();
        };
    }, [images, canvasSize.height, canvasSize.width, selectedPhoto, path, primaryBorder, secondaryBorder]);

    useEffect(() => {
        if (croppedObject) {
            croppedObject.on('modified', () => {
                const {top, left, width, height} = croppedObject.getBoundingRect();
                setCroppedDimensions({top, left, width, height});
            });
        }
    }, [croppedObject]);

    useEffect(() => {
        deleteImage(canvas, selectedImage, setSelectedImage, selectedPhoto, setSelectedPhoto)
    }, [canvas, selectedImage]);

    useEffect(() => {
        toggleBookCoverColor(canvas, selectedBookCoverColor);
    }, [selectedBookCoverColor]);

    const handleBookCoverBackgroundColorSelect = (color) => {
        if (color === selectedBookCoverColor) {
            setSelectedBookCoverColor({});
        } else {
            setSelectedBookCoverColor(color)
        }
    }

    const handleBookCoverTextConfirm = () => {
        displayBookCoverText(canvas, bookCoverText);
        setOpenBookCoverText(false)
    }

    return (
        <div className="relative">
            <div className="flex flex-col items-center">
                {path === 'photobooks' && <>
                    <div className="flex my-5 mb-10">
                        <button onClick={() => addText(canvas)}
                                className="px-4 py-2 bg-blue-500 text-white disabled:opacity-20">
                            Add Text
                        </button>
                        <button onClick={() => flipImage('horizontal', canvas)} disabled={!selectedImage}
                                className="px-4 py-2 bg-blue-900 text-white ml-2 disabled:opacity-20">
                            Flip Horizontal
                        </button>
                        <button onClick={() => flipImage('vertical', canvas)} disabled={!selectedImage}
                                className="px-4 py-2 bg-blue-500 text-white ml-2 disabled:opacity-20">
                            Flip Vertical
                        </button>
                        <button
                            onClick={() => enableCrop(selectedImage, isCropping, setIsCropping, canvas, croppedObject, setCroppedObject)}
                            disabled={!selectedImage}
                            className="px-4 py-2 bg-green-800 text-white ml-2 disabled:opacity-20">
                            Crop Image
                        </button>
                        <button
                            onClick={() => applyCrop(croppedObject, selectedImage, croppedDimensions, canvas, setCroppedObject, setIsCropping)}
                            disabled={!selectedImage}
                            className="px-4 py-2 bg-green-500 text-white ml-2 disabled:opacity-20">
                            Apply Crop
                        </button>
                    </div>
                </>
                }
                {path === 'photos' && <>
                    <div className="flex my-5 mb-10">
                        <button onClick={() => addText(canvas)}
                                className="px-4 py-2 bg-blue-500 text-white disabled:opacity-20">
                            Add Text
                        </button>
                        <button onClick={() => flipImage('horizontal', canvas)} disabled={!selectedPhoto}
                                className="px-4 py-2 bg-blue-900 text-white ml-2 disabled:opacity-20">
                            Flip Horizontal
                        </button>
                        <button onClick={() => flipImage('vertical', canvas)} disabled={!selectedPhoto}
                                className="px-4 py-2 bg-blue-500 text-white mx-2 disabled:opacity-20">
                            Flip Vertical
                        </button>
                        <button onClick={() => {
                            rotateCanvas(canvas);
                        }} disabled={!selectedPhoto}
                                className="px-4 py-2 bg-blue-900 text-white disabled:opacity-20">
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
                            className={`${canvasSize.height === canvasSize.width ? 'h-[97%]' : 'h-[97.5%]'} w-[2px] bg-gray-600 opacity-30 z-50 absolute right-[50%]`}/>}
                    <canvas ref={canvasRef}></canvas>
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
                             className={`flex flex-col items-center justify-center px-1 py-2 rounded-md ${bookCoverColor.src === selectedBookCoverColor ? 'border-2 border-indigo-200' : ''}`}>
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
        </div>
    );
}
