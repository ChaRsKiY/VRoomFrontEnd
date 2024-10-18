"use client"
import { RxAvatar } from "react-icons/rx";
import React, { useState } from 'react';
// import axios from 'axios';

const CreateChannelModal: React.FC<{ open: boolean;onClose: () => void; }> = ({ open, onClose }) => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState({ name: '', nickname: '' });

    const validate = () => {
        let isValid = true;
        const newErrors = { name: '', nickname: '' };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!nickname.trim()) {
            newErrors.nickname = 'Nickname is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validate()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('nickname', nickname);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        /*try {
            await axios.post('/api/channels', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });*/
            onClose(); // Закрываем диалог после успешного создания
        // } catch (error) {
        //     console.error('Error creating channel', error);
        // }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    if (!open) return null;

    return (
        <div style={modalStyles.overlay} className="pointer-events-none">
            <dialog className="pointer-events-none" aria-modal={true}>
                <h1><strong>Basic information</strong></h1>
                <br/>
                <form onSubmit={handleSubmit}>
                    <div style={modalStyles.formGroup}>

                        {preview && <img src={preview} alt="Avatar preview" style={modalStyles.avatar}/> ||
                            preview == null && <RxAvatar size={'95px'}/>
                        }
                        <label htmlFor="avatar">Channel Avatar</label>
                        <input type="file" accept="image/*" onChange={handleAvatarChange}
                               style={modalStyles.input}/>

                    </div>
                    <div style={modalStyles.formGroup}>
                        <span>Name</span>
                        <input type="text" placeholder="Channel Name" value={name}
                               onChange={(e) => setName(e.target.value)} style={modalStyles.input}/>
                        {errors.name && <p style={modalStyles.error}>{errors.name}</p>}
                    </div>
                    <div style={modalStyles.formGroup}>
                        <span>Nickname</span>
                        <input type="text" placeholder="Nickname"
                               value={nickname} onChange={(e) => setNickname(e.target.value)}
                               style={modalStyles.input}/>
                        {errors.nickname && <p style={modalStyles.error}>{errors.nickname}</p>}
                    </div>

                    <div style={modalStyles.actions}>
                        <button type="button" onClick={onClose} style={modalStyles.buttonSecondary}>Cancel</button>
                        <button type="submit" style={modalStyles.buttonPrimary}>Create</button>
                    </div>
                </form>
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
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '6px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    error: {
        color: 'red',
        fontSize: '12px',
        marginTop: '5px',
    },
    avatar: {
        marginTop: '10px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover' as 'cover',
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

