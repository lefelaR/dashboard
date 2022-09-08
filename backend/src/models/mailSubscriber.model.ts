import { v4 as UUID } from "uuid";

export default class MailSubscriber {
    id: string = "";
    name: string = "";
    email: string = "";
    createdAt: number = 0;
    status: string = "";

    constructor(name: string, email: string, id = null) {
        this.id = id !== null ? id : UUID();
        this.name = name;
        this.email = email;
        this.createdAt = new Date().getTime();
    }
}