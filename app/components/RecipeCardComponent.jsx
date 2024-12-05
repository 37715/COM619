'use client';

const RecipeCardComponent = ({ recipe }) => {
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
        <p>{recipe.story}</p>
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
        <h4 className="border-b-2 border-gray-500 pb-2 mb-4 text-black my-3">Comments:</h4>
        <ul className="text-black">
          {recipe.comments.map((comment, index) => (
            <li key={index} className="mb-2">
              <p className="font-bold">{comment.username}</p>
              <p>{comment.text}</p>
              <p className="text-gray-500 text-sm">{new Date(comment.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeCardComponent;