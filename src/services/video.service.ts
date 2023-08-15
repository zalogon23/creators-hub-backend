import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/entities';
import { ILike, Repository } from 'typeorm';
import { v4 as uuid } from "uuid"

@Injectable()
export class VideoService {
    constructor(@InjectRepository(Video) private videoService: Repository<Video>, private readonly configService: ConfigService) { }

    async createVideo(createVideoDto: any, creatorId: string, title: string, description: string, thumbnail: string) {
        try {
            const video = {
                id: uuid(),
                creatorId,
                url: createVideoDto.secure_url,
                duration: Math.ceil(createVideoDto.duration),
                title,
                description,
                thumbnail: thumbnail ? thumbnail : this.configService.get("DEFAULT_THUMBNAIL")
            }
            const result = await this.videoService
                .createQueryBuilder()
                .insert()
                .into(Video)
                .values(video)
                .execute()
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    async findVideoById(id: string) {
        try {
            return await this.videoService.findOneBy({ id })
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async getVideos() {
        try {
            return this.videoService.find({
                relations: ['creator'],
            });

        } catch (err) {
            console.log(err)
            return null
        }
    }

    async searchVideos(search: string) {
        try {
            return this.videoService.find({
                relations: ['creator'],
                where: {
                    title: ILike(`%${search}%`)
                }
            });

        } catch (err) {
            console.log(err)
            return null
        }
    }
}