import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { CreateSubscriptionDTO } from "src/dtos/create-subscription-dto"
import { GetSubscriptionDTO } from "src/dtos/get-subscription-dto copy"
import { Subscription } from "src/entities/subscription.entity"
import { Repository } from "typeorm"
import { v4 as uuid } from "uuid"


@Injectable()
export class SubscriptionService {
    constructor(@InjectRepository(Subscription) private subscriptionRepository: Repository<Subscription>) { }

    async subscribe(subscriptionDto: CreateSubscriptionDTO, subscriberId) {
        try {
            const subscription = {
                id: uuid(),
                subscriberId,
                subscribeeId: subscriptionDto.subscribeeId,
            }
            const existSubscription = await this.subscriptionRepository.findOneBy({ subscriberId: subscription.subscriberId, subscribeeId: subscription.subscribeeId })
            if (existSubscription) {
                if (subscriptionDto.subscribed) {
                    return true
                } else {
                    this.subscriptionRepository.remove(existSubscription)
                    return true
                }
            }
            const result = await this.subscriptionRepository
                .createQueryBuilder()
                .insert()
                .into(Subscription)
                .values(subscription)
                .execute()
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }
}