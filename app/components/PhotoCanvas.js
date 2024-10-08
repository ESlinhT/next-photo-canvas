import React, { useEffect, useRef, useState } from 'react';
import { initializeCanvas, setupDragAndDrop } from './CanvasControls';
import { flipImage, enableCrop, applyCrop, deleteImage } from './ImageUtils';

export default function PhotoCanvas({ images }) {
    const canvasRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [croppedObject, setCroppedObject] = useState(null);
    const [croppedDimensions, setCroppedDimensions] = useState({
        height: 0,
        width: 0,
        top: 0,
        left: 0,
    });

    useEffect(() => {
        const canvas = initializeCanvas(canvasRef, setCanvas, setSelectedImage);
        const cleanupDragAndDrop = setupDragAndDrop(canvasRef, canvas);

        return () => {
            cleanupDragAndDrop();
            canvas.dispose();
        };
    }, [images]);

    useEffect(() => {
        if (croppedObject) {
            croppedObject.on('modified', () => {
                const { top, left, width, height } = croppedObject.getBoundingRect();
                setCroppedDimensions({ top, left, width, height });
            });
        }
    }, [croppedObject]);

    useEffect(() => {
        deleteImage(canvas, selectedImage, setSelectedImage)
    }, [selectedImage]);

    return (
        <div className="relative bg-white">
            <div className="flex mb-2">
                <button onClick={() => flipImage(selectedImage, 'horizontal', canvas)} disabled={!selectedImage} className="px-4 py-2 bg-blue-900 text-white disabled:opacity-20">
                    Flip Horizontal
                </button>
                <button onClick={() => flipImage(selectedImage, 'vertical', canvas)} disabled={!selectedImage} className="px-4 py-2 bg-blue-500 text-white ml-2 disabled:opacity-20">
                    Flip Vertical
                </button>
                <button onClick={() => enableCrop(selectedImage, isCropping, setIsCropping, canvas, croppedObject, setCroppedObject)} disabled={!selectedImage} className="px-4 py-2 bg-green-800 text-white ml-2 disabled:opacity-20">
                    Crop Image
                </button>
                <button onClick={() => applyCrop(croppedObject, selectedImage, croppedDimensions, canvas, setCroppedObject, setIsCropping)} disabled={!selectedImage} className="px-4 py-2 bg-green-500 text-white ml-2 disabled:opacity-20">
                    Apply Crop
                </button>
            </div>
            <canvas ref={canvasRef} className="border border-gray-500"></canvas>
        </div>
    );
}
