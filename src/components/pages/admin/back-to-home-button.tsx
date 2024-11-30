import React from 'react'
import {MdOutlineAssignmentReturn} from "react-icons/md";
import Link from "next/link";

const BackToHomeButton: React.FC = () => {
    return (
        <Link href="/">
            <MdOutlineAssignmentReturn size={27} className="cursor-pointer hover:scale-105 text-neutral-500" />
        </Link>
    )
}

export default BackToHomeButton