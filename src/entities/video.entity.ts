import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

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
}