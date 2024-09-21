export function formatNumber(num: number, thousandSuffix: string = 'k', millionSuffix: string = 'm'): string {
    if (num < 1000) {
        return num.toString();
    } else if (num >= 1000 && num < 1000000) {
        return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + thousandSuffix;
    } else {
        return (num / 1000000).toFixed(num >= 10000000 ? 0 : 2) + millionSuffix;
    }
}

export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    function getPlural(number: number, one: string, two: string, five: string): string {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    }

    if (seconds < 60) {
        return "только что";
    } else if (minutes < 60) {
        return `${minutes} ${getPlural(minutes, "минуту", "минуты", "минут")} назад`;
    } else if (hours < 24) {
        return `${hours} ${getPlural(hours, "час", "часа", "часов")} назад`;
    } else if (days < 30) {
        return `${days} ${getPlural(days, "день", "дня", "дней")} назад`;
    } else if (months < 12) {
        return `${months} ${getPlural(months, "месяц", "месяца", "месяцев")} назад`;
    } else {
        return `${years} ${getPlural(years, "год", "года", "лет")} назад`;
    }
}
