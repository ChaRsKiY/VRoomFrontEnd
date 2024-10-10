export function formatDate(date: Date): string {
    // Массив месяцев для преобразования номера месяца в строку
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Форматирование даты
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Объединение частей в нужный формат
    return `${day} ${month} ${year}`;
}