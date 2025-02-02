"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, firebaseAuth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function SignUp() {
  const [role, setRole] = useState("student"); // Default role
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [batch, setBatch] = useState("20");
  const [branch, setBranch] = useState("Computer Science");
  const [facultyOrStaff, setFacultyOrStaff] = useState("Faculty");
  const [designation, setDesignation] = useState("");
  const [name, setName] = useState("");
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

      const userData = {
        email,
        role,
        createdAt: new Date(),
      };

      if (role === "student") {
        await setDoc(doc(db, "users", user.uid), {
          ...userData,
          rollNo,
          username,
          batch,
          branch,
        });
        router.push("/student");
      } else {
        await setDoc(doc(db, "users", user.uid), {
          ...userData,
          name,
          facultyOrStaff,
          designation,
        });
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Sign-up failed. Please try again.");
    }
  };

  return (
    <section>
      <Navbar />
      <section className="bg-black h-[84vh] text-white flex flex-col">
        <div className="flex flex-grow items-center justify-center px-6 py-12">
          <div className="bg-[#1E1E1E] shadow-xl rounded-lg p-8 max-w-6xl w-full">
            <h2 className="text-3xl font-semibold text-center text-[#fffff] mb-6">Create Your Account</h2>
            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-[#B3B3B3]">Role</label>
                <select
                  id="role"
                  className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#B3B3B3]">Institute Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#B3B3B3]">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#B3B3B3]">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-[#0096FF] hover:bg-[#45a049] text-white font-semibold py-2 rounded-md transition duration-300 disabled:bg-[#565656]"
                disabled={!isValidEmail}
              >
                Sign Up
              </button>

              {/* Role-specific fields */}
              {role === "student" ? (
                <>
                  <div>
                    <label htmlFor="rollNo" className="block text-sm font-medium text-[#B3B3B3]">Roll Number</label>
                    <input
                      id="rollNo"
                      type="text"
                      className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-[#B3B3B3]">Username</label>
                    <input
                      id="username"
                      type="text"
                      className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="batch" className="block text-sm font-medium text-[#B3B3B3]">Batch</label>
                    <select
                      id="batch"
                      className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                    >
                      {["20", "21", "22", "23", "24"].map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-[#B3B3B3]">Branch</label>
                    <select
                      id="branch"
                      className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      {["Computer Science", "Artificial Intelligence & Data Science", "Mathematics & Computing"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#B3B3B3]">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="facultyOrStaff" className="block text-sm font-medium text-[#B3B3B3]">Faculty or Staff</label>
                    <select
                      id="facultyOrStaff"
                      className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                      value={facultyOrStaff}
                      onChange={(e) => setFacultyOrStaff(e.target.value)}
                    >
                      <option value="Faculty">Faculty</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-[#B3B3B3]">Designation</label>
                    <input
                      id="designation"
                      type="text"
                      className="w-full mt-1 p-2 bg-[#2C2C2C] text-white border border-[#0096FF] rounded-md"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </section>
  );
}
