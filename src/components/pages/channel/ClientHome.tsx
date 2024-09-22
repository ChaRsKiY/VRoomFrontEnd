"use client"
import CreateChannelModal from "@/components/pages/channel/channel";
import React from "react";
import Link from "next/link";
import {CiSettings} from "react-icons/ci";

function ClientHome() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (/* style={{marginTop: '1%', 'width':'max-content'}}*/


                    /*<div className="text-2xl">
                        <Image className={} src={el.iconPath!} alt={el.name} width={26} height={26}/>
                    </div>*/


        <div>
            {/*<Link target={'_blank'} href={"/channel/editing"} className="space-y-2.5">Customize channel view</Link>*/}
            <button onClick={openModal}>Customize channel view</button>
            <CreateChannelModal open={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default ClientHome;