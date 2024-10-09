import * as signalR from "@microsoft/signalr";


export class SignalRService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7154/hub")
            .withAutomaticReconnect()
            .build();

        this.connection.start().catch(err => console.error("Connection error:", err));
    }

    public on(event: string, callback: (data: any) => void) {
        this.connection.on(event, callback);
    }

    public off(event: string, callback: (data: any) => void) {
        this.connection.off(event, callback);
    }
}

export const signalRService = new SignalRService();

