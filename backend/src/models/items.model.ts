import { v4 as UUID } from "uuid";

export default class Item {
    id: string ='';
    name: string = '';
    brand: string = '';
    color: string = '';
    size: Number = 0;
    description: string = '';
    category: string = '';
    createdAt: Number = 0;
}
