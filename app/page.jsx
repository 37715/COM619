'use client'; // This ensures that the component is treated as a client-side component
import LoginForm from './components/LoginForm';
import RecipeCardComponent from './components/RecipeCardComponent';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [recipes, setRecipes] = useState([
    {
      name: "Mango Curry",
      author: "john doe",
      story: "this mango curry was passed down from my great grandma.",
      ingredients: ["curry mix", "mangos", "rice"],
      instructions: "mix curry mix in water stir in mangos, prepare rice with boiling water…",
      likes: 0,
      profilePic: null,
      comments: [],
      __v: 0,
      public: true,
    },
  ]);
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        const data = await response.json();
        console.log(data);
        setRecipes(data);
        setSelectedRecipe(data[0]);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-12 bg-gray-100 border-b border-gray-300">
        <div className="text-3xl font-bold text-black">Recipes!</div>
        <LoginForm />
        <div className="text-center mt-4">
          <Link href="/user-page">
            <input
              type="button"
              value="User Page"
              className="p-2 px-4 text-xl cursor-pointer bg-blue-500 text-white rounded-md"
            />
          </Link>
        </div>
      </header>
      <main className="flex flex-1">
        <div className="w-1/3 bg-gray-200 p-6 overflow-auto pr-4">
          <h3 className="border-b-2 border-gray-500 pb-2 mb-4 text-black">Recipe List:</h3>
          <ul className="text-xl">
            {recipes.length === 0 ? (
              <li className="text-black">No recipes found</li>
            ) : (
              recipes.map((recipe, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-black"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  {recipe.name}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="w-2/3 pl-4 pr-4">
          <RecipeCardComponent recipe={selectedRecipe} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
