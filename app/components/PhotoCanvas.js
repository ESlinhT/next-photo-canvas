import React, {useEffect, useRef, useState} from 'react';
import * as fabric from "fabric";

export default function PhotoCanvas({images}) {
    const canvasRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [croppedObject, setCroppedObject] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [croppedDimensions, setCroppedDimensions] = useState({
        height: 0,
        width: 0,
        top: 0,
        left: 0
    });

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: window.innerWidth * 0.75,
            height: window.innerHeight * 0.75,
            backgroundColor: '#fff',
            selection: true,
        });
        setCanvas(canvas);

        const handleDrop = (e) => {
            e.preventDefault();
            const { offsetX, offsetY } = e;
            const imageUrl = e.dataTransfer.getData('imageUrl');
            fabric.Image.fromURL(imageUrl).then((img) => {
                img.set({
                    left: offsetX,
                    top: offsetY,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    selectable: true,
                    angle: 0,
                    flipX: false,
                    flipY: false,
                });

                img.controls.mtr.visible = true;

                img.controls.flipH = new fabric.Control({
                    actionHandler: () => flipImage(img, 'horizontal'),
                });

                img.controls.flipV = new fabric.Control({
                    actionHandler: () => flipImage(img, 'vertical'),
                });

                canvas.add(img);
                canvas.renderAll();
            });
        };

        const handleDragOver = (e) => {
            e.preventDefault();
        };

        canvas.on('selection:created', (e) => {
            setSelectedImage(e.selected[0]);
        });

        canvas.on('selection:cleared', () => {
            setSelectedImage(null);
        });

        const canvasContainer = canvasRef.current.parentElement;
        canvasContainer.addEventListener('drop', handleDrop);
        canvasContainer.addEventListener('dragover', handleDragOver);

        return () => {
            canvasContainer.removeEventListener('drop', handleDrop);
            canvasContainer.removeEventListener('dragover', handleDragOver);
            canvas.dispose();
        };
    }, [images]);

    const flipImage = (flipType) => {g
        if (selectedImage) {
            switch (flipType) {
                case 'horizontal':
                    selectedImage.set('flipX', !selectedImage.flipX); // Toggle horizontal flip;
                    break;
                case 'vertical':
                    selectedImage.set('flipY', !selectedImage.flipY); // Toggle vertical flip
                    break;
            }
            canvas.renderAll();
        }
    };

    const deleteSelectedImage = () => {
        if (selectedImage) {
            canvas.remove(selectedImage);
            canvas.requestRenderAll();
            setSelectedImage(null);
        }
    };

    const enableCrop = () => {
        if (selectedImage && !isCropping) {
            setIsCropping(true);

            const croppedObject = new fabric.Rect({
                left: selectedImage.left,
                top: selectedImage.top,
                width: selectedImage.width * selectedImage.scaleX,
                height: selectedImage.height * selectedImage.scaleY,
                fill: 'rgba(255,255,255,0.3)',
                strokeDashArray: [5, 5],
                selectable: true,
                evented: true,
            });

            setCroppedObject(croppedObject);
            canvas.add(croppedObject);
            canvas.setActiveObject(croppedObject);
            canvas.renderAll();
        }
    };

    const applyCrop = () => {
        if (croppedObject && selectedImage) {
            croppedObject.set({ fill: null });
            const croppedImageDataURL = canvas.toDataURL({
                left: croppedDimensions.left,
                top: croppedDimensions.top,
                width: croppedDimensions.width,
                height: croppedDimensions.height,
            })

            fabric.Image.fromURL(croppedImageDataURL).then((croppedImg) => {
                canvas.remove(selectedImage);
                canvas.remove(croppedObject);
                setCroppedObject(null);
                setIsCropping(false);

                canvas.add(croppedImg);
                canvas.renderAll();
            });
        }
    };

    useEffect(() => {
        croppedObject?.on('modified', () => {
            const {top, left, width, height } = croppedObject.getBoundingRect();
            setCroppedDimensions({top, left, width, height});
        })
    }, [croppedObject]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.key === 'Delete' || event.key === 'Backspace' || event.key === 'd') && selectedImage) {
                deleteSelectedImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage]);

    return (
        <div className="relative bg-white">
            <div className="flex mb-2">
                <button onClick={() => flipImage('horizontal')} disabled={!selectedImage} className="px-4 py-2 bg-blue-900 text-white disabled:opacity-20">
                    Flip Horizontal
                </button>
                <button onClick={() => flipImage('vertical')} disabled={!selectedImage} className="px-4 py-2 bg-blue-500 text-white ml-2 disabled:opacity-20">
                    Flip Vertical
                </button>
                <button onClick={enableCrop} disabled={!selectedImage} className="px-4 py-2 bg-green-800 text-white ml-2 disabled:opacity-20">
                    Crop Image
                </button>
                <button onClick={applyCrop} disabled={!selectedImage} className="px-4 py-2 bg-green-500 text-white ml-2 disabled:opacity-20">
                    Apply Crop
                </button>
            </div>
            <canvas ref={canvasRef} className="border border-gray-500"></canvas>
        </div>
    );
}