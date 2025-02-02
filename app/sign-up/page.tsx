"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, firebaseAuth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [batch, setBatch] = useState("20");
  const [branch, setBranch] = useState("Computer Science");
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@iiitr\.ac\.in$/;
    setIsValidEmail(regex.test(email));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        rollNo,
        email,
        username,
        batch,
        branch,
        createdAt: new Date(),
      });

      router.push("/student");
    } catch (err: any) {
      setError(err.message || "Sign-up failed. Please try again.");
    }
  };

  return (
    <section className="bg-[#3d52a0] min-h-screen text-black flex flex-col">
      <div className="flex flex-grow items-center justify-center px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input id="rollNo" type="text" placeholder="Enter your roll number" className="w-full mt-1 p-2 border rounded-md" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Institute Email</label>
              <input id="email" type="email" placeholder="example@iiitr.ac.in" className="w-full mt-1 p-2 border rounded-md" value={email} onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }} required />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input id="username" type="text" placeholder="Enter your username" className="w-full mt-1 p-2 border rounded-md" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="batch" className="block text-sm font-medium text-gray-700">Batch</label>
              <select id="batch" className="w-full mt-1 p-2 border rounded-md" value={batch} onChange={(e) => setBatch(e.target.value)}>
                {["20", "21", "22", "23", "24"].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
              <select id="branch" className="w-full mt-1 p-2 border rounded-md" value={branch} onChange={(e) => setBranch(e.target.value)}>
                {["Computer Science", "Artificial Intelligence & Data Science", "Mathematics & Computing"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" type="password" placeholder="Enter your password" className="w-full mt-1 p-2 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input id="confirmPassword" type="password" placeholder="Confirm your password" className="w-full mt-1 p-2 border rounded-md" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300 disabled:bg-gray-400" disabled={!isValidEmail}>
              Sign Up
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account? <a href="/sign-in" className="text-blue-600 hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </section>
  );
}
