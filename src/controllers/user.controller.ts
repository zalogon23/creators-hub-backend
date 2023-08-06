import { Controller, Get, Headers, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUserDTO } from 'src/dtos/get_user.dto';
import { UserService } from 'src/services/user.service';
import { Response } from "express"
import "isomorphic-fetch"
import { MapperService } from 'src/services/mapper.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly configService: ConfigService, private readonly mapperService: MapperService) { }

    @Get("")
    async getMe(@Headers('Authorization') header: string, @Res() res: Response) {
        if (!header) return res.sendStatus(401)
        console.log("The header is: " + header)

        const data = await this.userService.getUser(header)

        if (data?.error && data.error?.code) {
            return res.sendStatus(401)
        }

        console.log(JSON.stringify(data.names.length))
        data.names.forEach(name => console.log(JSON.stringify(name.metadata.source)))

        const avatar = data.photos && data.photos.length > 0 ? data.photos[0].url : null;
        const googleId = data.names && data.names.length > 0 ? data.names[0].metadata.source.id : null;
        const username = data.names && data.names.length > 0 ? data.names[0].displayName : null;

        const user: GetUserDTO = {
            id: googleId,
            username,
            description: "",
            avatar
        }

        const doesUserExistsDB = !! await this.userService.findUserById(googleId)

        if (!doesUserExistsDB) {
            const newUser = this.mapperService.mapToUser(user)
            this.userService.createUser(newUser)
        }

        return res.json(user);
    }

}
