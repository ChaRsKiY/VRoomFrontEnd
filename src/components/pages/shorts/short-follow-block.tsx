"use client"

import React, {useState, useEffect} from 'react';
import {IoMdNotifications} from "react-icons/io";
import {HiOutlineChevronDown} from "react-icons/hi";
import {buttonCancelStyles} from "@/styles/buttonstyles/buttonCancelStyles";
import {buttonCancelLowPaddingStyles} from "@/styles/buttonstyles/buttonCancelLowPaddingStyles";

interface IShortFollowBlockProps {
    isFollowed: boolean;
    onDelete: () => void;
    onAdd: () => void;
}

const ShortFollowBlock: React.FC<IShortFollowBlockProps> = ({isFollowed, onDelete, onAdd}) => {
    const [isFollowOpen, setIsFollowOpen] = useState(false);
    const [isFollow, setIsFollowed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleFollowWindow = () => {
        setIsFollowOpen(!isFollowOpen);
    };
    const onCloseFollow = () => {
        setIsFollowOpen(false);
    };


    useEffect(() => {

        setIsFollowed(isFollowed);

    }, [isFollowed]);

    return (
        <div>
            {isFollow ? (<div className={'relative'}>
                    <div
                        className="flex px-[3px] py-[5px] justify-center items-center gap-[0.325rem] rounded-[0.3125rem] bg-zinc-300"
                        onClick={toggleFollowWindow}>
                        <IoMdNotifications size={22}/>
                        <div className="font-[300] cursor-pointer"
                             style={{fontWeight: 'bold'}}>Following
                        </div>
                        <HiOutlineChevronDown size={22}/>
                    </div>


                    {isFollowOpen && (
                        <div className="absolute right-0 bg-white border border-gray-300 rounded-md shadow-lg p-0.5 mt-2 "
                             style={{maxWidth: 'max-content'}}>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'end'}}>

                            </div>
                            <div className={'px-0'}>

                                <button onClick={onDelete}
                                        style={isHovered ? {...buttonCancelLowPaddingStyles.base, ...buttonCancelLowPaddingStyles.hover} : buttonCancelLowPaddingStyles.base}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}>Cancel subscription
                                </button>

                            </div>
                        </div>
                    )}
                </div>) :
                <div
                    className={"flex px-[0.9375rem] py-[5px] justify-center items-center gap-[0.325rem] rounded-[0.3125rem] bg-[#0EA2DE]"}>
                    <button onClick={onAdd}
                            className={'text-[#FFF] font-Inter text-[1rem] font-not-italic font-500 leading-normal'}>Follow
                    </button>
                </div>}
        </div>

    )
}

export default ShortFollowBlock;