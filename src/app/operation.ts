import { Tag } from "./tag";

export class Operation {
    id: string;
    name: string;
    userId: string;
    familyId?: string;
    amount: number;
    createdAt: string;
    tag?: Tag;
    description?: string;
}
