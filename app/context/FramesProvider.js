'use client'

import {createContext, useContext, useEffect, useState} from "react";
import blackFrame from "@/app/assets/black-frame.png";
import goldFrame from "@/app/assets/gold-frame.png";
import geometricFrame from "@/app/assets/geometric-frame.png";

const FramesContext = createContext();

export const useFramesContext = () => useContext(FramesContext);

const FramesProvider = ({children}) => {
    const [selectedFrame, setSelectedFrame] = useState(null)
    const frames = [
        blackFrame,
        goldFrame,
        geometricFrame
    ];

    return (
        <FramesContext.Provider
            value={{
                selectedFrame,
                setSelectedFrame,
                frames
            }}
        >
            {children}
        </FramesContext.Provider>
    )
}

export default FramesProvider;