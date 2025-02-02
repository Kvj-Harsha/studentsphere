"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaInstagram } from "react-icons/fa";
import Navbar from "../components/Navbar";

interface Contact {
  name: string;
  email?: string;
  instagram?: string;
  link?: string;
}

const contacts: Record<string, Contact[]> = {
  clubs: [
    { name: "Code Soc", email: "code_soc@students.iiitr.ac.in", instagram: "https://instagram.com/codesoc.iiitraichur" },
    { name: "Electro Geeks", email: "electrogeeks@iiitr.ac.in", instagram: "https://instagram.com/electrogeeks.iiitr" },
    { name: "game Xcellennce", email: "gamex@iiitr.ac.in", instagram: "https://instagram.com/gamexcellence_iiitr" },
    { name: "Deep labs", email: "deep.labs@iiitr.ac.in", instagram: "https://instagram.com/deep.labs_iiitr" },
    { name: "Ehacs", email: "ehacs@iiitr.ac.in", instagram: "https://instagram.com/" },
    { name: "DevX", email: "devx@iiitr.ac.in", instagram: "https://instagram.com/" },
    { name: "Finspiration", email: "finspiration@students.iiitr.ac.in", instagram: "https://instagram.com/finspiration_iiitr" },
    { name: "Ek Bharat Shrestha Bharat", email: "ebsb@iiitr.ac.in", instagram: "https://instagram.com/ebsb_iiitr" },
    { name: "Finesse", email: "finesse@students.iiitr.ac.in", instagram: "https://instagram.com/finesse.iiitraichur" },
    { name: "Stage & Studio", email: "stagenstudio@iiitr.ac.in", instagram: "https://instagram.com/stage_n_studio" },
    { name: "Aurora", email: "aurora@students.iiitr.ac.in", instagram: "https://instagram.com/" },
    { name: "Xposure", email: "xposure@iiitr.ac.in", instagram: "https://instagram.com/xposure.iiitr" },
    { name: "NSS", email: "nss@iiitr.ac.in"},
    { name: "NSO", email: "nso@iiitr.ac.in" }
  ],
  admin: [
    { name: "Director", email: "Director@iiitr.ac.in" },
    { name: "Faculty", email: "faculty@iiitr.ac.in" },
    { name: "Staff", email: "staff@iiitr.ac.in"},
    { name: "PRO", email: "pro@iiitr.ac.in"},
  ],
  support: [
    { name: "COSA", email: "cosa@iiitr.ac.in" },
  ],
};

const tabs = [
  { name: "Clubs & Organizations", id: "clubs" },
  { name: "Administration", id: "admin" },
  { name: "Support & Assistance", id: "support" },
];

const ContactPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("clubs");

  return (
    <div>
      <Navbar />
      <div className="relative min-h-screen bg-black flex flex-col text-white p-6">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-4xl font-extrabold text-[#0096FF] text-center mb-8">Contact Us</h1>
          <div className="flex justify-center space-x-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 rounded-md text-sm md:text-base transition-all duration-300 ${
                  activeTab === tab.id ? "bg-[#0096FF] text-black" : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            {contacts[activeTab]?.map((contact: Contact, index) => (
              <div key={index} className="mb-4 flex justify-between items-center border-b border-gray-600 pb-3">
                <p className="text-lg font-semibold">{contact.name}</p>
                <div className="flex space-x-3">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="text-[#0096FF] hover:underline flex items-center">
                      <FaEnvelope className="mr-2" /> Email
                    </a>
                  )}
                  {contact.instagram && (
                    <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline flex items-center">
                      <FaInstagram className="mr-2" /> Instagram
                    </a>
                  )}
                  {contact.link && (
                    <a href={contact.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                      Visit
                    </a>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
