'use client';

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { get } from 'mongoose';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'; 

const UserPage = () => {
  // page setup state variables
  const { data: session } = useSession();  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [likes, setLikes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userRecipeError, setUserRecipeError] = useState(null);

  // recipe form state variables
  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [story, setStory] = useState('');
  const [Public, setPublic] = useState(true);
  const [recipeError, setRecipeError] = useState(null);
  const [recipeSuccess, setRecipeSuccess] = useState(null);

  const [isEditing, setIsEditing] = useState(false); 
  const [newUsername, setNewUsername] = useState(''); 
  const [usernameSuccess, setUsernameSuccess] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
 


  const handleLogout = async () => {
    await signOut({ redirect: false });  
    redirect('/');
  };

  const addRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: recipeName,
          author: session.user.name,
          story: story,
          ingredients: ingredients.split(',').map((ingredient) => ingredient.trim()),
          instructions: instructions,
          likes: 0,
          profilePic: '',
          Public: Public ,
          comments: [],
          Category: category,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setRecipeError('Failed to add recipe');
        setRecipeSuccess(null);
        console.log(data.error);
        return;
      }
      const userRecipeResponse = await fetch(`/api/userRecipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          recipeName,
        }),
      });
      const userRecipeData = await userRecipeResponse.json();
      if (!userRecipeResponse.ok) {
        setRecipeError('Failed to add recipe');
        setRecipeSuccess(null);
        console.log(userRecipeData.error);
        setTimeout(() => {
          setRecipeError(null);
          setRecipeSuccess(null);
        }, 3000);
        return;
      }
      setRecipeError(null);
      console.log('Recipe added:', data);
      setRecipeName('');
      setCategory('');
      setIngredients('');
      setInstructions('');
      setStory('');
      setPublic(true);
      setRecipeSuccess(data.message);
      
      setUserRecipes((prevUserRecipes) => [
        ...prevUserRecipes, 
        { recipeName: recipeName }  
      ]);
      setTimeout(() => {
        setRecipeError(null);
        setRecipeSuccess(null);
      }, 3000);
    } catch (err) {
      console.log('Error adding recipe:', err);
      setRecipeError('Failed to add recipe');
      setTimeout(() => {
        setRecipeError(null);
        setRecipeSuccess(null);
      }, 3000);
    }
  };

  const clearRecipeForm = () =>{
    setRecipeName('');
    setCategory('');
    setIngredients('');
    setInstructions('');
    setStory('');
    setPublic(true);
    setRecipeError(null);
    setRecipeSuccess(null);
  };

  const handleDeleteRecipe = async (recipeName) => {
    if (!window.confirm(`Are you sure you want to delete the recipe: ${recipeName}?`)) {
      return; 
    }
    try {
      const response = await fetch(`/api/recipes/${recipeName}/delete`, {
        method: 'DELETE',
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        console.log('Recipe deleted successfully');
        setUserRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.recipeName !== recipeName)
        );

      } else {
        console.error('Error deleting recipe:', data.error);
        setUserRecipeError(data.error || 'Failed to delete recipe.');
        setTimeout(() => {
          setUserRecipeError(null);
        }, 3000);
      }
    } catch (error) {
      console.log('Error deleting recipe:', error);
      setUserRecipeError('Error deleting recipe.');
      setTimeout(() => {
        setUserRecipeError(null);
      }, 3000);
    }
  };

  const changeUsername = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          newUsername: newUsername,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setUsernameError(data.error || 'Failed to update username.');
        setUsernameSuccess(null);
        setTimeout(() => {
          setUsernameError(null);
          setUsernameSuccess(null);
        }, 3000);
        return;
      }
      alert('Username updated. Please log in with new username');
      handleLogout();
      setUsernameError(null);
      setUsernameSuccess(data.message);
      console.log('Username updated:', data);
    } catch (err) {
      console.log('Error updating username:', err);
      setUsernameError('Failed to update username.');
      setTimeout(() => {
        setUsernameError(null);
        setUsernameSuccess(null);
      }, 3000);
    }
  };
  
  const fetchSession = async () => {
    try {
      const response = await fetch('/api/session');
      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }
      const fetchedSession = await response.json();
      console.log('Fetched session:', fetchedSession);
      if (fetchedSession.error) {
        redirect('/'); 
      } else {
        
      }
    } catch (err) {
      console.log('Error fetching session:', err);
      setError('Failed to load session.');
      redirect('/'); 
    } finally {
      setLoading(false);
    }
  };
  const getLikes = async () => {
    try {
      const response = await fetch('/api/userLikes');
      if (!response.ok) {
        throw new Error('Failed to fetch likes');
      }
      const fetchedLikes = await response.json();
      setLikes(fetchedLikes.likes);
    } catch (err) {
      console.log('Error fetching likes:', err);
    }
  };

  const getUserRecipes = async () => {
    try {
      const response = await fetch('/api/userRecipes');
      if (!response.ok) {
        throw new Error('Failed to fetch user recipes');
      }
      const fetchedUserRecipes = await response.json();
      setUserRecipes(fetchedUserRecipes.recipes);
    } catch (err) {
      console.log('Error fetching user recipes:', err);
      setUserRecipeError('Failed to load user recipes.');
    }
  };


  useEffect(() => {
    fetchSession();
    getLikes();
    getUserRecipes();
  }, []);

  useEffect(() => {
    fetchSession();
  }, []); 

  useEffect(() => {
    if (session) {
      getLikes();
      getUserRecipes();
    }

    setLoading(false); 

  }, [session]);  

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  if (!session) {
    return null; 
  }

  return (
    <div>
      <header className="flex items-center justify-between bg-gray text-white p-4">
        <div className="text-xl font-bold">User Profile</div>
        <div className="flex items-center space-x-4 ml-auto">
          <span id="welcome-message" className="text-sm">
            Welcome, {session.user.name}
          </span>
          <Link href="/">
            <input
              type="button"
              value="Go to Recipes Page"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
              id="recipes-btn"
            />
          </Link>
          <input
            type="button"
            value="Log Out"
            id="logout-btn"
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </header>

      <div className="container mx-auto flex mt-8 space-x-4">
        <div className="left-column w-1/3 bg-white shadow rounded p-4">
          <div className="header-banner bg-gray-300 h-24 rounded flex items-center justify-center">
            <h1 className="text-xl font-semibold text-black text-center">Profile</h1>
          </div>
          <div className="profile-section mt-4">
            <div className="profile-pic bg-gray-400 h-20 w-20 rounded-full mx-auto"></div>
            <div className="username-section flex items-center justify-between mt-4">
              <div className="username text-lg font-semibold text-black mr-2">{session.user.name}</div>
              <input
                type="button"
                value="Change Picture(Note: Not Implemented)"
                className="change-btn text-sm text-blue-600 hover:underline cursor-pointer"
              />
            </div>
            <input
              type="button"
              value="Edit Username (Will be logged out and Redirected)"
              className="edit-btn mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full cursor-pointer"
              onClick={() => setIsEditing(!isEditing)}
              id="edit-username-btn"
            />
            {isEditing && (
              <div className="edit-username-box mt-4">
                <input
                  type="text"
                  className="input-box w-full p-2 border border-gray-300 rounded text-black"
                  placeholder="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <input
                  type="button"
                  value="Save"
                  className="save-btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer mt-2"
                  onClick={changeUsername}
                  id="save-username-btn"
                />
              </div>
            )}
            <p className="text-green-500">{usernameSuccess}</p>
            <p className="text-red-500">{usernameError}</p>
          </div>
          <div className="info-section mt-6">
            <div className="likes-box mb-2">
              <span className="font-bold text-black">My Recipes:</span>
              <ul className="likes-list text-black">
              {Array.isArray(userRecipes) && userRecipes.length === 0 ? (
                <li className="text-black">No Recipes found</li>
              ) : (
                Array.isArray(userRecipes) && userRecipes.map((recipe, index) => (
                  <li className="text-black mb-4 flex items-center justify-between" key={index}>
                    <span>{recipe.recipeName}</span>
                    <input type="button" value="Delete" className="delete-btn bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded cursor-pointer" onClick={() => handleDeleteRecipe(recipe.recipeName)} id={`delete-recipe${recipe.recipeName}`} />
                  </li>
                ))
              )}
              </ul>
              {userRecipeError && <div className="text-red-500">{userRecipeError}</div>}
            </div>
            <div className="recipes-box">
              <span className="font-bold text-black">Likes:</span>
              <ul className="likes-list text-black">
              {Array.isArray(likes) && likes.length === 0 ? (
                <li className="text-black">No Likes found</li>
              ) : (
                Array.isArray(likes) && likes.map((like, index) => (
                  <li className="text-black" key={index}>{like.recipeName}</li>
                ))
              )}
              </ul>
              {error && <div className="text-red-500">{error}</div>}

            </div>
          </div>
        </div>
        <div className="divider w-px bg-gray-300"></div>
        <div className="right-column w-2/3 bg-white shadow rounded p-4">
          <div className="image-upload-box mb-4 text-center p-6 bg-gray-200 rounded">
            <h1 className="text-lg font-semibold mb-4 text-black">Upload a Recipe</h1>
          </div>
          <input
            type="text"
            className="input-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Recipe Name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
          <input
            type="text"
            className="input-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <textarea
            className="textarea-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Ingredients (Separated by comma)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          ></textarea>
          <textarea
            className="textarea-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Instructions (Separated by comma)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          ></textarea>
          <textarea
            className="textarea-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
          ></textarea>
          <div className="privacy-box flex items-center mb-4">
            <input
              type="radio"
              name="privacy"
              id="public"
              value="public"
              className="mr-2"
              checked={Public === true}
              onChange={() => setPublic(true)}
            />
            <label htmlFor="public" className="text-black">
              Public
            </label>
            <input
              type="radio"
              name="privacy"
              id="private"
              value="private"
              className="ml-4 mr-2"
              checked={Public === false}
              onChange={() => setPublic(false)}
            />
            <label htmlFor="private" className="text-black">
              Private
            </label>
          </div>
          <div className="button-group flex space-x-4">
            <input
              type="button"
              value="Upload"
              className="upload-btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer"
              onClick={addRecipe}
              id="upload-recipe-btn"
            />
            <input
              type="button"
              value="Clear"
              className="clear-btn bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded cursor-pointer"
              onClick={clearRecipeForm}
              id="clear-recipe-btn"
            />
            <p className="text-green-500">{recipeSuccess}</p>
            <p className="text-red-500">{recipeError}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
