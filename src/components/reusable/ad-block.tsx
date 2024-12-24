import React from 'react'
import api from "@/services/axiosApi";
import Image from "next/image";
import Link from "next/link";

interface Props {
    className?: string;
}

const RandomAdBlock = async ({ className }: Props) => {
    const res = await api.get('/Ad/getrandom');
    const ad = res.data;

    return (
        <Link href={ad.url} className={className}>
            <Image src={ad.imageUrl} alt={ad.title} width={300} height={250} />
            <div className="mt-1 font-bold text-xl">{ad.title}</div>
            <div className="text-neutral-500">{ad.description}</div>
        </Link>
    )
}

export default RandomAdBlock