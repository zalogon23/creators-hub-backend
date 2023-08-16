import { Body, Controller, Get, Headers, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUserDTO } from 'src/dtos/get_user.dto';
import { UserService } from 'src/services/user.service';
import { Response } from "express"
import { MapperService } from 'src/services/mapper.service';
import { TokenGuard } from 'src/strategies/guards/token.guard';
import { SubscriptionService } from 'src/services/subscription.service copy';
import { CommentService } from 'src/services/comment.service';

@Controller('comment')
export class CommentController {
    constructor(private readonly userService: UserService, private readonly commentService: CommentService, private readonly mapperService: MapperService) { }

    @Post(":videoId")
    @UseGuards(TokenGuard)
    async createComment(@Headers('Authorization') header: string, @Param('videoId') videoId, @Res() res: Response, @Body() body) {
        try {

            const data = await this.userService.getUser(header)
            const user = this.mapperService.mapGoogleDTOToGetDTO(data)
            if (!user) return res.status(401).json({ message: "Couldn't find user" })
            const successful = await this.commentService.createComment(body, videoId, user.id)

            return res.json({ successful });
        }
        catch (ex) {
            console.log(ex)
            return res.status(500).json({ message: "Server error in Subscription Controller" })
        }
    }

    @Get(":videoId")
    async getComments(@Param('videoId') videoId, @Res() res: Response) {
        try {
            const comments = await this.commentService.getComments(videoId)

            return res.json({ comments });
        }
        catch (ex) {
            console.log(ex)
            return res.status(500).json({ message: "Server error in Subscription Controller" })
        }
    }

}
