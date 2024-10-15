import * as fabric from "fabric";
import {clearGuideLines, handleObjectMoving} from "@/app/utils/SnappingHelpers";

export const initializeCanvas = (canvasRef, setCanvas, setSelectedImage, guidelines, setGuidelines, canvasSize, selectedPhoto) => {
    const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize?.width,
        height: canvasSize?.height,
        backgroundColor: '#fff',
        // selection: true,
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

    // Source: https://github.com/fabricjs/fabric.js/discussions/7052
    canvas.on('mouse:wheel', onMouseWheel);
    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
    let isDragging = false;
    let lastPosX;
    let lastPosY;
    let img;

    fabric.Image.fromURL(selectedPhoto).then( (_img) => {
        img = _img;
        img.set({
            left: 0,
            top: 0,
            scaleX: canvas?.width / img.width,
            scaleY: canvas?.height / img.height,
            selectable: true,
            hasControls: false,
        });
        canvas.add(img);
        canvas?.setActiveObject(img);

        // initialize zoom
        canvas.setZoom(1);

        canvas.requestRenderAll();
    })

    function onMouseWheel(opt) {
        const {e} = opt;
        zoomDelta(canvas, e.deltaY, e.offsetX, e.offsetY);
        enclose(canvas, img);
        e.preventDefault();
        e.stopPropagation();
    }

    function zoomDelta(canvas, delta, x, y, maxZoom = 20, minZoom = 1) {
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        zoom = Math.min(zoom, maxZoom);
        zoom = Math.max(zoom, minZoom);
        const point = {x, y};
        canvas.zoomToPoint(point, zoom);
    }

    function enclose(canvas, object) {
        const {
            br: brRaw,
            tl: tlRaw
        } = object.aCoords;
        const T = canvas.viewportTransform;
        const br = fabric.util.transformPoint(brRaw, T);
        const tl = fabric.util.transformPoint(tlRaw, T);
        const {
            x: left,
            y: top
        } = tl;
        const {
            x: right,
            y: bottom
        } = br;
        const {
            width,
            height
        } = canvas;
        // calculate how far to translate to line up the edge of the object with
        // the edge of the canvas
        const dLeft = Math.abs(right - width);
        const dRight = Math.abs(left);
        const dUp = Math.abs(bottom - height);
        const dDown = Math.abs(top);
        // if the object is larger than the canvas, clamp translation such that
        // we don't push the opposite boundary past the edge
        const maxDx = Math.min(dLeft, dRight);
        const maxDy = Math.min(dUp, dDown);
        const leftIsOver = left < 0;
        const rightIsOver = right > width;
        const topIsOver = top < 0;
        const bottomIsOver = bottom > height;
        const translateLeft = rightIsOver && !leftIsOver;
        const translateRight = leftIsOver && !rightIsOver;
        const translateUp = bottomIsOver && !topIsOver;
        const translateDown = topIsOver && !bottomIsOver;
        const dx = translateLeft ? -maxDx : translateRight ? maxDx : 0;
        const dy = translateUp ? -maxDy : translateDown ? maxDy : 0;
        if (dx || dy) {
            T[4] += dx;
            T[5] += dy;
            canvas.requestRenderAll();
        }
    }

    function getClientPosition(e) {
        const positionSource = e.touches ? e.touches[0] : e;
        const {
            clientX,
            clientY
        } = positionSource;
        return {
            clientX,
            clientY
        };
    }

    function onMouseDown(opt) {
        const {
            e
        } = opt;
        isDragging = true;
        const {
            clientX,
            clientY
        } = getClientPosition(e);
        lastPosX = clientX;
        lastPosY = clientY;
        canvas.selection = false;
        canvas.discardActiveObject();
    }

    function onMouseMove(opt) {
        if (!isDragging) {
            return;
        }
        const {
            e
        } = opt;
        const T = canvas.viewportTransform;
        const {
            clientX,
            clientY
        } = getClientPosition(e);
        T[4] += clientX - lastPosX;
        T[5] += clientY - lastPosY;
        canvas.requestRenderAll();
        lastPosX = clientX;
        lastPosY = clientY;
        enclose(canvas, img);
    }

    function onMouseUp(opt) {
        const {
            x,
            y
        } = opt.absolutePointer;
        canvas.setViewportTransform(canvas.viewportTransform);
        isDragging = false;
        canvas.selection = true;
    }

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

// export const setCanvasPhoto = (selectedPhoto, canvas) => {
//     fabric.Image.fromURL(selectedPhoto).then((img) => {
//         img.set({
//             left: 0,
//             top: 0,
//             scaleX: canvas?.width / img.width,
//             scaleY: canvas?.height / img.height,
//             selectable: true,
//             hasControls: false,
//         });
//         canvas?.add(img);
//         canvas?.setActiveObject(img);
//         canvas?.renderAll();
//     });
// }