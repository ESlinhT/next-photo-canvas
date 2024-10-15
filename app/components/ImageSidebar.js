'use client'

import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Disclosure,
    DisclosureButton,
    DisclosurePanel
} from "@headlessui/react";
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";



export default function ImageSidebar() {
    const [images, setImages] = useState([]);
    const {primaryBorder, setPrimaryBorder, secondaryBorder, setSecondaryBorder, dpi, canvasSize, setCanvasSize, setSelectedPhoto} = useCanvasOptionsContext();
    const [color, setColor] = useColor("#fff");
    const [secondColor, setSecondColor] = useColor("#fff");
    const [open, setOpen] = useState(false);
    const [isGradient, setIsGradient] = useState(false);

    const handleDrop = (newImages) => {
        const imageUrls = newImages.map(file => URL.createObjectURL(file));
        setImages((prevImages) => [...prevImages, ...imageUrls]);
        setSelectedPhoto(imageUrls[0])
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
            id: 'border',
            name: 'Choose a Border',
            options: [
                {value: '', label: 'Choose a border color'}
            ]
        },
    ]

    const onChangeComplete = (color) => setPrimaryBorder(color.hex);

    const onSecondChangeComplete = (secondColor) => setSecondaryBorder(secondColor.hex)

    const handleChooseBorderColor = (isGradient) => {
        setIsGradient(isGradient);
        setOpen(true);
    }

    const handleBorderConfirm = () => {
        setPrimaryBorder(!primaryBorder ? '#fff' : primaryBorder);
        setOpen(false)
    }

    const handleClearBorders = () => {
        setPrimaryBorder(false);
        setSecondaryBorder(false);
        setOpen(false)
    }

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 pb-4">
                <div className="flex h-16 shrink-0 items-center justify-center w-full">
                    <p className="text-white font-bold text-3xl uppercase">Photos</p>
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
                                                section.id === 'border'
                                                    ?
                                                    <div key={optionIdx} className="flex flex-col">
                                                        <button className={`text-white border border-gray-200 px-4 py-1 hover:bg-gray-500 uppercase ${primaryBorder && !secondaryBorder ? 'bg-gray-500' : ''}`} onClick={() => handleChooseBorderColor(false)}>Solid</button>
                                                        <button className={`text-white border border-gray-200 px-4 py-1 hover:bg-gray-500 uppercase ${secondaryBorder ? 'bg-gray-500' : ''}`} onClick={() => handleChooseBorderColor(true)}>Gradient</button>
                                                        <button className="mt-2 text-red-600 font-bold px-4 py-1 hover:text-red-400 uppercase" onClick={handleClearBorders}>Clear</button>
                                                    </div>
                                                    :
                                                    <div key={option.label}
                                                         className="flex items-center w-full justify-center">
                                                        <button
                                                            onClick={() => setCanvasSize(option.value)}
                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                            className={`border py-1 px-4 border-gray-300 text-white focus:ring-indigo-500 ${JSON.stringify(canvasSize) === JSON.stringify(option.value) ? 'bg-gray-500' : ''}`}
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
                                                onClick={() => setSelectedPhoto(url)}
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
                <Dialog open={open} onClose={setOpen} className="relative z-10">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                            >
                                <div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 uppercase">
                                            {isGradient ? 'Choose your colors' : 'Choose a color'}
                                        </DialogTitle>
                                        <div className="mt-2 flex justify-center gap-5">
                                            <ColorPicker
                                                hideInput={["rgb", "hsv"]}
                                                color={color}
                                                onChange={setColor}
                                                onChangeComplete={onChangeComplete}
                                            />
                                            {isGradient &&
                                                <ColorPicker
                                                hideInput={["rgb", "hsv"]}
                                                color={secondColor}
                                                onChange={setSecondColor}
                                                onChangeComplete={onSecondChangeComplete}
                                            />}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={handleBorderConfirm}
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        data-autofocus=""
                                        onClick={handleClearBorders}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
