
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const UserPage = async () => {
  const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
    }else{
        console.log(session);
    }

  return (
    <div>
      <h1>User Page</h1>
      <p>Welcome to the user page. You can display user-specific data here.</p>
    </div>
  );
};

export default UserPage;