"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Loader2, Trash2, Edit } from "lucide-react";

export default function NotificationReceiver() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState("All");
  const [branch, setBranch] = useState("All");
  const [search, setSearch] = useState("");
  const [userBatch, setUserBatch] = useState("");
  const [userBranch, setUserBranch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newBatch, setNewBatch] = useState("All");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = collection(db, "users");
    const unsubscribeUser = onSnapshot(
      query(userRef, where("email", "==", user.email)),
      (snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setUserBatch(userData.batch);
          setUserBranch(userData.branch);
        }
      }
    );

    return () => unsubscribeUser();
  }, []);

  useEffect(() => {
    if (!userBatch || !userBranch) return;

    setLoading(true);
    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, orderBy("timestamp", "desc"));

    const unsubscribeNotifications = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(fetchedNotifications);
      setLoading(false);
    });

    return () => unsubscribeNotifications();
  }, [userBatch, userBranch]);

  const handleAddNotification = async () => {
    if (!newTitle || !newMessage) return;
    await addDoc(collection(db, "notifications"), {
      title: newTitle,
      message: newMessage,
      batch: newBatch,
      branch: userBranch,
      timestamp: new Date(),
    });
    setNewTitle("");
    setNewMessage("");
    setNewBatch("All");
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteDoc(doc(db, "notifications", id));
  };

  const handleEditNotification = async () => {
    if (!editId || !newTitle || !newMessage) return;
    await updateDoc(doc(db, "notifications", editId), {
      title: newTitle,
      message: newMessage,
    });
    setEditId(null);
    setNewTitle("");
    setNewMessage("");
  };

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col p-6">
      <div className="max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Notifications</h2>
        <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Add/Edit Notification</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-2"
          />
          <textarea
            placeholder="Message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-2"
          />
          <select
            value={newBatch}
            onChange={(e) => setNewBatch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-2"
          >
            <option value="All">All Batches</option>
            <option value="2023">Batch 2023</option>
            <option value="2024">Batch 2024</option>
            <option value="2025">Batch 2025</option>
          </select>
          <button
            onClick={editId ? handleEditNotification : handleAddNotification}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {editId ? "Update" : "Add"} Notification
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-gray-500" size={32} />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-600">No notifications available.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white shadow-lg rounded-lg p-4 border">
                <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-gray-700 mt-2">{notification.message}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Batch: {notification.batch} | Branch: {notification.branch}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditId(notification.id);
                      setNewTitle(notification.title);
                      setNewMessage(notification.message);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}