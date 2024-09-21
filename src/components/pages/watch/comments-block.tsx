import React from 'react'
import {GoSortDesc} from "react-icons/go";

const CommentsBlock: React.FC = () => {
    return (
        <div>
            <div className="flex items-center space-x-8">
                <div className="font-[500]">1099 Comments</div>
                <div className="flex space-x-1">
                    <GoSortDesc size={22}/>
                    <div className="text-[0.9rem] font-[300]">Sort</div>
                </div>
            </div>

        </div>
    )
}

export default CommentsBlock