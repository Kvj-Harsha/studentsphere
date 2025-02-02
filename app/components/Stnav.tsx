'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const auth = getAuth();

  const navItems = [
    { name: 'Home', path: '/student' },
    { name: 'Announcement', path: '/student/notifications' },
    { name: 'Materials', path: '/student/materials' },
    { name: 'Time Table', path: '/student/timetable' },
    { name: 'Profile', path: '/student/profile' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="w-full bg-black py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Hamburger Icon for Small Devices */}
        <button
          className="md:hidden text-white text-xl focus:outline-none"
          onClick={toggleMenu}
        >
          ☰
        </button>

        {/* Logo */}
        <div className="lg:hidden md:hidden flex-grow flex justify-center items-center">
          <Link href="/">
            <motion.div
              whileHover={{ rotateY: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer"
            >
              <Image
                src="/logos/pr_logo.jpg"
                alt="PR Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </motion.div>
          </Link>
        </div>

        {/* Invisible spacer */}
        <div className="w-6 md:hidden"></div>
      </div>

      {/* Navigation for Medium and Large Devices */}
      <nav className="hidden md:flex gap-4 items-center justify-center mt-4 p-2 border border-[#0096FF] rounded-full bg-transparent mx-auto w-fit">
        {navItems.map((item, index) => (
          <Link key={index} href={item.path} passHref>
            <motion.span
              className={`text-lg font-semibold px-4 py-2 rounded-full hover:bg-[#0096FF] hover:text-black transition-all duration-300 ${
                pathname === item.path ? 'bg-[#0096FF] text-black' : 'text-white'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.name}
            </motion.span>
          </Link>
        ))}

        {/* Sign Out Button */}
        <motion.button
          onClick={handleLogout}
          className="text-lg font-semibold px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
        >
          Sign Out
        </motion.button>
      </nav>

      {/* Side Drawer for Small Devices */}
      <motion.div
        className={`fixed top-0 right-0 h-full w-64 bg-black shadow-lg transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 z-50`}
        initial={{ x: '100%' }}
        animate={{ x: isMenuOpen ? 0 : '100%' }}
        exit={{ x: '100%' }}
      >
        <div className="p-4">
          <button
            className="text-white text-2xl focus:outline-none"
            onClick={toggleMenu}
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-6">
          {navItems.map((item, index) => (
            <Link key={index} href={item.path} passHref>
              <motion.span
                className={`text-white text-lg font-semibold px-4 py-2 rounded hover:bg-[#0096FF] transition-colors duration-300 ${
                  pathname === item.path ? 'bg-[#0096FF] text-black' : ''
                }`}
                onClick={toggleMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.span>
            </Link>
          ))}

          {/* Sign Out Button for Mobile */}
          <motion.button
            onClick={handleLogout}
            className="text-lg font-semibold px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
          >
            Sign Out
          </motion.button>
        </nav>
      </motion.div>
    </header>
  );
};

export default Navbar;
