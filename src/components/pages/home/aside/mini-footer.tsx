import React from 'react'
import Link from "next/link";

const MiniFooter: React.FC = () => {
    return (
        <footer className="p-2 flex flex-wrap text-[0.9rem]">
            <Link href="/about" className="pr-3">About</Link>
            <Link href="/contactus" className="pr-3">Contact us</Link>
            <Link href="/forcreators" className="pr-3">For creators</Link>
            <Link href="/advertise" className="pr-3">Advertise</Link>
            <Link href="/terms" className="pr-3">Terms</Link>
            <Link href="/policy" className="pr-3">Private policy</Link>

            <div className="pt-3 font-[300] text-neutral-500">© {new Date().getFullYear()} VRoom</div>
        </footer>
    )
}

export default MiniFooter