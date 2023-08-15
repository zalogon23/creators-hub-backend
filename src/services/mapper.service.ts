import { Injectable } from '@nestjs/common';
import { GetUserDTO } from 'src/dtos/get_user.dto';
import { User } from 'src/entities';

@Injectable()
export class MapperService {
    mapGetDTOToEntity(user: GetUserDTO): User {
        return {
            id: user.id,
            username: user.username,
            description: "",
            avatar: user.avatar,
            videos: [],
            reactions: []
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
}
