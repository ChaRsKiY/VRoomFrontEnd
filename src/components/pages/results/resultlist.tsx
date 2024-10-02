'use client'

import React, {useState} from 'react'
import UnlimitedScrollBlock from "@/components/pages/results/unlimited-scroll-block";
import {IVideo} from "@/types/videoinfo.interface";


const ResultInfo: React.FC = () => {

    const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
 
    

    return (
       
             <UnlimitedScrollBlock data={moreVideos} />
       
    )
}

export default ResultInfo