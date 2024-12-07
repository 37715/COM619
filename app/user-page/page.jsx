
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';


const UserPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  } else {
    console.log(session);
  }
  
  const username = session.user?.name || 'User'; 



  return (
    <div>
      
      <header className="flex items-center justify-between bg-gray text-white p-4">
        <div className="text-xl font-bold ">User Profile</div>
        
        
        <div className="flex items-center space-x-4 ml-auto">
          
          <span id="welcome-message" className="text-sm">
            Welcome, {username}
          </span>
          
          <Link href="/">    
          <input
            type="button"
            value="Go to Recipes Page"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
          />
          </Link>
          
          <input
            type="button"
            value="Log Out"
            id="logout-btn"
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded cursor-pointer"
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
              <div className="username text-lg font-semibold text-black">{username}</div>
              <input
                type="button"
                value="Change(Note: This feature is not implemented)"
                className="change-btn text-sm text-blue-600 hover:underline cursor-pointer"
              />
            </div>

            <input
              type="button"
              value="Edit Profile"
              className="edit-btn mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full cursor-pointer"
            />
          </div>

          <div className="info-section mt-6">
            <div className="likes-box mb-2">
              <span className="font-bold text-black">Likes:</span>
            </div>
            <div className="recipes-box">
              <span className="font-bold text-black">My Recipes:</span>
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
          />
          <input
            type="text"
            className="input-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Category"
          />
          <textarea
            className="textarea-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Ingredients(Seperated by comma)"
          ></textarea>
          <textarea
            className="textarea-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Instructions(Seperated by comma)"
          ></textarea>
          <textarea
            className="textarea-box w-full p-2 mb-4 border border-gray-300 rounded text-black"
            placeholder="Story"
          ></textarea>
          <div className="button-group flex space-x-4">
            <input
              type="button"
              value="Upload"
              className="upload-btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer"
            />
            <input
              type="button"
              value="Clear"
              className="clear-btn bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
