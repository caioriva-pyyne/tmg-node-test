import {IsNotEmpty} from 'class-validator';

export class MapRequest {
    constructor(key: string, value: string, ttlInSeconds: number) {
        this.key = key;
        this.value = value;
        this.ttlInSeconds = ttlInSeconds;
    }

    @IsNotEmpty({ message: 'A key for a key-value pair is required to put' })
    key: string;
    @IsNotEmpty({ message: 'A value for a key-value pair is required to put' })
    value: string;
    ttlInSeconds: number;
}
