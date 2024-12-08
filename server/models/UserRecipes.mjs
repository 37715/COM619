import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserRecipesSchema = new Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserRecipes =  mongoose.models.UserRecipes || mongoose.model('UserRecipes', UserRecipesSchema);

export default UserRecipes;