"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, firebaseAuth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function SignUp() {
  const [role, setRole] = useState("student");
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

  const handleSignUp = async (e: { preventDefault: () => void; }) => {
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
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Sign-up failed. Please try again.");
      }
    }
    
  };


  return (
    <section>
      <Navbar />
      <section className="bg-black h-[84vh] text-white">
        <div className="px-6 py-12"> {/* Removed flex and justify */}
          <div className="bg-[#070738] shadow-xl rounded-lg p-8 max-w-6xl w-full mx-auto"> {/* Added mx-auto for centering */}
            <h2 className="text-3xl font-semibold text-center text-[#7373ff] mb-6">Create Your Account</h2>
            <form onSubmit={handleSignUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Grid layout */}

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-[#B3B3B3]">Role</label>
                <select
                  id="role"
                  className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#B3B3B3]">Institute Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#B3B3B3]">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#B3B3B3]">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role-specific fields */}
              {role === "student" ? (
                <>
                  {/* Roll Number */}
                  <div>
                    <label htmlFor="rollNo" className="block text-sm font-medium text-[#B3B3B3]">Roll Number</label>
                    <input
                      id="rollNo"
                      type="text"
                      className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      required
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-[#B3B3B3]">Username</label>
                    <input
                      id="username"
                      type="text"
                      className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Batch */}
                  <div>
                    <label htmlFor="batch" className="block text-sm font-medium text-[#B3B3B3]">Batch</label>
                    <select
                      id="batch"
                      className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                    >
                      {["20", "21", "22", "23", "24"].map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Branch */}
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-[#B3B3B3]">Branch</label>
                    <select
                      id="branch"
                      className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
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
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#B3B3B3]">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                      value={username}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Faculty/Staff */}
                  <div>
                    <label htmlFor="facultyOrStaff" className="block text-sm font-medium text-[#B3B3B3]">Faculty or Staff</label>
                    <select
                      id="facultyOrStaff"
                      className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                      value={facultyOrStaff}
                      onChange={(e) => setFacultyOrStaff(e.target.value)}
                    >
                      <option value="Faculty">Faculty</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>

                  {/* Designation */}
                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-[#B3B3B3]">Designation</label>
                    <input
                      id="designation"
                      type="text"
                      className="w-full mt-1 p-2 bg-black text-white border border-[#0096FF] rounded-md"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {/* Error Message */}
              <div className="col-span-full"> {/* Span across all columns */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </div>

              {/* Submit Button */}
              <div className="col-span-full"> {/* Span across all columns */}
                <button
                  type="submit"
                  className="w-full bg-[#0096FF] hover:bg-[#45a049] text-white font-semibold py-2 rounded-md transition duration-300 disabled:bg-[#565656]"
                  disabled={!isValidEmail}
                >
                  Sign Up
                </button>
              </div>

              <div className="flex flex-col justify-between">
  <div>
    <p>Note:</p>
    <ul className="list-disc pl-5">
      <li>Only iiitr domain mail will be registered!</li>
      <li>Registration may take up to 1 min, please wait.</li>
    </ul>
  </div>

  <div className="mt-4 text-[#7373ff]">
    Already have an account? 
    <a href="/sign-in" className="text-white"> Login</a>
  </div>
</div>


            </form>
          </div>
        </div>
      </section>
    </section>
  );
}