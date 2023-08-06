import { Column, Entity, PrimaryColumn } from 'typeorm';

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
    url: string;

    @Column({
        nullable: false
    })
    duration: number;
}