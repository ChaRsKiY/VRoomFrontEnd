'use client'

import React, {useState,useEffect} from 'react'
import Link from "next/link";

interface IBlockProps {
    name:string;
    id:number;
    nik:string;
}

const ChannelUrlComponent: React.FC<IBlockProps> = ({ name,id,nik }: IBlockProps) => {
    return (
        <div  >
           
         <Link href={"/gotochannel/" + id} className="flex w-full max-sm:flex-col max-sm:px-[5%]">
         <div className="flex flex-col pl-3.5">
                {nik?( 
                        <div className="font-[500]">{nik}</div>):
                        <div className="font-[500]">{name}</div>}
                    </div>
        </Link>
          
        </div>
    )
}

export default ChannelUrlComponent