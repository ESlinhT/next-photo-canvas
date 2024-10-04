// import React, {useEffect, useRef, useState} from 'react'
//
// export default function PhotoCanvas({images}) {
//     const canvasRef = useRef(null);
//     const [canvasObjects, setCanvasObjects] = useState([]);
//     const [dragging, setDragging] = useState(null);
//
//     useEffect(() => {
//         drawCanvas();
//     }, [canvasObjects]);
//
//     const drawCanvas = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//         canvasObjects.forEach((obj) => {
//             const image = new Image();
//             image.src = obj.url;
//             image.onload = () => {
//                 ctx.drawImage(image, obj.x, obj.y, obj.width, obj.height);
//             }
//         })
//     }
//
//     const handleDrop = ({nativeEvent})=> {
//         nativeEvent.preventDefault();
//         const {offsetX, offsetY} = nativeEvent;
//         const imageUrl = nativeEvent.dataTransfer.getData('imageUrl');
//         if (imageUrl) {
//             const newImage = {
//                 url: imageUrl,
//                 x: offsetX,
//                 y: offsetY,
//                 width: 200,
//                 height: 100
//             };
//             setCanvasObjects((prevObjects) => [...prevObjects, newImage])
//         }
//     }
//
//     const handleDragOver = (e) => {
//         e.preventDefault();
//     }
//
//     const handleMouseDown = ({nativeEvent}) => {
//         const {offsetX, offsetY} = nativeEvent;
//
//         const foundIndex = canvasObjects.findIndex((obj) => {
//             return (
//                 offsetX >= obj.x
//                 && offsetX <= obj.x + obj.width
//                 && offsetY >= obj.y
//                 && offsetY <= obj.y + obj.height
//             )
//         })
//
//         if (foundIndex !== 1) {
//             setDragging(foundIndex)
//         }
//     }
//
//     const handleMouseMove = ({nativeEvent}) => {
//         if (dragging !== null) {
//             const {offsetX, offsetY} = nativeEvent;
//
//             requestAnimationFrame(() => {
//                 const newCanvasObjects = [...canvasObjects];
//                 const obj = newCanvasObjects[dragging];
//
//                 if (obj) {
//                     obj.x = offsetX - obj?.width / 2;
//                     obj.y = offsetY - obj?.height / 2;
//
//                     setCanvasObjects(newCanvasObjects);
//                     // drawCanvas();
//                 }
//             })
//
//         }
//     }
//
//     const handleMouseUp = () => {
//         setDragging(null);
//     }
//
//     useEffect(() => {
//         const canvas = canvasRef.current;
//
//         if (canvas) {
//             const initialObjects = images.map((imageUrl, index) => ({
//                 image: new Image(),
//                 x: (index % 2) * (canvas.width / 2),
//                 y: Math.floor(index / 2) * (canvas.height / 2),
//                 width: canvas.width / 2,
//                 height: canvas.height / 2,
//                 dragging: false,
//             }))
//
//             initialObjects.forEach((obj, index) => {
//                 obj.image.src = images[index];
//                 obj.image.onload = () => drawCanvas();
//             });
//
//             setCanvasObjects(initialObjects);
//         }
//
//     }, [images]);
//
//     return (
//         <div className="w-full">
//             <canvas
//                 className="border border-gray-500"
//                 ref={canvasRef}
//                 width={1000}
//                 height={800}
//                 onMouseDown={handleMouseDown}
//                 onMouseUp={handleMouseUp}
//                 onMouseMove={handleMouseMove}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//             >There are no images</canvas>
//         </div>
//     )
// }

import React, {useEffect, useRef, useState} from 'react';
import * as fabric from "fabric";

export default function PhotoCanvas({images}) {
    const canvasRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [windowSize, setWindowSize] = useState({
        w: window.innerWidth,
        h: window.innerHeight
    })

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: windowSize.w * 0.75,
            height: windowSize.h * 0.75,
            backgroundColor: '#fff',
            selection: true,
        })
        setCanvas(canvas);

        const handleDrop = (e) => {
            e.preventDefault();
            const {offsetX, offsetY} = e;
            const imageUrl = e.dataTransfer.getData('imageUrl');
            fabric.Image.fromURL(imageUrl, {},).then((img) => {
                img.set({
                    left: offsetX,
                    top: offsetY,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    selectable: true,
                });
                canvas.add(img);
                canvas.renderAll();
            })
        }

        const handleDragOver = (e) => {
            e.preventDefault();
        }

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
        }
    }, [images]);

    const deleteSelectedImage = () => {
        if (selectedImage) {
            canvas.remove(selectedImage);
            canvas.requestRenderAll();
            setSelectedImage(null);
        }
    };


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
            <canvas ref={canvasRef} className="border border-gray-500"></canvas>
        </div>
    )
}
