import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/entities';
import { ILike, Repository } from 'typeorm';
import { v4 as uuid } from "uuid"
import { MapperService } from './mapper.service';
import { GetVideoSubscribedDTO } from 'src/dtos/get-video-subscribed-dto';
import getVideoDurationProcess from 'get-video-duration';
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { Readable } = require('stream');
const childProcess = require('child_process');

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
            console.log("got in the is valid function")
            const maxDuration = this.configService.get('MAX_VIDEO_DURATION');
            if (!maxDuration) {
                return false;
            }
            const duration = await this.getVideoDuration(videoBuffer);
            console.log("received the video duration: " + duration)
            return duration < +maxDuration;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async getVideoDuration(buffer: Buffer): Promise<number> {
        try {
            const tempFilePath = __dirname + "/temp_video.mp4";
            fs.writeFileSync(tempFilePath, buffer);

            const durationInSeconds = await getVideoDurationProcess(tempFilePath);
            fs.unlinkSync(tempFilePath); // Delete the temporary file

            return Math.ceil(durationInSeconds);
        } catch (err) {
            console.log(err);
            return Infinity;
        }
    }


    async convertToMp4(file): Promise<Buffer> {
        // Create a temporary file path
        const tempExtension = path.extname(file.originalname) as string;

        if (tempExtension.includes("mp4")) {
            console.log("Already MP4")
            return file.buffer
        }
        const fileBuffer = file.buffer
        const tempFilePath = path.join(__dirname, `temp${tempExtension}`);

        const tempOutputFilePath = path.join(__dirname, 'temp_output.mp4');

        // Write the buffer to the temporary file
        fs.writeFileSync(tempFilePath, fileBuffer);
        console.log(fileBuffer.length)

        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(tempFilePath)
                .outputOptions('-c:v', 'libx264')
                .outputOptions('-c:a', 'aac')
                .outputOptions('-f', 'mp4') // Specify the output format
                .output(tempOutputFilePath)
                .on('end', () => {
                    const convertedData = fs.readFileSync(tempOutputFilePath); // Read the temporary output file
                    fs.unlinkSync(tempFilePath); // Delete the temporary input file
                    fs.unlinkSync(tempOutputFilePath); // Delete the temporary output file
                    console.log('Converted data length:', convertedData.length);
                    resolve(convertedData);
                })
                .on('error', (err, stdout, stderr) => {
                    console.error('Error during conversion:', stderr);
                    reject(err);
                })
                .run()
        })
    }

    async checkFFmpegExistence() {
        return new Promise((resolve) => {
            childProcess.exec('ffmpeg -version', (error, stdout) => {
                if (error) {
                    console.error('FFmpeg not found:', error);
                    resolve(false);
                } else {
                    console.log('FFmpeg exists:');
                    console.log(stdout);
                    resolve(true);
                }
            });
        });
    }

}