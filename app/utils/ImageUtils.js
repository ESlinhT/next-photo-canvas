import * as fabric from "fabric";

export const flipImage = (flipType, canvas) => {
    const img = canvas?.getActiveObject();

    switch (flipType) {
        case 'horizontal':
            img?.set('flipX', !img?.flipX);
            break;
        case 'vertical':
            img?.set('flipY', !img?.flipY);
            break;
    }

    canvas?.renderAll();
};

export const rotateCanvas = (canvas, setCanvasSize) => {
    const updatedCanvasSize = {
        height: canvas.getWidth(),
        width: canvas.getHeight()
    }
    setCanvasSize(updatedCanvasSize)
    localStorage.setItem('canvas-size', JSON.stringify(updatedCanvasSize))
    canvas.renderAll()
}

export const enableCrop = (selectedImage, isCropping, setIsCropping, canvas, croppedObject, setCroppedObject) => {
    if (selectedImage && !isCropping) {
        setIsCropping(true)
        const newObject = new fabric.Rect({
            left: selectedImage.left,
            top: selectedImage.top,
            width: selectedImage.width * selectedImage.scaleX,
            height: selectedImage.height * selectedImage.scaleY,
            fill: 'rgba(255,255,255,0.3)',
            strokeDashArray: [5, 5],
            selectable: true,
        });

        setCroppedObject(newObject);
        canvas?.add(newObject);
        canvas?.setActiveObject(newObject);
        canvas?.renderAll();
    } else {
        canvas?.remove(croppedObject);
        setIsCropping(false)
    }
};

export const applyCrop = (croppedObject, selectedImage, croppedDimensions, canvas, setCroppedObject, setIsCropping) => {
    if (croppedObject && selectedImage) {
        croppedObject.set({fill: null});
        const croppedImageDataURL = canvas.toDataURL({
            left: croppedDimensions.left,
            top: croppedDimensions.top,
            width: croppedDimensions.width,
            height: croppedDimensions.height,
        });

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

export const deleteImage = (canvas, selectedObject, setSelectedObject) => {
    canvas.remove(selectedObject);
    canvas.requestRenderAll();
    setSelectedObject(null);
    canvas.renderAll()
}
