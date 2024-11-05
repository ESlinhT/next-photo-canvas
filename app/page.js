import Link from "next/link";
import Image from "next/image";
import randomBg from '@/app/assets/random-bg.jpg';
import BlueBackgroundLayout from "@/app/layouts/BlueBackgroundLayout";

export default function Home() {
    return (
        <BlueBackgroundLayout>
            <div className="mx-auto max-w-7xl min-h-[100vh] px-6 lg:flex lg:flex-row pt-2 lg:pt-0 lg:px-8 sm:flex sm:flex-col justify-center items-center">
                <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                    <h1 className="uppercase text-4xl font-bold tracking-tight text-indigo-500">Next Photo Canvas</h1>
                    <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl capitalize">
                        Design custom images
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        This is a project that attempts to clone the functionality of creating photos and photobooks on
                        sites such as MPix, using React Canvas.
                    </p>
                    <div className="mt-10 flex items-center gap-x-6">
                        <Link
                            className="bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                            href="/photos" >Photos</Link>
                        <a href="/photobooks"
                           className="bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                            PhotoBooks
                        </a>
                    </div>
                </div>
                <div
                    className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                    <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                        <Image
                            alt="App screenshot"
                            src={randomBg.src}
                            width={540}
                            height={540}
                            className="w-[76rem] bg-white/5 shadow-2xl ring-1 ring-white/10 max-w-sm lg:max-w-[540px]"
                        />
                    </div>
                </div>
            </div>
        </BlueBackgroundLayout>
    );
}
