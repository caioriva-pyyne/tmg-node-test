import { IsNotEmpty } from 'class-validator';

export class StackRequest {
    constructor(item: string) {
        this.item = item;
    }

    @IsNotEmpty({ message: 'An item is required to be pushed' })
    item: string;
}
