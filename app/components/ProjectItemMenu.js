'use client';

import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {EllipsisHorizontalIcon} from "@heroicons/react/20/solid";
import {createSavedProject, deleteSavedProject, signOut} from "@/app/lib/appwrite";
import {useRouter} from "next/navigation";

const itemOptions = [{name: 'Duplicate'}, {name: 'Delete'},];

export default function ProjectItemMenu({item, getProjects, setLoading}) {
    const router = useRouter();

    const handleItemClick = async (name) => {
        setLoading(true);
        if (name === 'Duplicate') {
            await createSavedProject(`${item.name} - duplicate`, item.content, item.type)
                .then(() => {
                    getProjects();
                    router.refresh();
                })
        } else {
            await deleteSavedProject(item.$id)
                .then(() => {
                    getProjects();
                    router.refresh();
                })

        }
        setLoading(false);
    };

    return (
        <Menu as="div"
              className="relative flex w-full items-center justify-center rounded-bl-lg border border-transparent text-sm font-semibold text-gray-900">
            <MenuButton className="flex items-center w-full h-full justify-center">
                <span className="sr-only">Open item menu</span>
                <span className="flex items-center justify-center">
                   <EllipsisHorizontalIcon height={25} width={50}/>
                </span>
            </MenuButton>
            <MenuItems
                className="absolute right-0 top-8 z-10 mt-2.5 w-32 origin-top-right bg-white py-2 shadow-lg ring-1 ring-gray-900/5 rounded-md"
            >
                {itemOptions.map((option) => (
                    <MenuItem key={option.name}>
                        <button
                            onClick={() => handleItemClick(option.name)}
                            className={`w-full text-center block py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50 h-full`}
                        >
                            {option.name}
                        </button>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}
