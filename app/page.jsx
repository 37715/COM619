'use client'; // This ensures that the component is treated as a client-side component
import LoginForm from './components/LoginForm';
import RecipeCardComponent from './components/RecipeCardComponent';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';




const HomePage = () => {
  const [recipes, setRecipes] = useState([
    {
      name: "Loading...",
      author: "Loading...",
      story: "Loading...",
      ingredients: ["Loading..."],
      instructions: "Loading...",
      likes: 0,
      profilePic: null,
      comments: [],
      public: true,
    },
  ]);
  const { data: session, status } = useSession();
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]);
  const [userRecipes, setUserRecipes] = useState([
  ]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccess] = useState(null);
  const [currentComment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState(null);

  const [updateCount, setUpdateCount] = useState(0);

  const [editCommentError, setEditCommentError] = useState('');
  const [editCommentSuccess, setEditCommentSuccess] = useState('');

  const [deleteCommentError, setDeleteCommentError] = useState('');
  const [deleteCommentSuccess, setDeleteCommentSuccess] = useState('');


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

    const fetchUserRecipes = async () => {
      try {
        const response = await fetch('/api/myRecipes');
        const data = await response.json();
        console.log(data);
        setUserRecipes(data.recipes);
        console.log(data.recipes);
        
      } catch (error) {
        console.log('Error fetching user recipes:', error);
      }
    };

    fetchRecipes();
    if (session) {
      fetchUserRecipes();
    }
  }, [session, updateCount]);

  const onLike = async (name) => {
    try {
      
      const alreadyLikedResponse = await fetch(`/api/userLikes/${name}`);

  
      if (alreadyLikedResponse.status === 401) {
        const alreadyLikedData = await alreadyLikedResponse.json();
        console.log('Unauthorized: Please log in');
        setError(alreadyLikedData.error);
        setSuccess(null);
        return; 
      }
  
      if (alreadyLikedResponse.status === 200) {
        const alreadyLikedData = await alreadyLikedResponse.json();
        console.log('User already liked this recipe');
        setSuccess(alreadyLikedData.message);
        console.log(successMessage);
        setError(null);
        return; 
      }
  
      
      if (alreadyLikedResponse.status === 204) {
        console.log('Recipe not found, proceeding to update likes');
  
        
        const response = await fetch(`/api/recipes/${name}/likes`, { method: 'PATCH' });
        const data = await response.json();
  
        if (response.status === 200) {
          console.log('Likes updated successfully');
  
          const userLikesResponse = await fetch(`/api/userLikes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipeName: name }),
          });
          const userLikesData = await userLikesResponse.json();
  
          if (userLikesResponse.status === 201) {
            console.log('Recipe liked successfully');
            setSuccess(userLikesData.message);
            setError(null);
          } else {
            console.log('Error liking recipe');
            setSuccess(null);
            setError(userLikesData.error);
          }
          setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) =>
              recipe.name === name ? { ...recipe, likes: data.data.recipe.likes } : recipe
            )
          );
          setSelectedRecipe((prevRecipe) => ({
            ...prevRecipe,
            likes: data.data.recipe.likes,
          }));
          setUpdateCount(updateCount + 1);
        } else {
          console.log('Error updating likes');
          setSuccess(null);
          setError(data.error);
        }
      }
  
      
      if (alreadyLikedResponse.status === 500) {
        const alreadyLikedData = await alreadyLikedResponse.json();
        console.log('Error fetching likes');
        setError(alreadyLikedData.error);
      }
    } catch (error) {
      console.log('Error during like process:', error);
      setSuccess(null);
      setError('Error processing like request');
    }
  };

  const onUnlike = async (name) => {
    try {
      const response = await fetch(`/api/recipes/unlike`, { method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeName: name })
      });
      const data = await response.json();
      if (response.status === 200) {
        setSuccess('Recipe unliked successfully');
        setError(null);
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.name === name ? { ...recipe, likes: data.recipe.likes } : recipe
          )
        );
        setSelectedRecipe((prevRecipe) => ({
          ...prevRecipe,
          likes: data.recipe.likes,
        }));
      } else {
        setError(data.error);
        setSuccess(null);
      }
    } catch (error) {
      console.log('Error unliking recipe:', error);
      setError('Error unliking recipe');
      setSuccess(null);
    }
  };
  
  

  const addComment = async (name, comment) => {
    try {
      const response = await fetch(`/api/comment/${name}`, {
        method: 'POST',
        body: JSON.stringify({
          comment: comment,
        }),
      });
      const data = await response.json();
      console.log(data);
      switch (response.status) {
        case 200:
          console.log('Comment added successfully');
          setCommentError(null);
          setCommentSuccess(data.message);
          setComment('');
          setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) =>
              recipe.name === name
                ? { ...recipe, comments: [...recipe.comments, ...data.recipe.comments] }
                : recipe
            )
          );
          setSelectedRecipe((prevRecipe) => ({
            ...prevRecipe,
            comments: [...prevRecipe.comments, ...data.recipe.comments],
          }));
          setUpdateCount(updateCount + 1);
          break;
        case 401:
          console.log('Unauthorized');
          setCommentError(data.error);
          setCommentSuccess(null);
          break;
        case 404:
          console.log('Recipe not found');
          setCommentError(data.error);
          setCommentSuccess(null);
          break;
        default:
          console.log('Error adding comment');
          setCommentError(data.error);
          setCommentSuccess(null);
          break;
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Error adding comment');
    }
  };

  const editComment = async (recipeName, oldComment, newComment) => {
    try {
      const response = await fetch(`/api/comment/${recipeName}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldComment : oldComment, newComment : newComment }),
      });
      const data = await response.json();
      if (response.status === 200) {
        console.log(data);
        setEditCommentSuccess(data.message);
        setEditCommentError('');

        
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.name === recipeName
              ? {
                  ...recipe,
                  comments: recipe.comments.map((comment) =>
                    comment.comment === oldComment
                      ? { ...comment, comment: newComment } 
                      : comment
                  ),
                }
              : recipe
          )
        );

      
        setSelectedRecipe((prevRecipe) => ({
          ...prevRecipe,
          comments: prevRecipe.comments.map((comment) =>
            comment.comment === oldComment
              ? { ...comment, comment: newComment } 
              : comment
          ),
        }));
      } else if (response.status === 400) {
        console.log('Error editing comment:', response);
        setEditCommentError(data.error);
        setEditCommentSuccess('');
      } else if (response.status === 403) {
        console.log('Error editing comment:', response);
        setEditCommentError(data.error);
        setEditCommentSuccess('');
      }else if (response.status === 404) {
        console.log('Error editing comment:', response);
        setEditCommentError(data.error);
        setEditCommentSuccess('');
      } else {
        console.log('Error editing comment:', response);
        setEditCommentError(data.error);
        setEditCommentSuccess('');
      }
    } catch (error) {
      console.log('Error editing comment:', error);
    }
  };

  const deleteComment = async (recipeName, comment) => {
    try {
      const response = await fetch(`/api/comment/${recipeName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment }),
      });
      const data = await response.json();
      if (response.status === 200) {
        console.log(data);
        setDeleteCommentSuccess(data.message);
        setDeleteCommentError('');   
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.name === recipeName
              ? {
                  ...recipe,
                  comments: recipe.comments.filter((comment) =>
                    comment.comment !== comment
                  ),
                }
              : recipe
          )
        );

        setSelectedRecipe((prevRecipe) => ({
          ...prevRecipe,
          comments: prevRecipe.comments.filter((comment) =>
            comment.comment !== comment
          ),
        }));
        setTimeout(() => {
          setDeleteCommentSuccess('');
        }, 5000);
      } else if (response.status === 400) {
        console.log('Error deleting comment:', response);
        setDeleteCommentError(data.error);
        setDeleteCommentSuccess('');
        setTimeout(() => {
          setDeleteCommentError('');
        }, 5000);
      } else if (response.status === 403) {
        console.log('Error deleting comment:', response);
        setDeleteCommentError(data.error);
        setDeleteCommentSuccess('');
        setTimeout(() => {
          setDeleteCommentError('');
        }, 5000);
      }else if (response.status === 404) {
        console.log('Error deleting comment:', response);
        setDeleteCommentError(data.error);
        setEditCommentSuccess('');
        setTimeout(() => {
          setDeleteCommentError('');
        }, 5000);
      } else {
        console.log('Error deleting comment:', response);
        setDeleteCommentError(data.error);
        setDeleteCommentSuccess('');
        setTimeout(() => {
          setDeleteCommentError('');
        }, 5000);
      }
    } catch (error) {
      console.log('Error deleting comment:', error);
    }
  };

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
                  onClick={() =>{
                    setError(null);
                    setSuccess(null);
                    setCommentError(null);
                    setCommentSuccess(null);
                    setSelectedRecipe(recipe)}}
                >
                  {recipe.name}
                </li>
              ))
            )}
          </ul>
          <h3 className="border-b-2 border-gray-500 pb-2 mb-4 mt-4 text-black"> User Recipe List:</h3>
          <ul className="text-xl">
            {userRecipes && userRecipes?.length === 0 ? (
              <li className="text-black">No recipes found</li>
            ) : (
              (userRecipes || []).map((recipe, index) => (
                <li
                  key={index}
                  className={`cursor-pointer text-black ${!recipe.Public ? 'font-semibold text-red-500' : ''}`}
                  onClick={() =>{
                    setError(null);
                    setSuccess(null);
                    setCommentError(null);
                    setCommentSuccess(null);
                    setSelectedRecipe(recipe)}}
                >
                  {recipe.name} 
                  {!recipe.Public && <span className="ml-2 text-sm italic">(Private: Only you can see this)</span>}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="w-2/3 pl-4 pr-4">
          <RecipeCardComponent recipe={selectedRecipe} onLike={onLike} onUnlike={onUnlike} errorMSG={error} successMessage={successMessage} currentComment={currentComment} setComment={setComment} commentError={commentError} commentSuccess={commentSuccess} addComment={addComment} editComment={editComment} editCommentError={editCommentError} editCommentSuccess={editCommentSuccess} deleteComment={deleteComment} deleteCommentError={deleteCommentError} deleteCommentSuccess={deleteCommentSuccess} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;