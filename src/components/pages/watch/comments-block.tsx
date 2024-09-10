import React from 'react'
import {GoSortDesc} from "react-icons/go";
import {SlDislike, SlLike} from "react-icons/sl";
import  MyComment from "../comments/mycomment";
import Comments from "@/components/pages/comments/comments";

const CommentsBlock: React.FC = () => {

   // const clerkId = 'user_2lWVcHQ4HcXA9JfrMO1l30jDxAi'; 
   const videoId = 5;
    return (
        <div>
            <div className="flex items-center space-x-8">
                <div className="font-[500]">1099 Comments</div>
                <div className="flex space-x-1">
                    <GoSortDesc size={22}/>
                    <div className="text-[0.9rem] font-[300]">Sort</div>
                </div>
            </div>
           <br/>
            <div style={{marginTop:'30'}}>              
                <MyComment videoId={videoId} />
                <br/>
                <Comments/>
            </div>
        </div>
    )
}

export default CommentsBlock