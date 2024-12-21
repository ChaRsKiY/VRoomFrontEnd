import React from 'react'
import { Nunito } from "next/font/google"
import quotes from "@/testdata/quotes.json"

const font = Nunito({ subsets: ['latin'], weight: ["600"] })

//каждые 20 секунд менять цитату
export const revalidate = 20;

const MainLoading: React.FC = async () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
        <div className="absolute top-0 flex h-screen justify-center items-center w-full flex-col">
            <div className={"text-3xl mb-10 px-[10%] text-center text-neutral-700 " + font.className}>{randomQuote.quote} <span className="text-neutral-500">— {randomQuote.author}</span></div>

            <div className="w-full gap-x-2 flex justify-center items-center">
                <div
                    className="w-5 bg-green animate-pulse h-5 rounded-full animate-bounce"
                ></div>
                <div
                    className="w-5 animate-pulse h-5 bg-blue rounded-full animate-bounce"
                ></div>
                <div
                    className="w-5 h-5 animate-pulse bg-green rounded-full animate-bounce"
                ></div>
            </div>
        </div>
    )
}

export default MainLoading