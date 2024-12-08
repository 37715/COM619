import mongoose from 'mongoose';


const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  author:{
    type: String,
    required: true,
  },
  story:{
    type: String,
    required: true,
  },
  ingredients: {
    type: [String], 
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0, 
  },
  profilePic: {
    type: String,
    required: false,
  },
  Public:{
    type: Boolean,
    default: true,
  },
  comments:[
    {
      userName: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  Category:{  
    type: String,
    required: true,
  },
});


const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

export default Recipe;
