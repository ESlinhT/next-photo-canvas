import * as fabric from "fabric";
import {clearGuideLines, handleObjectMoving} from "@/app/utils/SnappingHelpers";

export const initializeCanvas = (canvasRef, setCanvas, setSelectedImage, guidelines, setGuidelines, canvasSize) => {
    const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize?.width,
        height: canvasSize?.height,
        backgroundColor: '#fff',
        selection: true,
    });

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

export const toggleBorder = (primaryBorder, secondaryBorder, canvas) => {
    const border = document.querySelector('.lower-canvas');

    if (primaryBorder) {
        border.style.border = `2em solid ${primaryBorder}`;
        border.style.width = `${canvas?.width + 40}px`;
        border.style.height = `${canvas?.height + 40}px`;
    }
    if (secondaryBorder) {
        border.style.border = '2em solid transparent';
        border.style.backgroundImage = `linear-gradient(white, white), linear-gradient(to right, ${primaryBorder}, ${secondaryBorder})`;
        border.style.width = `${canvas?.width + 40}px`;
        border.style.height = `${canvas?.height + 40}px`;
    }
    if (!primaryBorder && !secondaryBorder) {
        border.style.border = 'none';
        border.style.width = `${canvas?.width}px`;
        border.style.height = `${canvas?.height}px`;
    }
}

export const setCanvasPhoto = (selectedPhoto, canvas) => {
    fabric.Image.fromURL(selectedPhoto).then((img) => {
        img.scaleX = canvas?.width / img.width;
        img.scaleY = canvas?.height / img.height;
        canvas?.set('backgroundImage', img);
        canvas?.renderAll()
    });
}