"use client"
import CreateChannelModal from "@/components/pages/channel/channel";
import React from "react";
import Link from "next/link";

function ClientHome() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div style={{marginTop: '1%', 'width':'max-content'}}>
            <Link target={'_blank'} href={"/channel/editing"} className="space-y-2.5">Customize channel view</Link>
           {/* <button onClick={openModal}>Customize channel view</button>
            <CreateChannelModal open={isModalOpen} onClose={closeModal} />*/}
        </div>
    );
}

export default ClientHome;