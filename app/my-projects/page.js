'use client'

import React, {useEffect, useState} from "react";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import AuthCheck from "@/app/components/AuthCheck";
import UserMenu from "@/app/components/UserMenu";
import Loading from "@/app/components/Loading";
import {getSavedProjects} from "@/app/lib/appwrite";
import projectBookImage from '@/app/assets/projectBookImage.png'
import projectPhotoImage from '@/app/assets/projectPhotoImage.png'
import ProjectItemMenu from "@/app/components/ProjectItemMenu";

export default function MyProjects() {
    const {user, loading, setLoading} = useGlobalContext();
    const [projects, setProjects] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedTypeToSearch, setSelectedTypeToSearch] = useState('all');
    const [nameToSearch, setNameToSearch] = useState('');

    async function getProjects() {
        try {
            setLoading(true)
            const retrievedProjects = await getSavedProjects();
            setProjects(retrievedProjects.documents);
            const types = retrievedProjects.documents.map(project => project.type);
            const removedDuplicateTypes = types.filter(function (item, pos, self) {
                return self.indexOf(item) === pos;
            })
            setProjectTypes(removedDuplicateTypes);
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

    const returnDate = (date) => {
        return new Date(date).toDateString()
    }

    const handleSelectTypeChange = (e) => {
        setSelectedTypeToSearch(e.target.value)
    }

    const returnFilteredProjects = (type, name, projects) => {
        return projects.filter((project) => {
            const matchesType = type === 'all' || project.type.toLowerCase() === type.toLowerCase();
            const matchesName = name === '' || project.name.toLowerCase().includes(name.toLowerCase());
            return matchesType && matchesName;
        });
    }

    return (
        <>
            {!user ?
                <AuthCheck/>
                :
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
                        <div className="items-start">
                            <p className="text-5xl text-sky-500 font-extrabold my-10 uppercase textst">My Projects</p>
                            <span className="block text-xs font-bold text-gray-500">Project Type</span>
                            <div className="mb-16 flex items-center">
                                <div className="mt-2">
                                    <select
                                        id="projectType"
                                        name="projectType"
                                        value={selectedTypeToSearch}
                                        onChange={handleSelectTypeChange}
                                        autoComplete="projectType"
                                        className="block rounded-md border-0 p-1.5 mr-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                                    >
                                        <option value="all">All</option>
                                        {projectTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="mt-2">
                                    <div
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-lg">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Search Project"
                                            value={nameToSearch}
                                            onChange={(e) => setNameToSearch(e.target.value)}
                                            autoComplete="username"
                                            className="block w-[20rem] flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <ul role="list"
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {projects.length ? returnFilteredProjects(selectedTypeToSearch, nameToSearch, projects).map((item, index) => (
                                    <li
                                        key={index}
                                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-2xl border border-gray-200"
                                    >
                                        <a href={`/my-projects/${item.$id}`}
                                           className="flex flex-1 flex-col p-4 hover:bg-gray-100">
                                            <dl className="mb-3 flex flex-grow flex-col justify-between">
                                                <dt className="sr-only">Title</dt>
                                                <dd className="text-md font-bold text-gray-300 uppercase">{item.type}</dd>
                                            </dl>
                                            <img alt=""
                                                 src={item.type === 'photobook' ? projectBookImage.src : projectPhotoImage.src}
                                                 className="mx-auto h-40 w-50 flex-shrink-0 "/>
                                            <h3 className="mt-6 text-sm font-bold text-gray-900 uppercase">{item.name}</h3>
                                            <dl className="mt-1 flex flex-grow flex-col justify-between">
                                                <dt className="sr-only">Title</dt>
                                                <dd className="text-sm text-gray-500">{returnDate(item.$createdAt)}</dd>
                                            </dl>
                                        </a>
                                        <div>
                                            <div className="-mt-px flex divide-x divide-gray-200">
                                                <div className="flex w-0 flex-1">
                                                    <a
                                                        href={`/my-projects/${item.$id}`}
                                                        className="relative hover:bg-gray-100 -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                                    >
                                                        Open
                                                    </a>
                                                </div>
                                                <div className="-ml-px flex w-0 flex-1">
                                                    <ProjectItemMenu item={item} getProjects={getProjects}/>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )) : <span
                                    className="text-center text-4xl text-gray-500">There are no saved projects</span>}
                            </ul>
                        </div>
                    </main>
                </div>
            }
        </>
    )
}
