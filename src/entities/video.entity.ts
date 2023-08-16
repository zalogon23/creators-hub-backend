import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Reaction } from './reaction.entity';
import { Comment } from './comment.entity';

@Entity()
export class Video {
    @PrimaryColumn({
        name: 'video_id'
    })
    id: string;

    @Column({
        nullable: false
    })
    creatorId: string;

    @Column({
        nullable: false
    })
    thumbnail: string;

    @Column({
        nullable: false
    })

    title: string;
    @Column({
        nullable: false
    })
    description: string;

    @Column({
        nullable: false
    })
    url: string;

    @Column({
        nullable: false
    })
    duration: number;

    @ManyToOne(() => User, user => user.videos)
    @JoinColumn({ name: 'creatorId' })
    creator: User;

    @OneToMany(() => Reaction, reaction => reaction.video)
    reactions: Reaction[];

    @OneToMany(() => Comment, comment => comment.video)
    comments: Comment[];
}