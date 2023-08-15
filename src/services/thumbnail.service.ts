import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class ThumbnailService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    async createThumbnail(thumbnail: Express.Multer.File) {
        try {
            const imageResult = await this.cloudinaryService.upload(thumbnail, "image")
            console.log(imageResult)
            return imageResult
        } catch (err) {
            console.log(err)
        }
    }
}