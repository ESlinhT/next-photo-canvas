import * as fabric from "fabric";
import {clearGuideLines, handleObjectMoving} from "@/app/utils/SnappingHelpers";

export const initializeCanvas = (item, canvasRef, setCanvas, guidelines, setGuidelines, canvasSize, selectedPhoto, path, disableHalf, primaryBorder, secondaryBorder, canvasId, addCanvas, projectId, itemDeleted) => {
    let canvasWidth;
    let canvasHeight;
    switch (path) {
        case "photos":
            canvasWidth = canvasSize?.width;
            canvasHeight = canvasSize?.height;
            break;
        case "photobooks":
        case "photobookcover":
            canvasWidth = 1200;
            canvasHeight = canvasSize?.width === canvasSize?.height ? 600 : 800;
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '#fff',
        selection: true,
    });

    if (path !== 'photos' && projectId && !itemDeleted) {
        if (item && item.version) {
            canvas.loadFromJSON(item).then(() => {
                canvas.renderAll()
            });
            setCanvas(canvas)
        }
    }

    if (path === 'photobookcover') {
        const line1 = new fabric.Line([canvas.width / 2 - 15, 0, canvas.width / 2 - 15, canvas.height], {
            strokeDashArray: [3, 3],
            stroke: 'black',
            selectable: false,
        });

        const line2 = new fabric.Line([canvas.width / 2 + 15, 0, canvas.width / 2 + 15, canvas.height], {
            strokeDashArray: [3, 3],
            stroke: 'black',
            selectable: false
        });


        canvas.add(line1, line2);
    }

    if (disableHalf) {
        canvas.on('mouse:down', (options) => {
            const pointer = canvas.getPointer(options.e);
            if (pointer.x < canvas.width / 2) {
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        });

        const boldText = new fabric.Text('Inside Cover', {
            left: canvas.getWidth() / 5.1,
            top: canvas.getHeight() / 2.5,
            fontSize: 20,
            fontWeight: 'bold',
            selectable: false
        });
        const text = new fabric.Text('Note: This must remain empty', {
            left: canvas.getWidth() / 6,
            top: canvas.getHeight() / 2.25,
            fontSize: 15,
            selectable: false
        });

        canvas.add(boldText, text);
        canvas.renderAll()
    }

    // canvas.on('selection:created', (e) => {
    //     setSelectedImage(e.selected[0]);
    // });
    //
    // canvas.on('selection:cleared', () => {
    //     setSelectedImage(null);
    // });

    canvas.on('object:moving', (event) => {
        if (disableHalf && event.target.left < canvas.getWidth() / 2) {
            // Restrict the object to the right half
            event.target.set({left: canvas.getWidth() / 2});
        }
        handleObjectMoving(canvas, event.target, guidelines, setGuidelines)
    })

    canvas.on('object:modified', (event) => {
        clearGuideLines(canvas, event.target, guidelines, setGuidelines)
        const json = canvas.toJSON();
        addCanvas(json, canvasId);
    })

    canvas.on('object:added', () => {
        const json = canvas.toJSON();
        addCanvas(json, canvasId);
    })

    canvas.on('after:render', (e) => {
        const json = canvas.toJSON();
        addCanvas(json, canvasId);
    })

    if (path !== 'photobookcover' && primaryBorder) {
        toggleBorder(primaryBorder, secondaryBorder, canvas);
    }

    if (path === 'photos') {
        // Source: https://github.com/fabricjs/fabric.js/discussions/7052
        canvas.on('mouse:wheel', onMouseWheel);
        canvas.on('mouse:down', onMouseDown);
        canvas.on('mouse:move', onMouseMove);
        canvas.on('mouse:up', onMouseUp);
        let isDragging = false;
        let lastPosX;
        let lastPosY;
        let img;

        if (selectedPhoto || item) {
            fabric.Image.fromURL(selectedPhoto).then((_img) => {
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
                canvas.setActiveObject(img);

                // initialize zoom
                canvas.setZoom(1);

                canvas.requestRenderAll();
            })
        }

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

        function onMouseUp() {
            canvas.setViewportTransform(canvas.viewportTransform);
            isDragging = false;
            canvas.selection = true;
        }
    }

    setCanvas(canvas);

    canvas.renderAll();

    return canvas;
};

