import { Controller, Get, Headers, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUserDTO } from 'src/dtos/get_user.dto';
import { UserService } from 'src/services/user.service';
import { Response } from "express"
import "isomorphic-fetch"
import { MapperService } from 'src/services/mapper.service';
import { TokenGuard } from 'src/strategies/guards/token.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly configService: ConfigService, private readonly mapperService: MapperService) { }

    @Get("")
    @UseGuards(TokenGuard)
    async getMe(@Headers('Authorization') header: string, @Res() res: Response) {
        try {
            const data = await this.userService.getUser(header)
            console.log(data)
            const googleId = data.names && data.names.length > 0 ? data.names[0].metadata.source.id : null;

            if (data?.error && data.error?.code) {
                return res.sendStatus(401)
            }

            const userFromDB = await this.userService.findUserById(googleId)
            console.log(userFromDB)

            if (!userFromDB) {
                const avatar = data.photos && data.photos.length > 0 ? data.photos[0].url : null;
                const username = data.names && data.names.length > 0 ? data.names[0].displayName : null;

                const user: GetUserDTO = {
                    id: googleId,
                    username,
                    description: "",
                    avatar
                }

                const newUser = this.mapperService.mapGetDTOToEntity(user)
                this.userService.createUser(newUser)

                return res.json(user);
            }

            return res.json(userFromDB);
        }
        catch (ex) {
            console.log(ex)
        }
    }

}
