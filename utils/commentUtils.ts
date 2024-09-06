export const createDate = () => {
    const currentDate: Date = new Date();

    const months: string[] = [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];

    const day: number = currentDate.getDate();
    const monthIndex: number = currentDate.getMonth();
    const year: number = currentDate.getFullYear();

    const formattedDate: string = `${day} ${months[monthIndex]} ${year} року`;

    return formattedDate;
}