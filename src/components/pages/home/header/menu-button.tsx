"use client"

import React, {ReactNode} from 'react'

interface IHeaderMenuButtonProps {
    icon: ReactNode,
    text: string,
    action: () => void
}

const HeaderMenuButton: React.FC<IHeaderMenuButtonProps> = ({ icon, text, action }: IHeaderMenuButtonProps) => {
    return (
        <button
            onClick={action}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-[0.5rem] flex items-center p-2 text-[1.075rem] space-x-3">
            {icon}
            <div>{text}</div>
        </button>
    )
}

export default HeaderMenuButton