// import React, {useState} from 'react'
//
// export default function ImageSidebar({onImagesSelected}) {
//     const [imageUrls, setImageUrls] = useState([]);
//     const handleImageUpload = (e) => {
//         const files = e.target.files;
//         const urls = Array.from(files).map((file) => URL.createObjectURL(file));
//         setImageUrls((prevUrls) => [...prevUrls, ...urls]);
//         onImagesSelected(urls);
//     }
//     return (
//         <div className="w-[200px] bg-[#f4f4f4] p-2 overflow-y-scroll">
//             <label>
//                 <p className="text-2xl text-white border-2 p-2 bg-blue-500 hover:bg-blue-400 cursor-pointer text-center rounded-xl">Select photos</p>
//                 <input className="hidden" type="file" multiple onChange={handleImageUpload}/>
//             </label>
//             <div className="mt-2">
//                 {imageUrls.map((url, index) => (
//                     <img
//                         key={index}
//                         src={url}
//                         alt={`img-${index}`}
//                         className="mb-1 cursor-pointer h-[100] w-[150]"
//                         draggable={true}
//                         onDragStart={(e) => e.dataTransfer.setData('imageUrl', url)}
//                     />
//                 ))}
//             </div>
//         </div>
//     )
// }

'use client'
import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';

export default function ImageSidebar() {
    const [images, setImages] = useState([]);

    const handleDrop = (newImages) => {
        const imageUrls = newImages.map(file => URL.createObjectURL(file));
        setImages((prevImages) => [...prevImages, ...imageUrls])
    }

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*'
    });
    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 pb-4">
                <div className="flex h-16 shrink-0 items-center justify-center w-full">
                    <p className="text-white font-bold text-3xl uppercase">Images</p>
                </div>
                <nav className="flex flex-1 flex-col px-6">
                    <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul className="-mx-2 space-y-1">
                                <div className="w-[250px] p-2">
                                    <div {...getRootProps()}
                                         className="border border-gray-200 p-2 cursor-pointer text-center text-white font-bold uppercase hover:bg-gray-400">
                                        <input {...getInputProps()} />
                                        <p>Upload some images</p>
                                    </div>
                                    <div className="flex flex-col items-center overflow-y-scroll h-[85vh] mt-4">
                                        {images.length ? images.map((url, index) => (
                                            <>
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`img-${index}`}
                                                    className="cursor-pointer h-[100px] w-[150px] mb-2 border"
                                                    draggable={true}
                                                    onDragStart={(e) => e.dataTransfer.setData('imageUrl', url)}
                                                />
                                            </>
                                        )) : <p className="text-white text-center">There are no images</p>}
                                    </div>
                                </div>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}
