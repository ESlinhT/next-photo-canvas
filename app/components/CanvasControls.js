import * as fabric from "fabric";

export const initializeCanvas = (canvasRef, setCanvas, setSelectedImage) => {
    const canvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth * 0.75,
        height: window.innerHeight * 0.75,
        backgroundColor: '#fff',
        selection: true,
    });

    setCanvas(canvas);

    canvas.on('selection:created', (e) => {
        setSelectedImage(e.selected[0]);
    });

    canvas.on('selection:cleared', () => {
        setSelectedImage(null);
    });

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