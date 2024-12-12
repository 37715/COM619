'use client';

import { useState,useEffect } from 'react';
import { signIn,signOut, useSession } from 'next-auth/react';




const LoginForm = () => {
  const { data: session, status } = useSession();
  const [errorMessage, setErrorMessage] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const isLoggedIn = session?.user ? true : false;

  useEffect(() => {
    if(status === 'loading'){
      return;
    }
    if (session) {
      setWelcomeMessage(`Welcome, ${session.user.name}!`);
    } else {
      
      setWelcomeMessage('');
    }
  }, [session,status]);


  

  const handleLogIn =  async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
      setErrorMessage('Username and password are required');
      return;
    }else{
      setErrorMessage('');
    }
    try{
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });
      if (result.error) {
        setErrorMessage(result.error);
      }else{
        setWelcomeMessage(`Welcome, ${username}!`);
      }
    }catch(error){
      console.error('Error signing up:', error);
      setErrorMessage('Error signing up');
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });  
    setErrorMessage('');
    setWelcomeMessage('');
  };

  const handleSignUp = async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
      setErrorMessage('Username and password are required');
      return;
    }else{
      setErrorMessage('');
    }
    try{
      const response = await fetch(`api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const json = await response.json();
      if(response.status === 400){
        console.log(json.error)
        setErrorMessage(json.error);
        setWelcomeMessage('');
      }else if(response.status === 201){
        setWelcomeMessage(`Welcome, ${username}!`);
        setErrorMessage('');
      }else if(response.status === 500){
        setErrorMessage(json.error);
        setWelcomeMessage('');
      }

      if (response.error) {
        setErrorMessage(response.error);
      }else{
        setWelcomeMessage(`Welcome, ${username}!`);
      }
    }catch(error){
      console.log('Error signing up:', error);
    }
  };


  return (
    <div>
      {!isLoggedIn ? (
        <div className="flex flex-col  gap-2 text-center">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Username"
              id="login-username"
              className="p-2 text-xl text-black"
            />
            <input
              type="password"
              placeholder="Password"
              id="login-password"
              className="p-2 text-xl text-black"
            />
            <input type="button" value="Sign Up" id="Formbutton_Login" onClick={handleSignUp} className="p-2 px-4 text-xl cursor-pointer bg-blue-500 text-white rounded-md" />
            <input type="button" value="Sign in" id="Formbutton_Signin" onClick={handleLogIn} className="p-2 px-4 text-xl cursor-pointer bg-blue-500 text-white rounded-md" />
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-xl text-black" id="welcome-message">
            {welcomeMessage}
          </span>
          <button
            id="logout-btn"
            className="p-2 bg-red-500 text-white rounded-md"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;