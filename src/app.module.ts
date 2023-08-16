import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities, { User } from './entities';
import { RefreshTokenService } from './services/refresh-token.service';
import { MapperService } from './services/mapper.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { VideoController } from './controllers/video.controller';
import { CloudinaryProvider } from './cloudinary/cloudinary';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { VideoService } from './services/video.service';
import { ThumbnailService } from './services/thumbnail.service';
import { ReactionService } from './services/reaction.service';
import { SubscriptionService } from './services/subscription.service copy';
import { SubscriptionController } from './controllers/subscription.controller';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature(entities),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities,
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    PassportModule
  ],
  controllers: [UserController, VideoController, SubscriptionController, CommentController],
  providers: [RefreshTokenService, UserService, VideoService, MapperService, CloudinaryProvider, CloudinaryService, ThumbnailService, ReactionService, SubscriptionService, CommentService],
})
export class AppModule { }