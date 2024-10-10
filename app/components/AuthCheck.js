import Link from "next/link";
import BlueBackground from "@/app/components/BlueBackground";

export default function AuthCheck() {
    return (
        <BlueBackground>
            <div className="h-[100vh] flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold text-gray-200">Please login to use this feature</h2>
                <div className="mt-10">
                    <Link href="/login"
                          className="flex w-full justify-center bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:indigo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Sign in here
                    </Link>
                </div>
            </div>
        </BlueBackground>
    );
}
