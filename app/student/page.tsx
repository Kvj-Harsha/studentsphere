"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { app } from '@/lib/firebase';

const Page: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [latestNotification, setLatestNotification] = useState<any>(null);
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

  useEffect(() => {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("date", "desc"), limit(2));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLatestEvents(events);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestNotification(snapshot.docs[0].data());
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111184] text-white p-6">
      <div className="w-full max-w-md p-6 bg-[#7373ff] rounded-2xl shadow-lg text-center mb-6">
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

      <div className="w-full max-w-md p-6 bg-[#7373ff] rounded-2xl shadow-lg text-center mb-6">
        <h2 className="text-xl font-bold mb-4">Latest Events</h2>
        {latestEvents.length > 0 ? (
          <ul className="space-y-3">
            {latestEvents.map(event => (
              <li key={event.id} className="bg-white text-black p-3 rounded-md shadow-md">
                <h3 className="font-semibold">{event.eventTitle}</h3>
                <p>{event.eventDescription}</p>
                <p className="text-sm text-gray-500">{event.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent events.</p>
        )}
      </div>

      <div className="w-full max-w-md p-6 bg-[#7373ff] rounded-2xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Latest Notification</h2>
        {latestNotification ? (
          <div className="bg-white text-black p-3 rounded-md shadow-md">
            <h3 className="font-semibold">{latestNotification.title}</h3>
            <p>{latestNotification.message}</p>
            <p className="text-sm text-gray-500">{latestNotification.timestamp?.toDate().toLocaleString()}</p>
          </div>
        ) : (
          <p>No recent notifications.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
