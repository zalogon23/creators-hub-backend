import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Video } from './video.entity';
import { User } from './user.entity';

@Entity()
export class Reaction {
    @PrimaryColumn({
        name: 'reaction_id'
    })
    id: string;

    @Column({
        nullable: false
    })
    reactorId: string;

    @Column({
        nullable: false
    })
    videoId: string;

    @Column({
        nullable: false
    })

    liked: boolean;

    @ManyToOne(() => Video, video => video.reactions)
    @JoinColumn({ name: 'videoId' })
    video: Video;

    @ManyToOne(() => User, user => user.reactions)
    @JoinColumn({ name: 'reactorId' })
    user: User;
}