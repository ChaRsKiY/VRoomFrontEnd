"use client";

import React, { useState, useEffect } from 'react'
import Image from "next/image";
import {IContentVideo} from "@/types/videoDTO.interface";


interface IVideoCardProps {
  el: IContentVideo;
}


export default function VideoCard({ el }: IVideoCardProps) {
  const [coverBase64, setCoverBase64] = useState<string | null>(null)

  useEffect(() => {
    if (el.cover) {
      const coverArray = new Uint8Array(atob(el.cover).split('').map(char => char.charCodeAt(0)))
      const base64 = btoa(String.fromCharCode.apply(null, Array.from(coverArray)))
      setCoverBase64(base64)
    }
  }, [el.cover])



  return (
    <div className="space-y-2.5">
        {coverBase64 && (
          <Image
            src={`data:image/jpeg;base64,${coverBase64}`}
            alt={el.tittle}
            width={115}
            height={100}
            className="rounded-xl aspect-[16/9]"
          />
        )}
           
    </div>
  )
}
