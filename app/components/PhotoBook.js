import React, {useState} from 'react';
import PhotoCanvas from './PhotoCanvas';

export default function PhotoBook() {
    const [pages, setPages] = useState([[], []]);
    const addNewPage = () => {
        setPages([...pages, []])
    }
    const deletePage = (targetIndex) => {
        const newPages = pages.filter((page, index) => index !== targetIndex)
        setPages(newPages)
    }
    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-2xl text-gray-500">Cover</h2>
            <div className="h-[2px] bg-gray-300 w-[300px] mb-3"></div>
            <div className="flex flex-row mb-5 relative">
                <div className="border-2 border-gray-300 my-1 px-2 relative">
                    <PhotoCanvas path="photobookcover"/>
                </div>
            </div>
            <h2 className="text-2xl text-gray-500">Photos</h2>
            <div className="h-[2px] bg-gray-300 w-[300px] mb-3"></div>
            <div className="grid grid-cols-2">
                {pages.map((images, index) => (
                    <div key={index} className="border-2 border-gray-300 my-1 p-2 relative">
                        <h3>Page {index + 1}</h3>
                        <PhotoCanvas images={images} path="photobooks" index={index}/>
                        <button onClick={() => deletePage(index)}
                                className="absolute right-0 top-0 p-2 hover:text-red-600">Delete
                        </button>
                    </div>
                ))}
            </div>
            <button className="hover:bg-indigo-400 bg-indigo-700 text-white px-3 py-1 mt-1" onClick={addNewPage}>Add New Page</button>
        </div>
    )
}
