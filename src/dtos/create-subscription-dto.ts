import { IsNotEmpty } from "class-validator";

export class CreateSubscriptionDTO {

    @IsNotEmpty()
    subscribeeId: string;

    @IsNotEmpty()
    subscribed: boolean;
}