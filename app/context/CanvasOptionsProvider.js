'use client'

import {createContext, useContext, useState} from "react";

import creme from "@/app/assets/creme-linen.jpeg";
import beige from "@/app/assets/beige-linen.jpeg";
import blue from "@/app/assets/blue-linen.jpeg";
import black from "@/app/assets/black-linen.jpeg";
import gray from "@/app/assets/gray-linen.jpeg";
import green from "@/app/assets/green-linen.jpeg";
import red from "@/app/assets/red-linen.jpg";

const CanvasOptionsContext = createContext();

export const useCanvasOptionsContext = () => useContext(CanvasOptionsContext);

const CanvasOptionsProvider = ({children}) => {
    const dpi = 96;
    const [primaryBorder, setPrimaryBorder] = useState(false);
    const [secondaryBorder, setSecondaryBorder] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(false);
    const [itemsToSave, setItemsToSave] = useState([]);
    const [lastOffset, setLastOffset] = useState({ x: 0, y: 0, zoom: 0 });
    const [viewport, setViewport] = useState([]);
    const [canvasSize, setCanvasSize] = useState({
        height: 7 * dpi,
        width: 5 * dpi,
    });

    const bookCoverColors = [
        {
            name: 'black',
            src: black.src,
        },
        {
            name: 'red',
            src: red.src,
        },
        {
            name: 'blue',
            src: blue.src,
        },
        {
            name: 'green',
            src: green.src,
        },
        {
            name: 'gray',
            src: gray.src,
        },
        {
            name: 'beige',
            src: beige.src,
        },
        {
            name: 'creme',
            src: creme.src,
        },
    ];
    const addCanvas = (canvasData = {}, canvasId) => {
        if (canvasData !== {}) {
            canvasData.canvasId = canvasId;

            setItemsToSave((prevItems) => {
                const updatedItems = prevItems.filter(item => item?.canvasId !== canvasId && item !== undefined && item?.canvasId !== 'canvasSize');
                return [...updatedItems, canvasData];
            });
        }
    };

    return (
        <CanvasOptionsContext.Provider
            value={{
                primaryBorder,
                setPrimaryBorder,
                secondaryBorder,
                setSecondaryBorder,
                dpi,
                canvasSize,
                setCanvasSize,
                selectedPhoto,
                setSelectedPhoto,
                bookCoverColors,
                itemsToSave,
                setItemsToSave,
                lastOffset,
                setLastOffset,
                viewport,
                setViewport,
                addCanvas
            }}
        >
            {children}
        </CanvasOptionsContext.Provider>
    )
}

export default CanvasOptionsProvider;