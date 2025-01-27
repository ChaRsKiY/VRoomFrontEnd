import * as signalR from "@microsoft/signalr";


export class SignalRService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            // .withUrl("http://95.217.212.221:5024/hub")
            .withUrl("https://485a-94-16-44-220.ngrok-free.app/hub")
            .withAutomaticReconnect()
            .build();

        this.connection.start().catch(err => console.error("Connection error:", err));
    }

    // Подписка на общее событие "ReceiveMessage"
    public onMessageReceived(callback: (messageType: string, payload: any) => void) {
        this.connection.on("ReceiveMessage", (message) => {
            // Вызываем коллбек, передавая тип и данные
            callback(message.type, message.payload);
        });
    }

    // Отключение обработчика событий
    public offMessageReceived(callback: (messageType: string, payload: any) => void) {
        this.connection.off("ReceiveMessage", callback);
    }
}

// Экземпляр сервиса
export const signalRService = new SignalRService();


