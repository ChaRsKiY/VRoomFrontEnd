'use client'
import React, { useState } from "react";
import api from '@/services/axiosApi';

const Help = () => {

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
            width: '100%', marginTop: '80px', padding: '50px', borderRadius: "50px",
            background: 'linear-gradient( to bottom right, rgba(0, 128, 0, 0.3),  rgba(0, 128, 255, 0.3) )'
        }}>

            <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", padding: "20px" }}>

                <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: '20px', fontWeight: 'bold' }}>
                    Часто задаваемые вопросы
                </h1>

                <div style={{ display: "flex", justifyContent: 'space-around' }}>
                    <div style={{ maxWidth: "800px", margin: "0 auto", }}>
                        <section style={{ marginBottom: "30px" }}>
                            <ul>
                                <li>
                                    <strong>Как я могу зарегистрироваться?</strong>
                                    <p>
                                        Чтобы зарегистрироваться, нажмите на кнопку "Регистрация" в правом верхнем углу
                                        сайта, заполните форму и подтвердите свою почту.
                                    </p>
                                </li>
                                <li>
                                    <strong>Как восстановить пароль?</strong>
                                    <p>
                                        Если вы забыли пароль, нажмите "Забыли пароль?" на странице входа, введите свой
                                        адрес электронной почты, и мы отправим инструкции по восстановлению.
                                    </p>
                                </li>
                                <li>
                                    <strong>Как связаться с поддержкой?</strong>
                                    <p>
                                        Вы можете написать нам через форму обратной связи ниже или отправить письмо на
                                        адрес: vroomteamit@gmail.com.
                                    </p>
                                </li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: "30px" }}>
                            <p>Если у вас остались вопросы, заполните форму ниже:</p>
                            <form onSubmit={handleSubmit}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    backgroundColor: "#f9f9f9",
                                    padding: "20px",
                                    borderRadius: "8px",
                                }}
                            >
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
                                        backgroundColor: "RoyalBlue",
                                        color: "#fff",
                                        padding: "10px",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Отправить сообщение
                                </button>
                            </form>

                            
                        </section>

                        <section>
                            <h2 style={{ color: "#555" }}>Контакты</h2>
                            <p>Свяжитесь с нами напрямую:</p>
                            <ul>
                                <li>Email: vroomteamit@gmail.com</li>
                                <li>Телефон: +38 (097) 123-45-67</li>
                                <li>Часы работы: Пн-Пт с 9:00 до 18:00</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

        </div>
    );
}
export default Help;