'use client'

import React, {useEffect, useRef, useState} from 'react';
import {useCanvasOptionsContext} from "@/app/context/CanvasOptionsProvider";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel
} from "@headlessui/react";
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";
import {ColorPicker, useColor} from "react-color-palette";
import "react-color-palette/css";
import ReusableDialog from "@/app/components/ReusableDialog";


export default function Sidebar({path, isHidden = false, type = 'photobook', images, setImages}) {
    const {
        primaryBorder,
        setPrimaryBorder,
        secondaryBorder,
        setSecondaryBorder,
        dpi,
        canvasSize,
        setCanvasSize,
        setSelectedPhoto,
    } = useCanvasOptionsContext();
    const [color, setColor] = useColor("#fff");
    const [secondColor, setSecondColor] = useColor("#fff");
    const [open, setOpen] = useState(false);
    const [isGradient, setIsGradient] = useState(false);
    const inputRef = useRef(null);
    const styles = isHidden
        ? 'flex grow flex-col gap-y-5 bg-gray-900 pb-4 ring-1 ring-white/10'
        : 'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:flex-col';

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader()

                reader.onabort = () => console.log('file reading was aborted')
                reader.onerror = () => console.log('file reading has failed')
                reader.onload = () => {
                    setImages((prevImages) => [...prevImages, reader.result]);
                }
                reader.readAsDataURL(files[i])
            }
        }
    };

    const filters = [
        {
            id: 'size',
            name: 'Choose a Size',
            options: [
                {value: {height: 4 * dpi, width: 6 * dpi}, label: '4x6'},
                {value: {height: 6 * dpi, width: 4 * dpi}, label: '6x4'},
                {value: {height: 5 * dpi, width: 7 * dpi}, label: '5x7'},
                {value: {height: 7 * dpi, width: 5 * dpi}, label: '7x5'},
                {value: {height: 10 * dpi, width: 12 * dpi}, label: '10x12'},
                {value: {height: 12 * dpi, width: 10 * dpi}, label: '12x10'},
                {value: {height: 5 * dpi, width: 5 * dpi}, label: '5x5'},
                {value: {height: 7 * dpi, width: 7 * dpi}, label: '7x7'},
                {value: {height: 8 * dpi, width: 8 * dpi}, label: '8x8'},
                {value: {height: 10 * dpi, width: 10 * dpi}, label: '10x10'},
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

    const returnImage = (file, index) => {
        return (
            <img
                key={index}
                src={file}
                alt={`img-${index}`}
                className="cursor-pointer h-[100px] w-[150px] mb-2 border"
                onClick={() => path === 'photos' && setSelectedPhoto(file)}
                draggable={true}
                onDragStart={(e) => e.dataTransfer.setData('imageUrl', file)}
            />
        )
    }

    const handleFileInputClick = () => {
        inputRef.current.click();
    }

    useEffect(() => {
       if (images.length > 0 && (path === 'photos' || path === 'my projects')) {
           setSelectedPhoto(images[0])
       }
    }, [images]);

    return (
        <div className={styles}>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 pb-4">
                <div className="flex h-16 shrink-0 items-center justify-center w-full">
                    <p className="text-white font-bold text-xl uppercase text-center">{path}</p>
                </div>
                <nav className="flex flex-1 flex-col px-6">
                    <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                            {path !== 'my projects' ? filters.map((section, index) => (
                                <Disclosure key={section.id} as="div"
                                            className={`${index === 0 ? '' : 'border-t border-gray-200'} relative py-6 ${type.includes('photobook') && section.id === 'border' ? 'hidden' : ''}`}>
                                    <h3 className="-mx-2 -my-3 flow-root">
                                        <DisclosureButton
                                            className="group flex w-full items-center justify-between bg-transparent px-2 py-3 text-white hover:text-gray-500">
                                            <span className="font-medium text-sm">{section.name}</span>
                                            <span className="ml-6 flex items-center">
                                              <PlusIcon aria-hidden="true"
                                                        className="h-5 w-5 group-data-[open]:hidden"/>
                                              <MinusIcon aria-hidden="true"
                                                         className="h-5 w-5 [.group:not([data-open])_&]:hidden"/>
                                            </span>
                                        </DisclosureButton>
                                    </h3>
                                    <DisclosurePanel className="pt-6">
                                        <div
                                            className={`${section.id === 'border' ? 'flex flex-col' : 'grid grid-cols-2 gap-y-2'}`}>
                                            {section.options.map((option, optionIdx) => (
                                                section.id === 'border'
                                                    ?
                                                    <div key={optionIdx}
                                                         className={`${type === 'photobook' ? 'hidden' : 'flex'} flex-col justify-center items-center`}>
                                                        <button
                                                            className={`w-[120px] text-white border border-gray-200 px-4 py-1 hover:bg-gray-500 uppercase ${primaryBorder && !secondaryBorder ? 'bg-gray-500' : ''}`}
                                                            onClick={() => handleChooseBorderColor(false)}>Solid
                                                        </button>
                                                        <button
                                                            className={`w-[120px] text-white border border-gray-200 px-4 py-1 hover:bg-gray-500 uppercase ${secondaryBorder ? 'bg-gray-500' : ''}`}
                                                            onClick={() => handleChooseBorderColor(true)}>Gradient
                                                        </button>
                                                        <button
                                                            className="mt-2 text-red-600 font-bold px-4 py-1 hover:text-red-400 uppercase"
                                                            onClick={handleClearBorders}>Clear
                                                        </button>
                                                    </div>
                                                    :
                                                    <div key={option.label}
                                                         className={`flex justify-center`}>
                                                        <button
                                                            onClick={() => setCanvasSize(option.value)}
                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                            className={`w-[60px] border border-gray-300 text-white focus:ring-indigo-500 ${JSON.stringify(canvasSize) === JSON.stringify(option.value) ? 'bg-gray-500' : ''}`}
                                                        >{option.label}</button>
                                                    </div>
                                            ))}
                                        </div>
                                    </DisclosurePanel>
                                </Disclosure>
                            )) : <div className="flex flex-col justify-center text-white ">
                                <a href="/photos" className="py-1 px-2 border border-white mb-2 hover:bg-gray-400 text-center">Create a Photo</a>
                                <a href="/photobooks" className="py-1 px-2 border border-white mb-2 hover:bg-gray-400 text-center">Create a PhotoBook</a>
                            </div>}
                        </li>
                        <li className={`${path !== 'my projects' ? 'block' : 'hidden'}`}>
                            <ul className="-mx-2 space-y-1">
                                <div className="w-full p-2">
                                    <div onClick={handleFileInputClick}
                                         className="w-full border border-gray-200 p-2 cursor-pointer text-center text-white font-bold uppercase hover:bg-gray-400">
                                        <input multiple ref={inputRef} type="file" className="hidden"
                                               onChange={handleFileChange}/>
                                        <p className="text-sm">Upload some images</p>
                                    </div>
                                    <div className="flex flex-col items-center overflow-y-scroll h-[75vh] mt-4">
                                        {images.length
                                            ? images.map((file, index) => (returnImage(file, index)))
                                            : <p className="text-white text-center text-sm">There are no images</p>}
                                    </div>
                                </div>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <ReusableDialog
                    open={open}
                    setOpen={setOpen}
                    title={isGradient ? 'Choose your colors' : 'Choose a color'}
                    handleConfirm={handleBorderConfirm}
                    handleCancel={handleClearBorders}
                >
                    <div className={`flex justify-center gap-5 scale-75 lg:scale-100`}>
                        <ColorPicker
                            hideInput={["rgb", "hsv"]}
                            color={color}
                            onChange={setColor}
                            onChangeComplete={onChangeComplete}
                        />
                        {isGradient && (
                            <ColorPicker
                                hideInput={["rgb", "hsv"]}
                                color={secondColor}
                                onChange={setSecondColor}
                                onChangeComplete={onSecondChangeComplete}
                            />
                        )}
                    </div>
                </ReusableDialog>
            </div>
        </div>
    )
}
