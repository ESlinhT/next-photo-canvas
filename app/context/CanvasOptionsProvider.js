'use client'

import {createContext, useContext, useState} from "react";
import blackFrame from "@/app/assets/black-frame.png";
import goldFrame from "@/app/assets/gold-frame.png";
import silverFrame from "@/app/assets/silver-frame.png";

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
    const frames = [
        blackFrame,
        goldFrame,
        silverFrame
    ];

    return (
        <CanvasOptionsContext.Provider
            value={{
                primaryBorder,
                setPrimaryBorder,
                secondaryBorder,
                setSecondaryBorder,
                frames,
                dpi,
                canvasSize,
                setCanvasSize,
                selectedPhoto,
                setSelectedPhoto
            }}
        >
            {children}
        </CanvasOptionsContext.Provider>
    )
}

export default CanvasOptionsProvider;