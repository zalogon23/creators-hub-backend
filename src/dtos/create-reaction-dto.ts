import { IsNotEmpty } from "class-validator";

export class CreateReactionDTO {

    @IsNotEmpty()
    liked: boolean;
}