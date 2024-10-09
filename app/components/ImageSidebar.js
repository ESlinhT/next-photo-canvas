'use client'

import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Image from "next/image";
import {useFramesContext} from "@/app/context/FramesProvider";
import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react";
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";


export default function ImageSidebar({dpi, canvasSize, setCanvasSize}) {
    const [images, setImages] = useState([]);
    const {frames, selectedFrame, setSelectedFrame} = useFramesContext();

    const handleDrop = (newImages) => {
        const imageUrls = newImages.map(file => URL.createObjectURL(file));
        setImages((prevImages) => [...prevImages, ...imageUrls])
    }

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: handleDrop,
        accepted: {
            accepted: ['image/*']
        }
    });

    const filters = [
        {
            id: 'size',
            name: 'Choose a Size',
            options: [
                {value: {height: 6 * dpi, width: 4 * dpi}, label: '4x6'},
                {value: {height: 5 * dpi, width: 5 * dpi}, label: '5x5'},
                {value: {height: 7 * dpi, width: 5 * dpi}, label: '5x7'},
                {value: {height: 10 * dpi, width: 12 * dpi}, label: '10x12'},
            ],
        },
        {
            id: 'frame',
            name: 'Choose a Frame',
            options: frames.map((frame, index) => {
                return {
                    value: frame,
                    label: index + 1000
                }
            }),
        },
    ]

    console.log(canvasSize, filters[0].options[2].value)
    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 pb-4">
                <div className="flex h-16 shrink-0 items-center justify-center w-full">
                    <p className="text-white font-bold text-3xl uppercase">Images</p>
                </div>
                <nav className="flex flex-1 flex-col px-6">
                    <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                            {filters.map((section, index) => (
                                <Disclosure key={section.id} as="div" className={`${index === 0 ? '' : 'border-t border-gray-200'} relative px-4 py-6`}>
                                    <h3 className="-mx-2 -my-3 flow-root">
                                        <DisclosureButton
                                            className="group flex w-full items-center justify-between bg-transparent px-2 py-3 text-white hover:text-gray-500">
                                            <span className="font-medium">{section.name}</span>
                                            <span className="ml-6 flex items-center">
                                              <PlusIcon aria-hidden="true"
                                                        className="h-5 w-5 group-data-[open]:hidden"/>
                                              <MinusIcon aria-hidden="true"
                                                         className="h-5 w-5 [.group:not([data-open])_&]:hidden"/>
                                            </span>
                                        </DisclosureButton>
                                    </h3>
                                    <DisclosurePanel className="pt-6">
                                        <div className="flex flex-col items-center space-y-4">
                                            {section.options.map((option, optionIdx) => (
                                                section.id === 'frame'
                                                    ?
                                                    <Image
                                                        key={option.label}
                                                        src={option.value ?? ''}
                                                        alt={`frame-${option.value}`}
                                                        // TODO: figure out why selectedFrame doesn't match option.value
                                                        className={`cursor-pointer h-[100px] w-[150px] mb-2 border ${selectedFrame === option.value ? 'border-gray-200 border-[5px] h-[110px] w-[160px]' : ''}`}
                                                        onClick={() => setSelectedFrame(option.value)}
                                                        priority={true}
                                                    />
                                                    :
                                                    <div key={option.label}
                                                         className="flex items-center w-full justify-center">
                                                        <button
                                                            onClick={() => setCanvasSize(option.value)}
                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                            className={`border py-1 px-4 border-gray-300 text-white focus:ring-indigo-500 ${canvasSize === option.value ? 'bg-gray-500' : ''}`}
                                                        >{option.label}</button>
                                                    </div>
                                            ))}
                                        </div>
                                    </DisclosurePanel>
                                </Disclosure>
                            ))}
                        </li>
                        <li>
                            <ul className="-mx-2 space-y-1">
                                <div className="w-full p-2">
                                    <div {...getRootProps()}
                                         className="border border-gray-200 p-2 cursor-pointer text-center text-white font-bold uppercase hover:bg-gray-400">
                                        <input {...getInputProps()} />
                                        <p>Upload some images</p>
                                    </div>
                                    <div className="flex flex-col items-center overflow-y-scroll h-[75vh] mt-4">
                                        {images.length ? images.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`img-${index}`}
                                                className="cursor-pointer h-[100px] w-[150px] mb-2 border"
                                                draggable={true}
                                                onDragStart={(e) => e.dataTransfer.setData('imageUrl', url)}
                                            />
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
