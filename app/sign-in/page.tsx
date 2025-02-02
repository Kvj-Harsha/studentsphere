"use client"
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { useState } from 'react';
import { auth, db } from '@/lib/firebase'; // Import initialized Firebase services
import Navbar from '../components/Navbar';

const Signin = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleChange = (e: { target: { value: string; }; }) => setRole(e.target.value);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!role || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Authenticate using Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Firebase User object

      // Query Firestore for the user role using the Firebase user UID
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if the role matches
        if (userData.role !== role) {
          setError('Role mismatch. Please select the correct role.');
          return;
        }

        // Redirect to the appropriate dashboard based on the role
        if (role === 'admin') {
          window.location.href = '/admin'; 
        } else if (role === 'student') {
          window.location.href = '/student'; 
        }
      } else {
        setError('User not found.');
      }
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <section>
      <Navbar/>
    <div className="h-[84vh] flex justify-center items-center bg-black">
      <div className="bg-[#070738] p-8 rounded-lg shadow-lg max-w-sm w-full ">
        <h2 className="text-2xl text-[#7373ff] font-semibold mb-6 text-center">Sign In</h2>
        
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#7373ff]">Role</label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-black text-[#7373ff]"
              >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7373ff]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-black text-[#7373ff]"
              required
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7373ff]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-black text-[#7373ff]"
              required
              />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
            Sign In
          </button>
          <div className='text-[#7373ff]'>
            Dont have an account? <a href='/sign-up' className='text-white'>Register</a>
          </div>
        </form>
      </div>
    </div>
</section>
  );
};

export default Signin;
