import React from 'react'
import Link from "next/link";

const MiniFooter: React.FC = () => {
    return (
        <footer className="text-[0.9rem] p-2">
            <div className="flex flex-wrap">
                <Link href="/feedback" className="pr-3">Contact us</Link>
                <Link href="/terms" className="pr-3" target="_blank" rel="noopener noreferrer">Terms</Link>
            </div>

            <div className="pt-3 font-[300] text-neutral-500">© {new Date().getFullYear()} VRoom</div>
        </footer>
    )
}

export default MiniFooter