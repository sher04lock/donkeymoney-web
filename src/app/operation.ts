import { Tag } from "./tag";

export class Operation {
    id: string;
    amount: number;
    name: string; // = description
    userId: string;
    familyId?: string;
    createdAt: string;
    tag?: Tag;

    constructor() {
        this.tag = new Tag();
    }
}
