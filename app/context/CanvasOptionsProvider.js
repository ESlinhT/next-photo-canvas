'use client'

import {createContext, useContext, useState} from "react";

import creme from "@/app/assets/creme-linen.jpeg";
import beige from "@/app/assets/beige-linen.jpeg";
import blue from "@/app/assets/blue-linen.jpeg";
import black from "@/app/assets/black-linen.jpeg";
import gray from "@/app/assets/gray-linen.jpg";
import green from "@/app/assets/green-linen.jpeg";
import red from "@/app/assets/red-linen.jpg";

const CanvasOptionsContext = createContext();

export const useCanvasOptionsContext = () => useContext(CanvasOptionsContext);

const CanvasOptionsProvider = ({children}) => {
    const dpi = 96;
    const [primaryBorder, setPrimaryBorder] = useState(false);
    const [secondaryBorder, setSecondaryBorder] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(false);
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
                bookCoverColors
            }}
        >
            {children}
        </CanvasOptionsContext.Provider>
    )
}

export default CanvasOptionsProvider;