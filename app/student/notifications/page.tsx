"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function NotificationReceiver() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState("All");
  const [branch, setBranch] = useState("All");
  const [search, setSearch] = useState("");
  const [userBatch, setUserBatch] = useState("");
  const [userBranch, setUserBranch] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    console.log("Fetching user data for:", user.email);
    const userRef = collection(db, "users");

    const unsubscribeUser = onSnapshot(
      query(userRef, where("email", "==", user.email)),
      (snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          console.log("User data:", userData);
          setUserBatch(userData.batch || "Unknown");
          setUserBranch(userData.branch || "Unknown");
        } else {
          console.warn("No user data found for email:", user.email);
        }
      },
      (error) => console.error("Error fetching user data:", error)
    );

    return () => unsubscribeUser();
  }, []);

  useEffect(() => {
    if (!userBatch || !userBranch) {
      console.warn("User batch or branch not set yet.");
      return;
    }

    console.log("Fetching notifications for Batch:", userBatch, "Branch:", userBranch);
    setLoading(true);

    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, orderBy("timestamp", "desc"));

    const unsubscribeNotifications = onSnapshot(
      q,
      (snapshot) => {
        console.log("Notifications snapshot received:", snapshot.docs.length, "documents.");
        const fetchedNotifications = snapshot.docs
          .map((doc) => doc.data())
          .filter(
            (notification) =>
              (notification.batch === "All" || notification.batch === userBatch) &&
              (notification.branch === "All" || notification.branch === userBranch)
          );

        console.log("Filtered Notifications:", fetchedNotifications.length);
        setNotifications(fetchedNotifications);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    );

    return () => unsubscribeNotifications();
  }, [userBatch, userBranch]);

  const filteredNotifications = notifications.filter(
    (notification) =>
      (batch === "All" || notification.batch === batch) &&
      (branch === "All" || notification.branch === branch) &&
      (notification.title?.toLowerCase().includes(search.toLowerCase()) ||
        notification.message?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col p-6">
      <div className="max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Notifications</h2>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Batches</option>
            {userBatch && <option value={userBatch}>{userBatch}</option>}
          </select>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Branches</option>
            {userBranch && <option value={userBranch}>{userBranch}</option>}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-gray-500" size={32} />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <p className="text-center text-gray-600">No notifications available.</p>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-4 border">
                <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-gray-700 mt-2">{notification.message}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Batch: {notification.batch} | Branch: {notification.branch}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
