import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/entities';
import { ILike, Repository } from 'typeorm';
import { v4 as uuid } from "uuid"
import { MapperService } from './mapper.service';
import { GetVideoSubscribedDTO } from 'src/dtos/get-video-subscribed-dto';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from "fs"

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
            const video = await this.videoService.createQueryBuilder('video')
                .leftJoinAndSelect('video.creator', 'creator')
                .leftJoin(
                    'Subscription',
                    'subscriptions',
                    'subscriptions.subscriberId = :userId AND subscriptions.subscribeeId = video.creatorId',
                    { userId }
                )
                .leftJoin(
                    'Reaction',
                    'reactions',
                    'reactions.reactorId = :userId AND reactions.videoId = :videoId',
                    { userId, videoId }
                )
                .addSelect('CASE WHEN subscriptions.id IS NOT NULL THEN true ELSE false END', 'subscribed')
                .addSelect('reactions.liked', 'liked')
                .where('video.id = :videoId', { videoId })
                .getRawOne();

            console.log(video)

            if (!video) {
                return null;
            }

            const videoDto = this.mapperService.mapVideoRawToGetVideoDTO(video)
            console.log(videoDto)

            return videoDto;
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

    async isValidVideo(videoBuffer: Buffer): Promise<boolean> {
        try {
            const maxDuration = this.configService.get('MAX_VIDEO_DURATION');
            if (!maxDuration) {
                return false;
            }
            const duration = await this.getVideoDuration(videoBuffer);
            return duration < +maxDuration;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async getVideoDuration(buffer: Buffer): Promise<number> {
        try {
            const tempFilePath = __dirname + "\\temp_video.mp4"
            fs.writeFileSync(tempFilePath, buffer);

            return new Promise<number>((resolve, reject) => {
                ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
                    fs.unlink(tempFilePath, unlinkErr => {
                        if (unlinkErr) {
                            console.error('Error deleting temporary file:', unlinkErr);
                        }
                        if (err) {
                            reject(err);
                            return;
                        }
                        const durationInSeconds = Math.ceil(metadata.format.duration);
                        resolve(durationInSeconds);
                    });
                });
            });
        } catch (err) {
            console.log(err);
            return Infinity;
        }
    }
}