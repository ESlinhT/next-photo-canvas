'use client';

import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {useGlobalContext} from "@/app/context/GlobalProvider";
import {signOut} from "@/app/lib/appwrite";
import {useRouter} from "next/navigation";

const userNavigation = [{name: 'My Projects', href: '/my-projects'}, {name: 'Sign out', href: '#'},];

export default function UserMenu() {
    const {user} = useGlobalContext();
    const router = useRouter();

    const handleItemClick = (item) => {
        if (item.name === 'Sign out') {
            signOut().then(() => router.push('/'));
        } else {
            router.push(item.href);
        }
    };

    return (
        <Menu as="div" className="relative">
            <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <img
                    alt=""
                    src={user?.avatar}
                    className="h-8 w-8 rounded-full bg-gray-50"
                />
                <span className="hidden lg:flex lg:items-center">
                    <span aria-hidden="true"
                          className="ml-4 text-sm font-semibold leading-6 text-gray-900 capitalize">
                        {user?.username}
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400"/>
                </span>
            </MenuButton>
            <MenuItems
                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right bg-white py-2 shadow-lg ring-1 ring-gray-900/5"
            >
                {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                        <button
                            onClick={() => handleItemClick(item)}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                        >
                            {item.name}
                        </button>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}
