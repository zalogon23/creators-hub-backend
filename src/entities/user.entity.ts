import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Video } from './video.entity';

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
}