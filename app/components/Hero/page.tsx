"use client";

import React from "react";
import { HeroHighlight, Highlight } from "..//hero-highlights";

const Hero = () => {
  return (
    <HeroHighlight containerClassName="min-h-screen flex flex-col items-center justify-center text-center">
      <main className="text-6xl font-bold">
       Welcome to <Highlight>Student Sphere!</Highlight> {/* Only wrap the heading */}
      </main>
    </HeroHighlight>
        
        // {/* Search and CTA Section */}
        // <containerClassName="min"
        // <input
        //   type="text"
        //   placeholder="Search..."
        //   className="mt-20 p-2 border rounded-lg w-64"
        // />
        // <div className="mt-4 flex gap-4">
        //   <a href="/announcements" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        //     Announcements
        //   </a>
        // </div>
  );
};

export default Hero;
