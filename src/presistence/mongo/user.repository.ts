import mognoose, { Schema, Document, Model } from 'mongoose';
import { User, Role } from '../../@core/models';
import { enumToArray } from '../../@utils';

interface UserModel extends Model<UserDoc> {
    build(user: Omit<User, 'id'>): UserDoc;
}



interface UserDoc extends Document {
    _id: string;
    username: string;
    email: string;
    displayName: string;
    password: string;
    roles: Role[];
}

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    displayName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    roles: {
        type: Number,
        enum: enumToArray(Role),
    }
});

UserSchema.statics.build = (User: User) => new UserRepository(User);

const UserRepository = mognoose.model<UserDoc, UserModel>('User', UserSchema);

export { UserRepository };