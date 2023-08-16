import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/dtos/create-user.dto';
import { GetVideoDTO } from 'src/dtos/get-video-dto';
import { GetUserDTO } from 'src/dtos/get_user.dto';
import { User, Video } from 'src/entities';

@Injectable()
export class MapperService {
    mapGetDTOToEntity(user: GetUserDTO): UserDTO {
        return {
            id: user.id,
            username: user.username,
            description: "",
            avatar: user.avatar
        }
    }
    mapGoogleDTOToGetDTO(data: any): GetUserDTO {
        const avatar = data.photos && data.photos.length > 0 ? data.photos[0].url : null;
        const googleId = data.names && data.names.length > 0 ? data.names[0].metadata.source.id : null;
        const username = data.names && data.names.length > 0 ? data.names[0].displayName : null;

        const user: GetUserDTO = {
            id: googleId,
            username,
            description: "",
            avatar
        }
        return user
    }
    mapVideoEntityToGetVideoDTO(video: Video): GetVideoDTO {
        return {
            id: video.id,
            description: video.description,
            duration: video.duration,
            title: video.title,
            url: video.url,
            thumbnail: video.thumbnail,
            creator: {
                id: video.creator.id,
                avatar: video.creator.avatar,
                username: video.creator.username
            }
        }
    }
}
