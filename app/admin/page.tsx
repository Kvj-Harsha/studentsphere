"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { app } from '@/lib/firebase';
import { motion } from "framer-motion";
import { FaUser, FaBell, FaCalendarAlt } from 'react-icons/fa';

const Page: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [announcement, setAnnouncement] = useState<any | null>(null);
  const [event, setEvent] = useState<any | null>(null);
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
      try {
        const announcementsRef = collection(db, "notifications");
        const q = query(announcementsRef, orderBy("timestamp", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setAnnouncement(querySnapshot.docs[0].data());
        } else {
          setAnnouncement(null);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncement(null);
      }
    };

    const fetchLatestEvent = async () => {
      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, orderBy("timestamp", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setEvent(querySnapshot.docs[0].data());
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvent(null);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
        fetchLatestAnnouncement();
        fetchLatestEvent();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white p-6">
      {/* User Name in Blue at Top Left */}
      <motion.div 
        className="text-4xl text-center font-bold text-blue-500 mb-6"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        {user && `Hello, ${user.username}!`}
      </motion.div>

      {/* Dashboard Introduction */}
      <motion.div 
        className="text-center text-lg mb-6"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <p>Welcome to your dashboard. Here you can view the latest announcements and events!</p>
      </motion.div>

      {/* Latest Announcement */}
      <motion.div 
        className="w-full max-w-md p-6 bg-gray-900 rounded-2xl shadow-lg text-center mb-6"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-4">
          <FaBell className="text-3xl text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold">Latest Announcement</h2>
        </div>
        {announcement ? (
          <div className="space-y-3">
            <p><span className="font-semibold">Notification:</span> {announcement.title}</p>
            <p><span className="font-semibold">Message:</span> {announcement.message}</p>
            <p><span className="font-semibold">Instructor:</span> {announcement.instructor}</p>
          </div>
        ) : <p>No announcements available.</p>}
      </motion.div>

      {/* Latest Event */}
      <motion.div 
        className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg text-center"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-4">
          <FaCalendarAlt className="text-3xl text-green-500 mr-2" />
          <h2 className="text-xl font-bold">Latest Event</h2>
        </div>
        {event ? (
          <div className="space-y-3">
            <p><span className="font-semibold">Event Title:</span> {event.eventTitle}</p>
            <p><span className="font-semibold">Session:</span> {event.session}</p>
            <p><span className="font-semibold">Date:</span> {new Date(event.date.seconds * 1000).toLocaleDateString()}</p>
          </div>
        ) : <p>No events available.</p>}
      </motion.div>

      {/* User Info Section */}
      {user && (
        <motion.div 
          className="mt-6 p-6 bg-gray-900 rounded-2xl shadow-lg text-center"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <FaUser className="text-3xl text-blue-500 mr-2" />
            <h2 className="text-xl font-bold">User Details</h2>
          </div>
          <div className="space-y-3">
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Role:</span> {user.role}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Page;
