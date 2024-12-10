import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
        required: false,
        default: '', 
    },

});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;