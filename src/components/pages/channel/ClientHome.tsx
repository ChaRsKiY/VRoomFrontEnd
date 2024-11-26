"use client"

import CreateChannelModal from "@/components/pages/channel/channel";
import React from "react";
import Link from "next/link";
import { CiSettings } from "react-icons/ci";

function ClientHome() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            {/*<Link target={'_blank'} href={"/channel/editing"} className="space-y-2.5">Customize channel view</Link>*/}
            <button onClick={openModal}>Customize channel view</button>
            <CreateChannelModal open={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default ClientHome;