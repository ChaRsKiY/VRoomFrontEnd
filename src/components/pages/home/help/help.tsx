'use client'
import React, { useState } from "react";
import api from '@/services/axiosApi';
import Link from "next/link";

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

        <div style={{
            width: '100%', marginTop: '80px', padding: '50px', borderRadius: "50px",
            background: 'linear-gradient( to bottom right, rgba(0, 128, 0, 0.2),  rgba(0, 128, 255, 0.3) )',
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            marginBottom:'50px'
        }}>

            <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", padding: "20px" }}>

                <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: '24px', fontWeight: 'bold' }}>
                    Часто задаваемые вопросы (FAQ)
                </h1>

                <div style={{ display: "flex", justifyContent: 'space-around' }}>
                    <div style={{ maxWidth: "800px", margin: "0 auto", }}>
                        <section style={{ marginBottom: "30px" }}>
                            <ul>
                                <li>
                                    <strong style={{ fontSize: '20px' }}>1. Как создать аккаунт?</strong> <br /><br />
                                    <p>
                                        Для регистрации на сайте выполните следующие шаги:
                                    </p>
                                    <br />
                                    <p>
                                        1. Нажмите кнопку "Регистрация" в правом верхнем углу страницы.
                                    </p><br />
                                    <p>
                                        2. Заполните необходимые поля: имя, email и пароль.
                                    </p><br />
                                    <p>
                                        3. Подтвердите регистрацию, перейдя по ссылке в письме, отправленном на ваш email.
                                    </p><br />
                                    <p>
                                        Если возникли проблемы, обратитесь в поддержку: &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", color: 'royalblue' }}>
                                            vroomteamit@gmail.com</Link>
                                    </p><br />
                                    <hr></hr><br /><br />
                                </li>
                                <li>
                                    <strong style={{ fontSize: '20px' }}>2. Как загрузить видео?</strong> <br /><br />
                                    <p>
                                        1. После входа в аккаунт зайдите на страницу вашего канала "Ваш канал" на главной странице.
                                    </p>
                                    <br />
                                    <p>
                                        2. Нажмите кнопку "Добавить видео". Вы попадете на страничку добавления видео.
                                    </p><br />
                                    <p>
                                        3. Выберите файл с вашего устройства. Выберите категорию видео. Добавьте теги. Установите настроки безопасного режима.
                                    </p><br />
                                    <p>
                                        4. Нажмите кнопку "Загрузить видео" .
                                    </p><br />
                                    <p>
                                        Учтите, что размер видео не должен превышать 2 ГБ.
                                    </p><br />
                                    <p>
                                        Если возникли проблемы, обратитесь в поддержку: &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", }}>
                                            vroomteamit@gmail.com</Link>
                                    </p><br />
                                    <hr></hr><br /><br />
                                </li>
                                <li>
                                    <strong style={{ fontSize: '20px' }}>3. Как настроить субтитры для видео?</strong> <br /><br />
                                    <p>
                                        1. На страницу вашего канала найдите "Субтитры".
                                    </p>
                                    <br />
                                    <p>
                                        2. Вы можете добавить субтитры вручную или загрузить файл .vtt.
                                    </p><br />
                                    <p>
                                        3. В окне редактирования вы можете менять таймкоды, менять текст субтитров. Просматривать субтитры на вашем видео.
                                    </p><br />
                                    <p>
                                        4. Нажмите кнопку "Опубликовать" или "Сохранить в черновики" для возможности редактирования позже .
                                    </p><br />
                                    <p>
                                        5. Вы можете скачать субтитры в виде файла .vtt .
                                    </p><br />
                                    <p>
                                        6. При закрытии окна редактирования субтитров происходит автоматическое сохранение в черновики.
                                    </p><br />
                                    <p>
                                        Если возникли проблемы, обратитесь в поддержку: &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", }}>
                                            vroomteamit@gmail.com</Link>
                                    </p><br />
                                    <hr></hr><br /><br />
                                </li>
                                <li>
                                    <strong style={{ fontSize: '20px' }}>4. Как изменить настройки канала?</strong> <br /><br />
                                    <p>
                                        Вы можете менять настройки своего канала в любой момент, когда захотите:
                                    </p>
                                    <br />
                                    <p>
                                        1. После входа в аккаунт зайдите на страницу "Ваш канал" на главной странице.
                                    </p><br />
                                    <p>
                                        2. Вы можете менять фото профиля, менять фото банера вашего канала .
                                    </p><br />
                                    <p>
                                        3. Придумайте nikname вашего канала. Он должен быть уникальным.
                                    </p><br />
                                    <p>
                                        Если остались вопросы, обратитесь в поддержку: &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", }}>
                                            vroomteamit@gmail.com</Link>
                                    </p><br />
                                    <hr></hr><br /><br />
                                </li>
                                <li>
                                    <strong style={{ fontSize: '20px' }}>5. Как восстановить доступ к аккаунту?</strong> <br /><br />
                                    <p>
                                        Если вы забыли пароль:
                                    </p>
                                    <br />
                                    <p>
                                        1. Перейдите на страницу входа и нажмите "Забыли пароль?".
                                    </p><br />
                                    <p>
                                        2. Введите свой email, указанный при регистрации.
                                    </p><br />
                                    <p>
                                        3. Следуйте инструкциям в письме для сброса пароля.
                                    </p><br />
                                    <p>
                                        Если доступ к email утерян, свяжитесь с поддержкой. &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Link href={"/feedback"} style={{ borderBottom: "2px solid royalblue", }}>
                                            vroomteamit@gmail.com</Link>
                                    </p><br />
                                    <hr></hr><br /><br />
                                </li>
                                <li>
                                    <strong style={{ fontSize: '20px' }}>6. Почему моё видео было удалено?</strong> <br /><br />
                                    <p>
                                        Видео может быть удалено за нарушение правил, таких как:
                                    </p>
                                    <br />
                                    <p>
                                        - Публикация материалов с нарушением авторских прав.
                                    </p><br />
                                    <p>
                                        - Распространение контента с ненавистью, насилием или дискриминацией.
                                    </p><br />
                                    <p>
                                        - Нарушение законов вашей страны.
                                    </p><br />
                                    <p>
                                        Если вы считаете, что удаление было ошибочным, подайте апелляцию через раздел "Обратная связь".
                                    </p><br />
                                    <hr></hr><br /><br />
                                </li>
                                <li>
                                    <strong style={{ fontSize: '20px' }}>7. Как удалить своё видео?</strong> <br /><br />
                                    <p>
                                        1. Перейдите в "Менеджер видео".
                                    </p>
                                    <br />
                                    <p>
                                        2. Найдите нужное видео.
                                    </p><br />
                                    <p>
                                       3. Нажмите "Удалить" и подтвердите действие.
                                    </p><br />
                                    <p>
                                    Обратите внимание: удалённые видео восстановлению не подлежат.
                                    </p><br />
                                    <hr></hr><br /><br />
                                </li>
                                <li>
                                    <strong style={{ fontSize: '20px' }}>8. Как связаться с поддержкой?</strong> <br /><br />
                                    </li>
                                    </ul>
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