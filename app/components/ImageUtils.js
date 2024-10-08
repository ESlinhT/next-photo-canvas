import * as fabric from "fabric";

export const flipImage = (selectedImage, flipType, canvas) => {
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
        croppedObject.set({ fill: null });
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

export const deleteImage = (canvas, selectedImage, setSelectedImage) => {
    const handleKeyDown = (event) => {
        if ((event.key === 'Delete' || event.key === 'Backspace' || event.key === 'd') && selectedImage) {
            if (selectedImage) {
                canvas.remove(selectedImage);
                canvas.requestRenderAll();
                setSelectedImage(null);
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}
