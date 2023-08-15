import { IsNotEmpty } from "class-validator";

export class GetReactionDTO {

    @IsNotEmpty()
    reactorId: string;

    @IsNotEmpty()

    videoId: string;

    @IsNotEmpty()
    liked: boolean;

}