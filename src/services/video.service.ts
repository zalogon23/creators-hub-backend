import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class VideoService {
    constructor(@InjectRepository(Video) private videoService: Repository<Video>, private readonly configService: ConfigService) { }

    async createVideo(createVideoDto: any, creatorId: string) {
        try {
            const video = {
                creatorId,
                url: createVideoDto.secure_url,
                duration: Math.ceil(createVideoDto.duration * 60)
            }
            const result = await this.videoService
                .createQueryBuilder()
                .insert()
                .into(Video)
                .values(video)
                .execute()
        } catch (err) {
            console.log(err)
        }
    }

    async findVideoById(id: string) {
        try {
            console.log("again: " + id)
            return await this.videoService.findOneBy({ id })
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async getVideo(header: string) {
        try {

            const apiKey = this.configService.get("API_KEY")
            const response = await fetch(`https://people.googleapis.com/v1/people/me?personFields=names,photos&key=${apiKey}`, {
                headers: {
                    "Authorization": header,
                },
            })
            const data = await response.json()
            return data
        } catch (err) {
            console.log(err)
            return null
        }
    }
}