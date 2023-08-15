import { Controller, Post, Headers, Res, UploadedFile, UseInterceptors, UseGuards, Get, Param, Body, UploadedFiles, Search } from '@nestjs/common';
import { Response } from "express"
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { VideoService } from 'src/services/video.service';
import { TokenGuard } from 'src/strategies/guards/token.guard';
import { UserService } from 'src/services/user.service';
import { MapperService } from 'src/services/mapper.service';
import { GetVideoDTO } from 'src/dtos/get-video-dto';
import { ThumbnailService } from 'src/services/thumbnail.service';

@Controller('video')
export class VideoController {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly videoService: VideoService,
        private readonly thumbnailService: ThumbnailService,
        private readonly userService: UserService,
        private readonly mapperService: MapperService) { }

    @Post("")
    @UseGuards(TokenGuard)
    @UseInterceptors(AnyFilesInterceptor())
    async uploadVideo(@UploadedFiles() files: Array<Express.Multer.File>, @Body() formData, @Headers('Authorization') header: string, @Res() res: Response) {
        const [video, thumbnail] = files
        console.log("video: " + video)
        console.log("thumbnail: " + thumbnail)
        const { title, description } = formData
        const data = await this.userService.getUser(header)
        console.log("data: " + JSON.stringify(data))
        const user = this.mapperService.mapGoogleDTOToGetDTO(data)
        console.log("user: " + JSON.stringify(user))
        const result = await this.cloudinaryService.upload(video)
        console.log("result: " + JSON.stringify(result))
        const imageResult = await this.thumbnailService.createThumbnail(thumbnail)
        console.log("thumbnail: " + JSON.stringify(imageResult))
        this.videoService.createVideo(result, user.id, title, description, imageResult?.secure_url)
        console.log("uploaded video")
        return res.json({ url: result.secure_url as string })
    }

    @Get("")
    @UseGuards(TokenGuard)
    async getVideos(@Res() res: Response) {
        const videos = await this.videoService.getVideos()
        console.log("your videos: " + JSON.stringify(videos))
        return res.json({ videos })
    }

    @Get("search/:search")
    async searchVideos(@Res() res: Response, @Param('search') search) {
        const videos = await this.videoService.searchVideos(search)
        console.log("your videos: " + JSON.stringify(videos))
        return res.json({ videos })
    }

    @Get(":id")
    async getVideo(@Param('id') videoId, @Res() res: Response) {
        console.log(videoId)
        const video = await this.videoService.findVideoById(videoId)
        const user = await this.userService.findUserById(video.creatorId)
        const videoDTO: GetVideoDTO = {
            ...video,
            creator: {
                id: video.creatorId,
                avatar: user.avatar,
                username: user.username
            }
        }
        return res.json({ video: videoDTO })
    }
}