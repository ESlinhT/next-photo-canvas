'use client'

import React, {useEffect, useState} from "react";
import Loading from "@/app/components/Loading";
import {getSavedProjects} from "@/app/lib/appwrite";
import projectBookImage from '@/app/assets/projectBookImage.png'
import projectPhotoImage from '@/app/assets/projectPhotoImage.png'
import ProjectItemMenu from "@/app/components/ProjectItemMenu";
import AuthLayout from "@/app/layouts/AuthLayout";
import Pagination from "@/app/components/Pagination";

export default function MyProjects() {
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedTypeToSearch, setSelectedTypeToSearch] = useState('all');
    const [nameToSearch, setNameToSearch] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [pageSize, setPageSize] = useState(8); // Allow dynamic control of items per page
    const [currentPage, setCurrentPage] = useState(1);

    const notificationMethods = [
        {id: 'date', title: 'Date'},
        {id: 'name', title: 'Name'},
    ]

    async function getProjects() {
        try {
            const retrievedProjects = await getSavedProjects();
            setProjects(retrievedProjects.documents);
            setProjectTypes([...new Set(retrievedProjects.documents.map(project => project.type))]);
        } catch (e) {
            setProjects([]);
            console.error(e);
        } finally {
            setProjectsLoading(false);
        }
    }

    const returnFilteredProjects = (type, name) => {
        const filtered = projects
            .filter((project) => {
                const matchesType = type === 'all' || project.type.toLowerCase() === type.toLowerCase();
                const matchesName = name === '' || project.name.toLowerCase().includes(name.toLowerCase());
                return matchesType && matchesName;
            })
            .sort((a, b) => {
                if (sortBy === 'date') return new Date(b.$createdAt) - new Date(a.$createdAt);
                if (sortBy === 'name') return a.name.localeCompare(b.name);
                return 0;
            });

        setFilteredProjects(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const returnCurrentItems = () => {
        const indexOfLastItem = currentPage * pageSize;
        const indexOfFirstItem = indexOfLastItem - pageSize;
        return filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
    };

    const returnDate = (date) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    const handleSelectTypeChange = (e) => {
        setSelectedTypeToSearch(e.target.value)
    }

    useEffect(() => {
        getProjects();
    }, []);

    useEffect(() => {
        returnFilteredProjects(selectedTypeToSearch, nameToSearch)
    }, [projects, selectedTypeToSearch, nameToSearch]);

    return (
        <AuthLayout path="my projects">
            <main className="pb-14 lg:px-44 flex flex-col justify-center items-center w-full">
                <div className="items-start px-20 lg:px-0 lg:min-h-[75vh] mb-10 w-full">
                    <p className="text-4xl lg:text-5xl text-sky-500 font-extrabold mb-10 uppercase">My Projects</p>
                    <span className="block text-xs font-bold text-gray-500">Project Type</span>
                    <div className="flex flex-col lg:flex-row lg:justify-between">
                        <div>
                            <div className="mb-2 lg:mb-16 flex flex-col lg:flex-row lg:items-center">
                                <div className="mt-2">
                                    <select
                                        disabled={projectsLoading}
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
                                            disabled={projectsLoading}
                                            id="projectName"
                                            name="projectName"
                                            type="text"
                                            placeholder="Search Project"
                                            value={nameToSearch}
                                            onChange={(e) => setNameToSearch(e.target.value)}
                                            autoComplete="projectName"
                                            className="block w-[12rem] lg:w-[20rem] flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3 mb-16">
                            <span
                                className="flex items-center text-sm lg:text-xl font-bold text-gray-500 pl-1">Sort By: </span>
                            {notificationMethods.map((notificationMethod) => (
                                <div key={notificationMethod.id} className="flex items-center">
                                    <input
                                        disabled={projectsLoading}
                                        checked={notificationMethod.id === sortBy}
                                        id={notificationMethod.id}
                                        value={notificationMethod.id}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        name="notification-method"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                                    />
                                    <label
                                        htmlFor={notificationMethod.id}
                                        className="ml-2 block text-sm font-medium text-gray-500"
                                    >
                                        {notificationMethod.title}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {projectsLoading ? <Loading height='h-1/2'/> : (
                        <ul role="list"
                            className={`${projects.length ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'flex justify-center h-full'}`}>
                            {projects.length ? returnCurrentItems().map((item, index) => (
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
                                className="text-center text-4xl text-gray-400 w-full">There are no saved projects.</span>}
                        </ul>
                    )}
                </div>
                <Pagination
                    totalItems={filteredProjects.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </main>
        </AuthLayout>
    )
}
