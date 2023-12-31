import { Comment } from "./comment.entity";
import { Reaction } from "./reaction.entity";
import { Subscription } from "./subscription.entity";
import { User } from "./user.entity";
import { Video } from "./video.entity";

const entities = [
    User, Video, Reaction, Subscription, Comment
]

export { User, Video, Reaction, Subscription, Comment }

export default entities;