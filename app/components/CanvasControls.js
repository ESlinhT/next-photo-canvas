import * as fabric from "fabric";
import {clearGuideLines, handleObjectMoving} from "@/app/utils/SnappingHelpers";
import firstBorder from '../assets/first.jpg'

export const initializeCanvas = (canvasRef, setCanvas, setSelectedImage, guidelines, setGuidelines, canvasSize) => {
    const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize?.width,
        height: canvasSize?.height,
        backgroundColor: '#fff',
        selection: true,
    });

    // const border = document.querySelector('.canvas-container');
    // border.style.width = `${canvasSize.width + 80}px`;
    // border.style.height = `${canvasSize.height + 80}px`;
    // border.style.border = '40px solid transparent';
    // border.style.borderImage = `url(${firstBorder.src}) 10 repeat`;

    canvas.on('selection:created', (e) => {
        setSelectedImage(e.selected[0]);
    });

    canvas.on('selection:cleared', () => {
        setSelectedImage(null);
    });

    canvas.on('object:moving', (event) => {
        handleObjectMoving(canvas, event.target, guidelines, setGuidelines)
    })

    canvas.on('object:modified', (event) => {
        clearGuideLines(canvas, event.target, guidelines, setGuidelines)
    })

    canvas.renderAll();

    setCanvas(canvas);

    return canvas;
};

export const setupDragAndDrop = (canvasRef, canvas) => {
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
            });
            canvas.add(img);
            canvas.renderAll();
        });
    };

    const handleDragOver = (e) => e.preventDefault();

    const canvasContainer = canvasRef.current.parentElement;
    canvasContainer.addEventListener('drop', handleDrop);
    canvasContainer.addEventListener('dragover', handleDragOver);

    return () => {
        canvasContainer.removeEventListener('drop', handleDrop);
        canvasContainer.removeEventListener('dragover', handleDragOver);
    };
};

export const toggleFrame = (selectedFrame, canvas) => {
    fabric.Image.fromURL(selectedFrame?.src).then((img) => {
        img.scaleX = canvas?.width / img.width;
        img.scaleY = canvas?.height / img.height;
        canvas?.set('backgroundImage', img);
        canvas?.renderAll()
    });
}