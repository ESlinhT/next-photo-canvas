'use client'

import {createContext, useContext, useEffect, useState} from "react";
import blackFrame from "@/app/assets/black-frame.png";
import goldFrame from "@/app/assets/gold-frame.png";
import silverFrame from "@/app/assets/silver-frame.png";

const CanvasOptionsContext = createContext();

export const useCanvasOptionsContext = () => useContext(CanvasOptionsContext);

const CanvasOptionsProvider = ({children}) => {
    const dpi = 96;
    const [selectedFrame, setSelectedFrame] = useState(null);
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
                selectedFrame,
                setSelectedFrame,
                frames,
                dpi,
                canvasSize,
                setCanvasSize
            }}
        >
            {children}
        </CanvasOptionsContext.Provider>
    )
}

export default CanvasOptionsProvider;