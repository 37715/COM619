'use client';
import { useEffect, useState } from 'react';

const RecipeCardComponent = ({ recipe, onLike, onUnlike,  errorMSG, successMessage, currentComment, setComment, commentError, commentSuccess, addComment , editComment, editCommentError, editCommentSuccess , deleteComment, deleteCommentError, deleteCommentSuccess  }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null); 
  const [newCommentValue, setNewCommentValue] = useState(''); 
  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await fetch(`/api/userLikes/${recipe.name}`);
        if (response.status === 200) {
          setHasLiked(true);
        } else {
          setHasLiked(false);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkIfLiked();
  }, [recipe.name]);

  const handleLikeToggle = async () => {
    if (hasLiked) {
      await onUnlike(recipe.name);
      setHasLiked(false);
    } else {
      await onLike(recipe.name);
      setHasLiked(true);
    }
  }; 

  const toggleEditComment = (commentId, currentComment) => {
    if(editingCommentId === commentId) {
      setEditingCommentId(null);
      setNewCommentValue("");
    } else{
      setEditingCommentId(commentId);
      setNewCommentValue(currentComment);
    }
  };

  if (!recipe) {
        return <div>Loading...</div>;
      }
  return (
    <div className="h-full bg-gray-200 p-6 rounded-lg flex flex-col">
      <div className="bg-gray-300 flex justify-center items-center rounded-lg mb-4">
      </div>
      <div className="bg-gray-200 p-4 rounded-lg text-black mb-4 flex-grow">
        <h4 className="border-b-2 border-gray-500 pb-2 mb-4 text-black">Food Story:</h4>
        <p>Creator: {recipe.author}</p>
        <p> Story: {recipe.story}</p>
      </div>
      <div className="bg-gray-200 p-6 rounded-lg text-black flex-grow">
        <h4 className="border-b-2 border-gray-500 pb-2 mb-4 text-black">Ingredients:</h4>
        <ul className="text-black">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h4 className="border-b-2 border-gray-500 pb-2 mb-4 text-black my-3">Instructions:</h4>
        <p className="text-black">{recipe.instructions}</p>
        <h4 className="border-b-2 border-gray-500 pb-2 mb-4 text-black my-3">Likes:</h4>
        <p className="text-black">{recipe.likes}</p>
        <input type="button"
          value={hasLiked ? "Unlike": "Like"} className={`p-2 px-4 text-xl cursor-pointer ${hasLiked ? "bg-red-500": "bg-blue-500" } bg-blue-500 text-white rounded-md mt-2`}
          onClick={handleLikeToggle} />
        <p className="text-red-500">{errorMSG}</p>
        <p className="text-green-500">{successMessage}</p>
        <h4 className="border-b-2 border-gray-500 pb-2 mb-4 text-black my-3">Comments:</h4>
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Add a comment" 
            className="p-2 px-4 text-xl bg-gray-100 text-black rounded-md mt-2" 
            value={currentComment}
            onChange={(e) => setComment(e.target.value)}
          />
          <input 
            type="button" 
            value="Add Comment (User)" 
            className="p-2 px-4 text-xl cursor-pointer bg-blue-500 text-white rounded-md mt-2" 
            onClick={()=> addComment(recipe.name, currentComment)}
          />
        </div>

        <p className="text-red-500">{commentError}</p>
        <p className="text-green-500">{commentSuccess}</p>

        <div className="space-y-4 mt-4">
          {recipe.comments.map((comment, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md space-y-2">
            <p className="font-bold text-black">{comment.userName}</p>
            <p className="text-black">{comment.comment}</p>
            <p className="text-gray-500 text-sm">
              {new Date(comment.date).toLocaleDateString()}
            </p>
            <input type="button" value="Edit" className="p-2 px-4 text-xl cursor-pointer bg-blue-500 text-white rounded-md mt-2 mr-2 ml-2" onClick={() => toggleEditComment(comment._id, comment.comment)} />
            <input type="button" value="Delete" className="p-2 px-4 text-xl cursor-pointer bg-red-500 text-white rounded-md mt-2 mr-2 ml-2" onClick={() => deleteComment(recipe.name, comment.comment)} />
            {editingCommentId === comment._id && (
              <div className="flex items-center space-x-4">
                <input 
                  type="text" 
                  placeholder="Edit comment" 
                  className="p-2 px-4 text-xl bg-gray-100 text-black rounded-md mt-2" 
                  value={newCommentValue}
                  onChange={(e) => setNewCommentValue(e.target.value)}
                />
                <input 
                  type="button" 
                  value="Save" 
                  className="p-2 px-4 text-xl cursor-pointer bg-blue-500 text-white rounded-md mt-2" 
                  onClick={()=> editComment(recipe.name, comment.comment, newCommentValue)}
                />
                <p className="text-red-500">{editCommentError}</p>
                <p className="text-green-500">{editCommentSuccess}</p>

              </div>
            )}
            </div>
          ))}
        </div>
        <p className="text-red-500">{deleteCommentError}</p>
        <p className="text-green-500">{deleteCommentSuccess}</p>

      </div>
    </div>
  );
};

export default RecipeCardComponent;


