import { Body, Controller, Get, Headers, Put, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUserDTO } from 'src/dtos/get_user.dto';
import { UserService } from 'src/services/user.service';
import { Response } from "express"
import { MapperService } from 'src/services/mapper.service';
import { TokenGuard } from 'src/strategies/guards/token.guard';
import { SubscriptionService } from 'src/services/subscription.service copy';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly userService: UserService, private readonly subscriptionService: SubscriptionService, private readonly mapperService: MapperService) { }

    @Put("")
    @UseGuards(TokenGuard)
    async subscribe(@Headers('Authorization') header: string, @Res() res: Response, @Body() body) {
        try {

            const data = await this.userService.getUser(header)
            const user = this.mapperService.mapGoogleDTOToGetDTO(data)
            if (!user) return res.status(401).json({ message: "Couldn't find user" })
            const successful = await this.subscriptionService.subscribe(body, user.id)

            return res.json({ successful });
        }
        catch (ex) {
            console.log(ex)
            return res.status(500).json({ message: "Server error in Subscription Controller" })
        }
    }

}
