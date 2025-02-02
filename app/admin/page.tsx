"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { app } from '@/lib/firebase';

const Page: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [resource, setResource] = useState<string | null>(null);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async (uid: string) => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    const fetchLatestAnnouncement = async () => {
      const announcementsRef = collection(db, "notifications");
      const q = query(announcementsRef, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setAnnouncement(querySnapshot.docs[0].data().message);
      }
    };

    const fetchLatestResource = async () => {
      const resourcesRef = collection(db, "resources");
      const q = query(resourcesRef, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setResource(querySnapshot.docs[0].data().title);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
        fetchLatestAnnouncement();
        fetchLatestResource();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      {user && <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}</h1>}
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        {user ? (
          <div className="space-y-3">
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

      <div className="w-full max-w-md mt-6 p-6 bg-gray-800 rounded-2xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-3">Latest Announcement</h2>
        {announcement ? <p>{announcement}</p> : <p>No announcements available.</p>}
      </div>

      <div className="w-full max-w-md mt-6 p-6 bg-gray-800 rounded-2xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-3">Latest Resource</h2>
        {resource ? <p>{resource}</p> : <p>No resources available.</p>}
      </div>
    </div>
  );
};

export default Page;