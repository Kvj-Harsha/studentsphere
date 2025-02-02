"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

const Page = () => {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <h1>Welcome Admin!</h1>
      <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
};

export default Page;