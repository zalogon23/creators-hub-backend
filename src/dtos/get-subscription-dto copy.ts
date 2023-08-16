import { IsNotEmpty } from "class-validator";

export class GetSubscriptionDTO {

    @IsNotEmpty()
    subscriberId: string;

    @IsNotEmpty()
    subscribeeId: string;
}