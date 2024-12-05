'use client'
import React, { useState } from "react";
import api from '@/services/axiosApi';

const FeedbackComponent = () => {

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
            const response = await api.get("/SendEmail/sendemail/"+ emailData.subject+"/"+emailData.from+"/"+emailData.text);

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

        <div style={{
            width: '100%', marginTop: '80px', padding: '50px', borderRadius: "50px",minWidth:'600px',
            background: 'linear-gradient( to bottom right, rgba(0, 128, 0, 0.1),  rgba(0, 128, 255, 0.2) )',
             boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            marginBottom:'50px'
        }}>

            <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", padding: "20px" }}>

                <div style={{ display: "flex", justifyContent: 'space-around' }}>
                    <div style={{ maxWidth: "800px", margin: "0 auto", }}>
                    <section style={{ marginBottom: "30px" }}>
                            <h2 style={{fontSize:'18px',fontWeight:'bold',}}>Контакты</h2>
                           
                            <ul>
                                <li>Email: vroomteamit@gmail.com</li>
                                <li>Телефон: +38 (097) 123-45-67</li>
                                <li>Часы работы: Пн-Пт с 9:00 до 18:00</li>
                            </ul>
                        </section>
                        <section style={{ marginBottom: "10px" }}>
                            <p style={{fontSize:'18px',fontWeight:'bold',}}>
                            Свяжитесь с нами напрямую. Мы ответим в ближайшее время.
                            </p>
                        </section>
                      
                        <section style={{ marginBottom: "30px" }}>
                            <p style={{ color: "#555" }}>Заполните форму ниже:</p>
                            <form onSubmit={handleSubmit}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    backgroundColor: "#f9f9f9",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    margin:'10px',
                                    boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                }} >   
                                <label>
                                    <strong>Ваше имя:</strong>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={emailData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Введите ваше имя"
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </label>
                                <label>
                                    <strong>Ваш email:</strong>
                                    <input
                                        type="email"
                                        name="from"
                                        value={emailData.from}
                                        onChange={handleChange}
                                        required
                                        placeholder="Введите ваш email"
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </label>
                                <label>
                                    <strong>Сообщение:</strong>
                                    <textarea
                                        placeholder="Опишите вашу проблему"
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
                                        e.currentTarget.style.backgroundColor = "rgba(0, 128, 255, 1)"; // Яркий цвет
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgba(0, 128, 255, 0.5)"; // Исходный цвет
                                      }}
                                >
                                    Отправить сообщение
                                </button>
                            </form>

                            
                        </section>

                      
                    </div>
                </div>
            </div>

        </div>
    );
}
export default FeedbackComponent;