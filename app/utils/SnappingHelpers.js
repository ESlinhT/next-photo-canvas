import {Line} from 'fabric';

const snappingDistance = 10;

export const handleObjectMoving = (canvas, obj, guidelines, setGuidelines) => {
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const left = obj.left;
    const top = obj.top;

    const centerX = left + (obj.width * obj.scaleX) / 2;
    const centerY = top + (obj.height * obj.scaleY) / 2;

    clearGuideLines(canvas);

    if (Math.abs(left) < snappingDistance) {
        obj.set({left: 0});
        if (!guidelineExists(canvas, 'vertical-left')) {
            const line = createVerticalGuideline(canvas, 0, 'vertical-left');
            canvas.add(line);
        }
    }

    if (Math.abs(top) < snappingDistance) {
        obj.set({top: 0});
        if (!guidelineExists(canvas, 'horizontal-left')) {
            const line = createHorizontalGuideline(canvas, 0, 'horizontal-top');
            canvas.add(line);
        }
    }

    if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
        obj.set({left: canvasWidth / 2 - (obj.width * obj.scaleX) / 2});
        if (!guidelineExists(canvas, 'vertical-center')) {
            const line = createVerticalGuideline(canvas, canvasWidth / 2, 'vertical-center');
            canvas.add(line);
        }
    }

    if (Math.abs(centerY - canvasHeight / 2) < snappingDistance) {
        obj.set({top: canvasHeight / 2 - (obj.height * obj.scaleY) / 2});
        if (!guidelineExists(canvas, 'horizontal-center')) {
            const line = createHorizontalGuideline(canvas, canvasHeight / 2, 'horizontal-center');
            canvas.add(line);
        }
    }

    canvas.renderAll();
};

export const createVerticalGuideline = (canvas, x, id) => {
    return new Line([x, 0, x, canvas.height], {
        id,
        stroke: 'red',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5,5],
        opacity: 0.8,
    })
}

export const createHorizontalGuideline = (canvas, y, id) => {
    return new Line([0, y, canvas.width, y], {
        id,
        stroke: 'red',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5,5],
        opacity: 0.8,
    })
}

export const clearGuideLines = (canvas) => {
    const objects = canvas.getObjects('line');
    objects.forEach((obj) => {
        if (obj.id && obj.id?.startsWith('vertical-') || obj.id?.startsWith('horizontal-')) {
            canvas.remove(obj)
        }
    });
    canvas.renderAll();
}

const guidelineExists = (canvas, id) => {
    const objects = canvas.getObjects('line');
    return objects.some((obj) => obj.id === id);
}