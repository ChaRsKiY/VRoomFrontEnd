import React, { useState, useEffect } from 'react';
import {IoMdNotifications} from "react-icons/io";
import {  HiOutlineChevronDown } from 'react-icons/hi';

interface IProps {
    isfolowed: boolean;
    onDelete: () => void;
    onAdd: () => void;
}

const FolowComponent: React.FC<IProps> = ({isfolowed, onDelete, onAdd}) => {
    const [isFolowOpen, setIsFolowOpen] = useState(false);
    const [isfolow,setIsFolowed]=useState(false);

    const toggleFolowWindow = () => {
        setIsFolowOpen(!isFolowOpen); 
    };
    const onCloseFolow = () => {
        setIsFolowOpen(false); 
    };


    useEffect(() => {
    
        setIsFolowed(isfolowed);

      }, [isfolowed]);

    return (
        <div>
           {isfolow? ( <div>
            <div className="flex items-center space-x-2.5" onClick={toggleFolowWindow} 
            style={{border:'2px solid gray',borderRadius:'15px',padding:'5px',marginLeft:'10px',color:'gray'}}>
                <IoMdNotifications size={22} />
                <div className="font-[300] cursor-pointer"
                style={{fontWeight:'bold'}}>Subscribed </div>
                <HiOutlineChevronDown size={22} />
            </div>

           
            {isFolowOpen && (
                <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-4 mt-2 "
                style={{maxWidth:'410px'}}>
                    <div style={{display:'flex',width:'100%',justifyContent:'end'}}>
                    <button  style={{padding:'10px',paddingTop:'0', fontWeight:'bold',color:'gray'}} onClick={onCloseFolow}>
                        X
                    </button></div>
                    <div>
                    
                    <button onClick={onDelete}>Delete subscription</button>

                    </div>
                </div>
            )}
            </div>):
                   <div>
                     <button className="px-2 py-0.5 rounded bg-neutral-400 text-white ml-5"
                     onClick={onAdd}>Follow</button>
                </div>
                }
        </div>
    );
};

export default FolowComponent;
