'use client'

import {createContext, useContext, useEffect, useState} from "react";

import {getCurrentUser} from "../lib/appwrite";


const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [itemsToPurchase, setItemsToPurchase] = useState([]);
    const [saveProject, setSaveProject] = useState(false);

    async function init() {
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch (e) {
            setUser(null);
            console.error(e);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                user,
                loading,
                init,
                itemsToPurchase,
                setItemsToPurchase,
                saveProject,
                setSaveProject
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;