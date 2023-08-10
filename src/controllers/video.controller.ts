import { Controller, Post, Headers, Res, UploadedFile, UseInterceptors, UseGuards, Get, Param } from '@nestjs/common';
import { Response } from "express"
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { VideoService } from 'src/services/video.service';
import { TokenGuard } from 'src/strategies/guards/token.guard';
import { UserService } from 'src/services/user.service';
import { MapperService } from 'src/services/mapper.service';

@Controller('video')
export class VideoController {
    constructor(private readonly cloudinaryService: CloudinaryService, private readonly videoService: VideoService, private readonly userService: UserService, private readonly mapperService: MapperService) { }

    @Post("")
    @UseGuards(TokenGuard)
    @UseInterceptors(FileInterceptor("video"))
    async uploadVideo(@UploadedFile() video, @Headers('Authorization') header: string, @Res() res: Response) {
        console.log(video)
        const data = await this.userService.getUser(header)
        const user = this.mapperService.mapGoogleDTOToGetDTO(data)
        const result = await this.cloudinaryService.upload(video)
        this.videoService.createVideo(result, user.id)
        return res.json({ url: result.secure_url as string })
    }

    @Get("")
    @UseGuards(TokenGuard)
    async getVideos(@Res() res: Response) {
        const videos = await this.videoService.getVideos()
        console.log("your videos: " + JSON.stringify(videos))
        return res.json({ videos })
    }

    @Get(":videoId")
    async getVideo(@Param('id') videoId, @Res() res: Response) {
        const video = await this.videoService.findVideoById(videoId)
        console.log("your videos: " + JSON.stringify(video))
        return res.json({ video })
    }
}