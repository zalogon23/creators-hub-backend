import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Video } from './video.entity';
import { Reaction } from './reaction.entity';
import { Subscription } from './subscription.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
    @PrimaryColumn({
        name: 'user_id',
    })
    id: string;

    @Column({
        nullable: false,
        default: '',
    })
    username: string;

    @Column({
        nullable: false,
        default: '',
    })
    avatar: string;

    @Column({
        nullable: false,
        default: '',
    })
    description: string;

    @OneToMany(() => Video, video => video.creator)
    videos: Video[];

    @OneToMany(() => Reaction, reaction => reaction.user)
    reactions: Reaction[];

    @OneToMany(() => Subscription, subscription => subscription.subscribee)
    subscribers: Subscription[];

    @OneToMany(() => Subscription, subscription => subscription.subscriber)
    subscriptions: Subscription[];

    @OneToMany(() => Comment, comment => comment.commenter)
    comments: Comment[];
}