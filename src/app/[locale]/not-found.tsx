import React from 'react'
import { Nunito } from "next/font/google"
import Search from "@/components/pages/home/header/search";
import Link from "next/link";

const font = Nunito({ subsets: ['latin'], weight: ["600"] })

const MainNotFound: React.FC = async () => {
    return (
        <div className="absolute top-0 flex h-screen justify-center items-center w-full flex-col">
            <div className={"text-6xl mb-10 px-[10%] text-center " + font.className}>404</div>
            <div>
                <div className="mb-3">Page you are looking for does not exist. Try searching something else or go <Link
                    href="/" className="text-blue">Home</Link></div>
                <Search/>
            </div>
        </div>
    )
}

export default MainNotFound