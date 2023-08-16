import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GetVideoDTO } from 'src/dtos/get-video-dto';
import { Video } from 'src/entities';
import { ILike, JsonContains, Repository } from 'typeorm';
import { v4 as uuid } from "uuid"
import { MapperService } from './mapper.service';
import { GetVideoSubscribedDTO } from 'src/dtos/get-video-subscribed-dto';

@Injectable()
export class VideoService {
    constructor(@InjectRepository(Video) private videoService: Repository<Video>, private readonly configService: ConfigService, private readonly mapperService: MapperService) { }

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

    async findVideoById(videoId: string, userId?: string): Promise<GetVideoSubscribedDTO> {
        try {
            const video = await this.videoService.findOne({
                relations: ['creator', 'creator.subscribers'],
                where: {
                    id: videoId
                }
            })

            if (!video) {
                return null;
            }

            const videoDto = this.mapperService.mapVideoEntityToGetVideoDTO(video)

            console.log("video: " + JSON.stringify(video))
            console.log("creator: " + JSON.stringify(video.creator))
            console.log("subscribers: " + JSON.stringify(video.creator.subscribers))
            console.log("my id: " + JSON.stringify(userId))

            const subscribed = userId ? video.creator.subscribers.some(subscriber => subscriber.subscriberId === userId) : false;

            return { ...videoDto, subscribed } as GetVideoSubscribedDTO;
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async getVideos() {
        try {
            const videos = await this.videoService.find({
                relations: ['creator'],
            });
            return videos.map(video => this.mapperService.mapVideoEntityToGetVideoDTO(video))

        } catch (err) {
            console.log(err)
            return null
        }
    }

    async searchVideos(search: string) {
        try {
            const videos = await this.videoService.find({
                relations: ['creator'],
                where: {
                    title: ILike(`%${search}%`)
                }
            });
            return videos.map(video => this.mapperService.mapVideoEntityToGetVideoDTO(video))

        } catch (err) {
            console.log(err)
            return null
        }
    }
}