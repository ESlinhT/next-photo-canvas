import React, {useEffect, useRef, useState} from 'react';
import {initializeCanvas, setupDragAndDrop, toggleBorder} from './CanvasControls';
import {
    deleteImage,
    rotateCanvas,
    flipCanvas, flipImage, enableCrop, applyCrop
} from '../utils/ImageUtils';
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";

export default function PhotoCanvas({images, path = "photos", index}) {
    const {primaryBorder, secondaryBorder, canvasSize, selectedPhoto, setSelectedPhoto} = useCanvasOptionsContext();
    const canvasRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [croppedObject, setCroppedObject] = useState(null);
    const [guidelines, setGuidelines] = useState([]);

    const [croppedDimensions, setCroppedDimensions] = useState({
        height: 0,
        width: 0,
        top: 0,
        left: 0,
    });

    useEffect(() => {
        const canvas = initializeCanvas(canvasRef, setCanvas, setSelectedImage, guidelines, setGuidelines, canvasSize, selectedPhoto, path);
        const cleanupDragAndDrop = setupDragAndDrop(canvasRef, canvas);

        return () => {
            cleanupDragAndDrop();
            canvas.dispose();
        };
    }, [images, canvasSize, selectedPhoto, path]);

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
        if (path !== 'photobookcover') {
            toggleBorder(primaryBorder, secondaryBorder, canvas);
        }
    }, [primaryBorder, secondaryBorder]);

    return (
        <div className="relative">
            {/*<div className="vertical-text absolute -left-10 bottom-0">*/}
            {/*    Vertical Text*/}
            {/*</div>*/}
            <div className={`flex flex-col items-center ${path === 'photos' ? 'h-[100vh]' : ''}`}>
                {path === 'photobooks' && <>
                    <div className="flex my-5 mb-10">
                        <button onClick={() => flipImage( 'horizontal', canvas)} disabled={!selectedImage}
                                className="px-4 py-2 bg-blue-900 text-white disabled:opacity-20">
                            Flip Horizontal
                        </button>
                        <button onClick={() => flipImage( 'vertical', canvas)} disabled={!selectedImage}
                                className="px-4 py-2 bg-blue-500 text-white ml-2 disabled:opacity-20">
                            Flip Vertical
                        </button>
                        <button
                            onClick={() => enableCrop(selectedImage, isCropping, setIsCropping, canvas, croppedObject, setCroppedObject)}
                            disabled={!selectedImage} className="px-4 py-2 bg-green-800 text-white ml-2 disabled:opacity-20">
                            Crop Image
                        </button>
                        <button
                            onClick={() => applyCrop(croppedObject, selectedImage, croppedDimensions, canvas, setCroppedObject, setIsCropping)}
                            disabled={!selectedImage} className="px-4 py-2 bg-green-500 text-white ml-2 disabled:opacity-20">
                            Apply Crop
                        </button>
                    </div>
                </>
                }
                {path === 'photos' && <>
                    <div className="flex my-5 mb-10">
                        <button onClick={() => flipImage('horizontal', canvas)} disabled={!selectedPhoto}
                                className="px-4 py-2 bg-blue-900 text-white disabled:opacity-20">
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
                        WIP: need to add text and color options
                    </div>
                </>}

                <div className="relative bg-white pb-5">
                    <canvas ref={canvasRef}></canvas>
                </div>
                {selectedPhoto &&
                    <p className={`text-xl text-center ${JSON.stringify(primaryBorder).includes('#') ? 'pt-6' : 'pt-1'}`}>
                        (Scroll on image to zoom)
                    </p>}

            </div>
        </div>
    );
}
