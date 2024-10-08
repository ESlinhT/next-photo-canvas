import React, {useEffect, useRef, useState} from 'react';
import {initializeCanvas, setupDragAndDrop, toggleFrame} from './CanvasControls';
import {flipImage, enableCrop, applyCrop, deleteImage} from '../utils/ImageUtils';
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";

export default function PhotoCanvas({images}) {
    const {selectedFrame, canvasSize} = useCanvasOptionsContext();
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
        const canvas = initializeCanvas(canvasRef, setCanvas, setSelectedImage, guidelines, setGuidelines, canvasSize);
        const cleanupDragAndDrop = setupDragAndDrop(canvasRef, canvas);

        return () => {
            cleanupDragAndDrop();
            canvas.dispose();
        };
    }, [images, canvasSize]);

    useEffect(() => {
        if (croppedObject) {
            croppedObject.on('modified', () => {
                const {top, left, width, height} = croppedObject.getBoundingRect();
                setCroppedDimensions({top, left, width, height});
            });
        }
    }, [croppedObject]);

    useEffect(() => {
        deleteImage(canvas, selectedImage, setSelectedImage)
    }, [canvas, selectedImage]);

    useEffect(() => {
        toggleFrame(selectedFrame, canvas);
    }, [canvas, selectedFrame]);

    return (
        <div className="flex flex-col items-center h-[100vh]">
            <div className="flex mb-5">
                <button onClick={() => flipImage(selectedImage, 'horizontal', canvas)} disabled={!selectedImage}
                        className="px-4 py-2 bg-blue-900 text-white disabled:opacity-20">
                    Flip Horizontal
                </button>
                <button onClick={() => flipImage(selectedImage, 'vertical', canvas)} disabled={!selectedImage}
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
            <div className="relative bg-white pb-5">
                <canvas ref={canvasRef} className="border-2 border-gray-200"></canvas>
            </div>
        </div>

    );
}
