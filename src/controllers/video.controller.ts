import { Controller, Post, Headers, Res, UseInterceptors, UseGuards, Get, Param, Body, UploadedFiles, Req, Put } from '@nestjs/common';
import { Request, Response } from "express"
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { VideoService } from 'src/services/video.service';
import { TokenGuard } from 'src/strategies/guards/token.guard';
import { UserService } from 'src/services/user.service';
import { MapperService } from 'src/services/mapper.service';
import { ThumbnailService } from 'src/services/thumbnail.service';
import { ReactionService } from 'src/services/reaction.service';
import { CreateReactionDTO } from 'src/dtos/create-reaction-dto';
import { ConfigService } from '@nestjs/config';

@Controller('video')
export class VideoController {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly videoService: VideoService,
        private readonly thumbnailService: ThumbnailService,
        private readonly userService: UserService,
        private readonly reactionService: ReactionService,
        private readonly configService: ConfigService,
        private readonly mapperService: MapperService) { }

    @Post("")
    @UseGuards(TokenGuard)
    @UseInterceptors(AnyFilesInterceptor())
    async uploadVideo(@UploadedFiles() files: Array<Express.Multer.File>, @Body() formData, @Headers('Authorization') header: string, @Res() res: Response) {
        try {
            const [video, thumbnail] = files
            const validVideo = await this.videoService.isValidVideo(video.buffer)
            if (!validVideo) {
                return res.status(400).json({ message: "There is a problem with the chosen video, please try another one." })
            }
            const { title, description } = formData
            if (!title || !description) {
                return res.status(400).json({ message: "We need a title and description for your video." })
            }
            const data = await this.userService.getUser(header)
            const user = this.mapperService.mapGoogleDTOToGetDTO(data)
            if (!user) {
                return res.status(401).json({ message: "Couldn't find user" })
            }
            console.log("pre cloudinary")
            const isFfmpegAvailable = await this.videoService.checkFFmpegExistence()
            console.log("FFMPEG available.")
            const mp4Video = await this.videoService.convertToMp4(video)
            const result = await this.cloudinaryService.upload(mp4Video)
            console.log("after cloudinary")
            const imageResult = thumbnail?.buffer ? await this.thumbnailService.createThumbnail(thumbnail.buffer) : null
            this.videoService.createVideo(result, user.id, title, description, imageResult?.secure_url)
            return res.json("{ url: result.secure_url as string }")
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "There was an error in the Video Controller." })
        }
    }

    @Get("")
    async getVideos(@Res() res: Response) {
        try {
            const videos = await this.videoService.getVideos()
            return res.json({ videos })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "There was an error in the Video Controller." })
        }
    }

    @Get("search/:search")
    async searchVideos(@Res() res: Response, @Param('search') search) {
        try {
            const videos = await this.videoService.searchVideos(search)
            return res.json({ videos })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "There was an error in the Video Controller." })
        }
    }

    @Get(":id")
    async getVideo(@Param('id') videoId, @Headers('Authorization') header: string, @Res() res: Response) {
        try {
            if (!videoId) {
                return res.status(400).json({ message: "You need to specify which video you're looking for." })
            }
            const data = await this.userService.getUser(header)
            const user = this.mapperService.mapGoogleDTOToGetDTO(data)
            if (!user) {
                return res.status(401).json({ message: "Couldn't find user" })
            }
            const video = await this.videoService.findVideoById(videoId, user?.id || "")
            return res.json({ video })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "There was an error in the Video Controller." })
        }
    }

    @Put("react/:id")
    @UseGuards(TokenGuard)
    async reactVideo(@Param('id') videoId, @Headers('Authorization') header: string, @Res() res: Response, @Body() body) {
        try {
            if (!videoId) {
                return res.status(400).json({ message: "You need to specify which video you're looking for." })
            }
            if (!body) {
                return res.status(400).json({ message: "Wrong request body." })
            }
            const data = await this.userService.getUser(header)
            const user = this.mapperService.mapGoogleDTOToGetDTO(data)
            if (!user) {
                return res.status(401).json({ message: "Couldn't find user" })
            }
            const successful = await this.reactionService.react(body as CreateReactionDTO, videoId, user.id)

            return res.json({ successful })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "There was an error in the Video Controller." })
        }
    }
}