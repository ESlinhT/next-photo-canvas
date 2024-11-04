import React, {useEffect, useState} from 'react';
import PhotoCanvas from './PhotoCanvas';
import {ArrowLongDownIcon, ArrowLongRightIcon} from "@heroicons/react/16/solid";
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";

export default function PhotoBook({content = [], projectId = null, projectName = ''}) {
    const {canvasSize, dpi} = useCanvasOptionsContext();
    const [pages, setPages] = useState([[], []]);
    const [parsedItem, setParsedItem] = useState(null);

    useEffect(() => {
        if (content.length) {
            const filteredContent = content
                .filter((item) => item.canvasId !== 'canvasBookCover' && item.canvasId !== 'canvasSize')
                .sort((a, b) => {
                    const numA = parseInt(a.canvasId.split('-')[1], 10);
                    const numB = parseInt(b.canvasId.split('-')[1], 10);

                    return numA - numB;
                });
            setPages(filteredContent);

            const parsedItem = content.find((item) => item.canvasId === 'canvasBookCover') ?? null;
            setParsedItem(parsedItem)
        }
    }, []);

    const addNewPage = () => {
        setPages([...pages, []])
    }
    const deletePage = (targetIndex) => {
        const newPages = pages.filter((page, index) => index !== targetIndex)
        setPages(newPages)
    }

    return (
        <div className="flex flex-col items-center w-full relative">
            <h2 className="text-2xl text-gray-500">Cover</h2>
            <div className="h-[2px] bg-gray-300 w-[300px] mb-3"></div>
            <div className="flex flex-row mb-8 relative">
                <div className="vertical-text absolute -left-8 bottom-2 flex justify-center items-center">
                    <p className="text-gray-500 text-sm">{canvasSize.height / dpi} in </p> <ArrowLongDownIcon aria-hidden="true" className="h-[30px] w-10 text-gray-400"/>
                </div>
                <div className="border-2 border-gray-300 my-1 px-2 relative">
                    <PhotoCanvas item={parsedItem} path="photobookcover" canvasId={`canvasBookCover`} projectId={projectId} existingProjectName={projectName}/>
                </div>
                <div className="absolute left-1 -bottom-6 flex justify-center items-center">
                    <p className="text-gray-500 text-sm">{canvasSize.width / dpi} in </p> <ArrowLongRightIcon aria-hidden="true" className="h-[30px] w-8 text-gray-400"/>
                </div>
            </div>
            <h2 className="text-2xl text-gray-500">Photos</h2>
            <div className="h-[2px] bg-gray-300 w-[300px] mb-3"></div>
            <div className="flex flex-col justify-center">
                {pages.map((content, index) => (
                    <div key={index} className="border-2 border-gray-300 mt-4 mb-6 p-2 relative">
                        <div className="vertical-text absolute -left-8 bottom-2 flex justify-center items-center">
                            <p className="text-gray-500 text-sm">{canvasSize.height / dpi} in </p> <ArrowLongDownIcon
                            aria-hidden="true" className="h-[30px] w-10 text-gray-400"/>
                        </div>
                        <h3>Pages {index + (index + 1)} and {index + (index + 2)}</h3>
                        <PhotoCanvas
                            item={content ?? null}
                            path="photobooks"
                            disableHalf={index === 0}
                            canvasId={`canvas-${index}`}
                            projectId={projectId}
                            existingProjectName={projectName}
                        />
                        <button onClick={() => deletePage(index)}
                                className="absolute right-0 top-0 p-2 hover:text-red-600">Delete
                        </button>
                        <div className="absolute left-1 -bottom-7 flex justify-center items-center">
                            <p className="text-gray-500 text-sm">{canvasSize.width / dpi} in </p> <ArrowLongRightIcon
                            aria-hidden="true" className="h-[30px] w-8 text-gray-400"/>
                        </div>
                    </div>
                ))}
            </div>
            <button className="hover:bg-indigo-400 bg-indigo-700 text-white px-3 py-1 mt-1" onClick={addNewPage}>Add Pages
            </button>
        </div>
    )
}
