import { Controller, Post, Headers, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from "express"
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { v4 as uuid } from "uuid"
import { VideoService } from 'src/services/video.service';

@Controller('video')
export class VideoController {
    constructor(private readonly cloudinaryService: CloudinaryService, private readonly videoService: VideoService) { }

    @Post("")
    @UseInterceptors(FileInterceptor("video"))
    async getMe(@UploadedFile() video, @Headers('Authorization') header: string, @Res() res: Response) {
        console.log(video)
        const result = await this.cloudinaryService.upload(video)
        this.videoService.createVideo(result, "117352855603015320770")
        return res.json({ url: result.secure_url as string })
    }
    getExtension(str) {
        // Match the last occurrence of ".ext" using a regular expression
        const regex = /\.([a-z0-9]+)$/i;
        const match = str.match(regex);

        if (match) {
            // Extract and return the extension (group 1 of the match)
            return match[1];
        } else {
            // Return an empty string if no extension is found
            return '';
        }
    }
    getFileName(str) {
        // Find the last occurrence of a dot in the string
        const lastDotIndex = str.lastIndexOf('.');

        if (lastDotIndex !== -1) {
            // Extract the part of the string before the last dot
            return str.substring(0, lastDotIndex);
        } else {
            // If there is no dot, return the entire string
            return str;
        }
    }
}
