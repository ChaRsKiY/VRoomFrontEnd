'use client'
import React, { useState } from "react";
import api from '@/services/axiosApi';

interface IProps {
    fill: string;
    name: string;
    email: string;
    enterE: string;
    enterN: string;
    send: string;
    mess: string;
    about: string
    ;
}

const EmailForm: React.FC<IProps> = ({ fill, name, email, enterE, enterN, send, mess, about }) => {

    const [emailData, setEmailData] = useState({
        from: "",
        subject: "",
        text: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await api.get("/SendEmail/sendemail/" + emailData.subject + "/" + emailData.from + "/" + emailData.text);

            if (response.status === 200) {
                alert("Ваш вопрс отправлен!");
                window.location.href = "/";
            } else {
                console.log("Ошибка при отправке письма");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            console.log("Ошибка при отправке письма");
        }
    };

    return (

        <section style={{ marginBottom: "30px" }}>
            <p style={{ color: "#555" }}>{fill}</p>
            <form onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "20px",
                    borderRadius: "8px",
                    margin: '10px',
                }}>
                <label>
                    <strong>{name}</strong>
                    <input
                        type="text"
                        name="subject"
                        value={emailData.subject}
                        onChange={handleChange}
                        required
                        placeholder={enterN}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                </label>
                <label>
                    <strong>{email}</strong>
                    <input
                        type="email"
                        name="from"
                        value={emailData.from}
                        onChange={handleChange}
                        required
                        placeholder={enterE}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                </label>
                <label>
                    <strong>{mess}</strong>
                    <textarea
                        placeholder={about}
                        name="text"
                        value={emailData.text}
                        onChange={handleChange}
                        required
                        rows={4}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            resize: "none",
                        }}
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        backgroundColor: "rgba(0, 128, 255, 0.5) ",
                        color: "#fff",
                        padding: "10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(0, 128, 255, 1)"; 
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(0, 128, 255, 0.5)"; 
                    }}
                >
                    {send}
                </button>
            </form>


        </section>

    );
}
export default EmailForm;
