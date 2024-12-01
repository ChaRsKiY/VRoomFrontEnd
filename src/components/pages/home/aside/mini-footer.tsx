import React from 'react'
import Link from "next/link";

const MiniFooter: React.FC = () => {
    return (
        <footer className="text-[0.9rem] p-2">
            <div className="flex flex-wrap">
                <Link href="/about" className="pr-3">About</Link>
                <Link href="/contactus" className="pr-3">Contact us</Link>
                <Link href="/forcreators" className="pr-3">For creators</Link>
                <Link href="/advertise" className="pr-3">Advertise</Link>
                <Link href="/terms" className="pr-3" target="_blank" rel="noopener noreferrer">Terms</Link>
                <Link href="/policy" className="pr-3">Private policy</Link>
            </div>

            <div className="pt-3 font-[300] text-neutral-500">© {new Date().getFullYear()} VRoom</div>
        </footer>
    )
}

export default MiniFooter