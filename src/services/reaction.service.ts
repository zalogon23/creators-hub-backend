import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { CreateReactionDTO } from "src/dtos/create-reaction-dto"
import { GetReactionDTO } from "src/dtos/get-reaction-dto"
import { Reaction } from "src/entities/reaction.entity"
import { Repository } from "typeorm"
import { v4 as uuid } from "uuid"


@Injectable()
export class ReactionService {
    constructor(@InjectRepository(Reaction) private reactionRepository: Repository<Reaction>, private readonly configService: ConfigService) { }

    async react(reactionDto: CreateReactionDTO, videoId: string, userId: string) {
        try {
            const reaction = {
                id: uuid(),
                liked: reactionDto.liked,
                reactorId: userId,
                videoId: videoId,
            }
            console.log(reaction)
            const existReaction = await this.reactionRepository.findOneBy({ reactorId: reaction.reactorId, videoId: reaction.videoId })
            if (existReaction) {
                existReaction.liked = reaction.liked
                this.reactionRepository.save(existReaction)
                return true
            }
            const result = await this.reactionRepository
                .createQueryBuilder()
                .insert()
                .into(Reaction)
                .values(reaction)
                .execute()
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async getReaction(videoId: string, reactorId: string) {
        try {
            const result = await this.reactionRepository.findOneBy({ videoId, reactorId })
            if (!result) return null
            const reaction: GetReactionDTO = {
                videoId,
                reactorId,
                liked: result.liked
            }
            return reaction
        } catch (err) {
            console.log(err)
            return null
        }
    }
}