import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Video } from './video.entity';
import { User } from './user.entity';

@Entity()
export class Subscription {
    @PrimaryColumn({
        name: 'subscription_id'
    })
    id: string;

    @Column({
        nullable: false
    })
    subscriberId: string;

    @Column({
        nullable: false
    })
    subscribeeId: string;

    @ManyToOne(() => User, user => user.subscriptions)
    @JoinColumn({ name: 'subscriberId' })
    subscriber: User;

    @ManyToOne(() => User, user => user.subscribers)
    @JoinColumn({ name: 'subscribeeId' })
    subscribee: User;
}