import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserLikesSchema = new Schema({
    username: {
        type: String,
        ref: 'User',
        required: true
    },
    recipeName: {
        type: String,
        ref: 'Recipe',
        required: true
    },
    likedAt: {
        type: Date,
        default: Date.now
    }
});

const UserLikes = mongoose.models.UserLikes || mongoose.model('UserLikes', UserLikesSchema);

export default UserLikes;