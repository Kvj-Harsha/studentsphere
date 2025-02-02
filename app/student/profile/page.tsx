"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from '@/lib/firebase';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ phone: "", linkedIn: "", github: "" });
  
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async (uid: string) => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
        setFormData({
          phone: userDoc.data().phone || "",
          linkedIn: userDoc.data().linkedIn || "",
          github: userDoc.data().github || "",
        });
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    const userRef = doc(db, "users", auth.currentUser!.uid);
    await updateDoc(userRef, formData);
    setEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] text-white p-6">
      <div className="w-full max-w-md p-6 bg-blue-500 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        {user ? (
          <div className="space-y-3 text-left">
            <p><span className="font-semibold">Name:</span> {user.username}</p>
            <p><span className="font-semibold">Enrollment No:</span> {user.rollNo}</p>
            <p><span className="font-semibold">Department:</span> {user.branch}</p>
            <p><span className="font-semibold">Batch:</span> {user.batch}</p>

            {editing ? (
              <>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border rounded-md text-black" />
                <input type="text" name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="LinkedIn" className="w-full p-2 border rounded-md text-black" />
                <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub" className="w-full p-2 border rounded-md text-black" />
                <button onClick={handleSave} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
              </>
            ) : (
              <>
                <p><span className="font-semibold">Phone:</span> {user.phone || "Not Provided"}</p>
                <p><span className="font-semibold">LinkedIn:</span> <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" className="text-white">{user.linkedIn || "Not Provided"}</a></p>
                <p><span className="font-semibold">GitHub:</span> <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-white">{user.github || "Not Provided"}</a></p>
                <button onClick={() => setEditing(true)} className="mt-2 px-4 py-2 bg-blue-800 text-white rounded-md">Edit</button>
              </>
            )}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;