'use client'

import React, {useEffect, useState} from "react";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import AuthCheck from "@/app/components/AuthCheck";
import UserMenu from "@/app/components/UserMenu";
import Loading from "@/app/components/Loading";
import {getSavedProjects} from "@/app/lib/appwrite";
import projectBookImage from '@/app/assets/projectBookImage.png'
import projectPhotoImage from '@/app/assets/projectPhotoImage.jpg'

export default function MyProjects() {
    const {user, loading, setLoading} = useGlobalContext();
    const [projects, setProjects] = useState([]);

    async function getProjects() {
        try {
            const projects = await getSavedProjects();
            setProjects(projects.documents);
        } catch (e) {
            setProjects([]);
            console.error(e);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProjects();
    }, []);


    if (loading) {
        return <Loading/>;
    }
    console.log(projects[0])

    const returnDate = (date) => {
        return new Date(date).toDateString()
    }

    return (
        <>
            {!user ?
                <AuthCheck/>
                : <div className="flex w-full">
                    {/*<Sidebar path="photos"/>*/}
                    <div className="w-full bg-white">
                        <div
                            className="fixed w-full top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white shadow-sm pr-5 right-0">
                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                                <div className="flex items-center">
                                    <UserMenu/>
                                </div>
                            </div>
                        </div>

                        <main className="py-2 mt-14 flex flex-col justify-center items-center">
                            <p className="text-5xl text-sky-500 font-extrabold my-10 uppercase">My Projects</p>
                            <ul role="list"
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {projects.map((item, index) => (
                                    <li
                                        key={index}
                                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-2xl"
                                    >
                                        <div className="flex flex-1 flex-col p-8">
                                            <img alt=""
                                                 src={item.type === 'photobook' ? projectBookImage.src : projectPhotoImage.src}
                                                 className="mx-auto h-32 w-32 flex-shrink-0 "/>
                                            <h3 className="mt-6 text-sm font-bold text-gray-900">{item.name}</h3>
                                            <dl className="mt-1 flex flex-grow flex-col justify-between">
                                                <dt className="sr-only">Title</dt>
                                                <dd className="text-sm text-gray-500">{returnDate(item.$createdAt)}</dd>
                                            </dl>
                                        </div>
                                        <div>
                                            <div className="-mt-px flex divide-x divide-gray-200">
                                                <div className="flex w-0 flex-1">
                                                    <a
                                                        href={``}
                                                        className="relative hover:bg-gray-100 -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                                    >
                                                        Open
                                                    </a>
                                                </div>
                                                <div className="-ml-px flex w-0 flex-1">
                                                    <a
                                                        href={``}
                                                        className="relative hover:bg-gray-100 inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                                    >
                                                        Edit
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </main>
                    </div>
                </div>
            }
        </>
    )
}
