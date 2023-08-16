import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { CreateCommentDTO } from "src/dtos/create-comment-dto"
import { CreateReactionDTO } from "src/dtos/create-reaction-dto"
import { GetReactionDTO } from "src/dtos/get-reaction-dto"
import { Comment } from "src/entities"
import { Reaction } from "src/entities/reaction.entity"
import { Repository } from "typeorm"
import { v4 as uuid } from "uuid"


@Injectable()
export class CommentService {
    constructor(@InjectRepository(Comment) private commentsRepository: Repository<Comment>, private readonly configService: ConfigService) { }

    async createComment(commentDto: CreateCommentDTO, videoId: string, userId: string) {
        try {
            const comment = {
                id: uuid(),
                content: commentDto.content,
                videoId: videoId,
                commenterId: userId,
                commentedAt: new Date()
            }
            console.log(comment)

            const result = await this.commentsRepository
                .createQueryBuilder()
                .insert()
                .into(Comment)
                .values(comment)
                .execute()
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async getComments(videoId: string) {
        try {
            const comments = await this.commentsRepository.find({ relations: ["commenter"], where: { videoId } })
            if (!comments) return []

            return comments
        } catch (err) {
            console.log(err)
            return []
        }
    }
}