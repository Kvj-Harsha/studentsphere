"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '@/lib/firebase';

const Page: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async (uid: string) => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111184] text-white">
      <div className="w-full max-w-md p-6 bg-[#7373ff] rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>
        {user ? (
          <div className="space-y-3">
            <p><span className="font-semibold">Name:</span> {user.username}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Role:</span> {user.role}</p>
            <p><span className="font-semibold">Roll No:</span> {user.rollNo}</p>
            <p><span className="font-semibold">Batch:</span> {user.batch}</p>
            <p><span className="font-semibold">Branch:</span> {user.branch}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Page;