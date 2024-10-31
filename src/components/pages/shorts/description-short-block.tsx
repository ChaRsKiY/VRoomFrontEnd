"use client"

import React, {useRef, useState, useEffect, ChangeEvent, MouseEvent} from 'react';
import Image from "next/image";

interface IDescriptionShortBlockProps {
    description: string;
    tags: string;
}

const DescriptionShortBlock: React.FC<IDescriptionShortBlockProps> = ({
                                                                          description,
                                                                          tags
                                                                      }: IDescriptionShortBlockProps) => {

    return (
        <>
            <div className="text-white pt-2.5"
            >{description}
            </div>
            <div className="text-white pt-2.5">{tags}
            </div>
        </>

    );


};

export default DescriptionShortBlock;