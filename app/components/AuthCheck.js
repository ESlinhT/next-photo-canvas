import Link from "next/link";
import BlueBackgroundLayout from "@/app/layouts/BlueBackgroundLayout";

export default function AuthCheck() {
    return (
        <BlueBackgroundLayout>
            <div className="h-[100vh] flex flex-col justify-center items-center pb-32 lg:pb-0">
                <h2 className="text-3xl font-bold text-gray-200 text-center">Please login to use this feature</h2>
                <div className="mt-10">
                    <Link href="/login"
                          className="flex w-[384px] justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Sign in here
                    </Link>
                </div>
            </div>
        </BlueBackgroundLayout>
    );
}
