"use client"
import { RxAvatar } from "react-icons/rx";
import React, { useState } from 'react';
// import axios from 'axios';

const CreateChannelModal: React.FC<{ open: boolean; onClose: () => void; }> = ({ open, onClose }) => {

    if (!open) return null;

    return (
        <div style={modalStyles.overlay} className="pointer-events-none">
            <dialog className="pointer-events-none" aria-modal={true}>
                <h1><strong>Basic information</strong></h1>


            </dialog>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
    },
    formGroup: {
        marginBottom: '15px',
    },

    actions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    buttonPrimary: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    buttonSecondary: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default CreateChannelModal;

