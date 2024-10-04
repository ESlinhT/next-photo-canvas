import Link from "next/link";

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center">
                <p className="text-center text-3xl">Welcome to Photo Canvas</p>
                <Link className="border-2 rounded-xl bg-blue-500 text-white p-5 uppercase" href={'/images'}>Go To Images</Link>
                <button disabled={true} className="disabled border-2 rounded-xl bg-blue-300 text-white p-5 uppercase">PhotoBooks (coming soon)</button>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

            </footer>
        </div>
    );
}