export const setupDragAndDrop = (canvasRef, canvas, disableHalf) => {
        const canvasWidth = canvas.getWidth();
        const handleDrop = (e) => {
            e.preventDefault();
            const {offsetX, offsetY} = e;
            const imageUrl = e.dataTransfer.getData('imageUrl');

            if (disableHalf) {
                fabric.Image.fromURL(imageUrl).then((img) => {
                    img.set({
                        left: offsetX < (canvasWidth / 2) ? (canvasWidth / 2) : offsetX,
                        top: offsetY,
                        scaleX: 0.5,
                        scaleY: 0.5,
                        selectable: true,
                    });
                    canvas.add(img);
                    canvas.renderAll();
                });
            } else {
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
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            if (disableHalf) {
                canvas.on('object:moving', (event) => {
                    const obj = event.target;
                    const canvasWidth = canvas.getWidth();

                    // Check if the object is being dragged into the left half
                    if (obj.left < canvasWidth / 2) {
                        // Restrict the object to the right half
                        obj.set({left: canvasWidth / 2});
                        canvas.renderAll();
                    }
                });
            }
        }

        const canvasContainer = canvasRef.current.parentElement;
        canvasContainer.addEventListener('drop', handleDrop);
        canvasContainer.addEventListener('dragover', handleDragOver);

        return () => {
            canvasContainer.removeEventListener('drop', handleDrop);
            canvasContainer.removeEventListener('dragover', handleDragOver);
        };
    }
;

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

export const toggleBookCoverColor = (canvas, color, addCanvas, canvasId) => {
    toggleLineColors(canvas, color.name);
    fabric.Image.fromURL(color.src).then((img) => {
        img.scaleToWidth(1200);
        img.scaleToHeight(1200);
        canvas?.set('backgroundImage', img);
        canvas.src = color.src;
        canvas?.renderAll()
    });
}

export const addText = (canvas) => {
    const text = new fabric.Textbox("Add Text", {
        left: canvas?.getWidth() / 2,
        top: canvas?.getHeight() / 2,
        fontSize: 20,
        fontFamily: "Arial",
        fill: "black",
    });
    canvas?.add(text);
    canvas?.setActiveObject(text);
    canvas?.renderAll();
};

export const displayBookCoverText = (canvas, text) => {
    removeAllTextObjects(canvas);

    const mainText = new fabric.Text(text, {
        fontSize: 50,
        fontFamily: 'Arial',
        fill: 'rgb(209 213 219)',
        top: canvas?.height / 2,
        left: canvas?.width * 0.75,
        selectable: false,
        originX: 'center',
        originY: 'center',
        textAlign: 'center',
        shadow: new fabric.Shadow({
            color: 'rgba(0, 0, 0, 0.8)',
            offsetX: -1,
            offsetY: -1,
            blur: 3,
        }),
    });

    canvas?.add(mainText);
    canvas?.renderAll();
}

const removeAllTextObjects = (canvas) => {
    const textObjects = canvas.getObjects().filter(obj =>
        obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox'
    );

    textObjects.forEach(textObj => canvas.remove(textObj));

    canvas.renderAll();
};

const toggleLineColors = (canvas, bookCoverColor) => {
    const lineObjs = canvas?.getObjects().filter(obj =>
        obj.type === 'line'
    );

    lineObjs?.forEach(lineOjb => {
        switch (bookCoverColor) {
            case 'black':
            case 'green':
                lineOjb.set('stroke', 'gray');
                break;
            default:
                lineOjb.set('stroke', 'black');
        }
    });

    canvas?.renderAll();
};