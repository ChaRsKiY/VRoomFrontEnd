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

export const formatDuration = (time: number): string => {
    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2});
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
    }
};