import { Injectable } from '@nestjs/common';
import { GetUserDTO } from 'src/dtos/get_user.dto';
import { User } from 'src/entities';

@Injectable()
export class MapperService {
    mapToUser(user: GetUserDTO): User {
        return {
            id: user.id,
            username: user.username,
            description: ""
        }
    }
}
