import * as fabric from "fabric";

export const flipImage = (selectedImage, flipType, canvas) => {
    if (selectedImage) {
        switch (flipType) {
            case 'horizontal':
                selectedImage.set('flipX', !selectedImage.flipX);
                break;
            case 'vertical':
                selectedImage.set('flipY', !selectedImage.flipY);
                break;
        }
        canvas.renderAll();
    }
};

export const flipCanvas = (flipType, canvas) => {
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

export const rotateCanvas = (canvas) => {
    const activeObject = canvas?.getActiveObject();
    const originalHeight = canvas.height;
    const originalWidth = canvas.width;
    canvas.setHeight(originalWidth);
    canvas.setWidth(originalHeight);
    if (activeObject) {
        activeObject.set('scaleX', canvas.getWidth() / activeObject.width);
        activeObject.set('scaleY', canvas.getHeight() / activeObject.height);

    }
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

// export const enableCanvasCrop = (isCropping, setIsCropping, canvas, croppedObject, setCroppedObject) => {
//     if (canvas && !isCropping) {
//         setIsCropping(true)
//         const newObject = new fabric.Rect({
//             left: canvas.left,
//             top: canvas.top,
//             width: canvas.width,
//             height: canvas.height,
//             fill: 'rgba(255,255,255,0.3)',
//             strokeDashArray: [5, 5],
//             selectable: true,
//         });
//
//         setCroppedObject(newObject);
//         canvas?.add(newObject);
//         canvas?.setActiveObject(newObject);
//         canvas?.renderAll();
//     } else {
//         canvas?.remove(croppedObject);
//         setIsCropping(false)
//     }
// };

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

// export const applyCanvasCrop = (croppedObject, croppedDimensions, canvas, setCroppedObject, setIsCropping) => {
//     if (croppedObject) {
//         croppedObject.set({fill: null});
//         const croppedImageDataURL = canvas.toDataURL({
//             left: croppedDimensions.left,
//             top: croppedDimensions.top,
//             width: croppedDimensions.width,
//             height: croppedDimensions.height,
//         });
//
//         fabric.Image.fromURL(croppedImageDataURL).then((croppedImg) => {
//             croppedImg.scaleX = canvas?.width / croppedImg.width;
//             croppedImg.scaleY = canvas?.height / croppedImg.height;
//
//             canvas.remove(croppedObject);
//             setCroppedObject(null);
//             setIsCropping(false);
//             canvas?.set('backgroundImage', croppedImg);
//             canvas?.renderAll()
//         });
//     }
// };

export const deleteImage = (canvas, selectedImage, setSelectedImage, selectedPhoto, setSelectedPhoto) => {
    const handleKeyDown = (event) => {
        if ((event.key === 'Delete' || event.key === 'Backspace' || event.key === 'd') && selectedImage) {
            if (selectedImage) {
                canvas.remove(selectedImage);
                canvas.requestRenderAll();
                setSelectedImage(null);
            }
            if (selectedPhoto) {
                canvas.remove(selectedPhoto);
                canvas.requestRenderAll();
                setSelectedPhoto(null);
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}
