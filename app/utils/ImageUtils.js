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
    canvas.renderAll()
}

export const resizeCanvas = (canvas, path, canvasSize) => {
    if (canvas) {
        const windowWidth = window.innerWidth;

        let baseWidth = canvasSize?.width || 800;
        let baseHeight = canvasSize?.height || 600;

        if (path === "photobooks" || path === "photobookcover") {
            baseWidth = 1200;
            baseHeight = baseWidth === baseHeight ? 600 : 800;
        }

        let scaleFactor;
        if (windowWidth > 1400) {
            scaleFactor = 1;
        } else if (windowWidth > 1300) {
            scaleFactor = 0.80;
        } else if (windowWidth > 768) {
            scaleFactor = 0.60;
        } else {
            scaleFactor = path === 'photos' ? 0.60 : 0.30;
        }
        console.log(scaleFactor, windowWidth)

        canvas.setWidth(baseWidth * scaleFactor);
        canvas.setHeight(baseHeight * scaleFactor);
        canvas.setZoom(scaleFactor);

        canvas.requestRenderAll();
    }
};

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

export const deleteImage = (canvas, setSelectedObject) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        try {
            canvas.discardActiveObject();
            canvas.remove(activeObject);
        } catch (e) {
            console.error(e)
        } finally {
            setSelectedObject(null);
            canvas.renderAll();
        }
    }
}
