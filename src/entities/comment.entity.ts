import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Video } from './video.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
    @PrimaryColumn({
        name: 'comment_id'
    })
    id: string;

    @Column({
        nullable: false
    })
    commenterId: string;

    @Column({
        nullable: false
    })
    videoId: string;

    @Column({
        nullable: false
    })
    content: string;

    @Column({
        nullable: false
    })
    commentedAt: Date;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'commenterId' })
    commenter: User;

    @ManyToOne(() => Video, video => video.comments)
    @JoinColumn({ name: 'videoId' })
    video: Video;
}