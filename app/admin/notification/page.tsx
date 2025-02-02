"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NotificationSender() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [batch, setBatch] = useState("All");
  const [branch, setBranch] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message) {
      setError("Title and Message are required.");
      return;
    }

    try {
      await addDoc(collection(db, "notifications"), {
        title,
        message,
        batch,
        branch,
        timestamp: serverTimestamp(),
      });

      setSuccess("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setBatch("All");
      setBranch("All");
    } catch (err) {
      setError("Failed to send notification.");
    }
  };

  return (
    <section className="bg-[#3d52a0] min-h-screen text-black flex flex-col">
      <div className="flex flex-grow items-center justify-center px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Send Notification</h2>
          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="Enter title"
                className="w-full mt-1 p-2 border rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                placeholder="Enter message"
                className="w-full mt-1 p-2 border rounded-md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch</label>
              <select className="w-full mt-1 p-2 border rounded-md" value={batch} onChange={(e) => setBatch(e.target.value)}>
                {["All", "20", "21", "22", "23", "24"].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <select className="w-full mt-1 p-2 border rounded-md" value={branch} onChange={(e) => setBranch(e.target.value)}>
                {["All", "Computer Science", "Artificial Intelligence & Data Science", "Mathematics & Computing"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300">
              Send Notification
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
