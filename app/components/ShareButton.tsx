"use client";
import { useState, useRef, useEffect } from "react";
import {
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

interface ShareButtonProps {
  score: number;
  levelTitle: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ score, levelTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const websiteUrl = typeof window !== "undefined" ? window.location.origin : "https://guhuza.com"; 
  
  
  const shareMessage = `🎉 I just scored ${score} on the "${levelTitle}" quiz on Guhuza Brain Boost! Check it out: `;
  const text = encodeURIComponent(shareMessage);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !(popupRef.current as any).contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popupRef}>
      {/* Teal to Lime for ShareButton */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
      >
        <span className="relative flex items-center justify-center gap-2 px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          <FaShareAlt /> Share
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white shadow-md rounded p-3 w-48 z-10">
          <p className="text-sm mb-2 text-gray-700">Share your achievement:</p>
          <div className="flex flex-col space-y-2 text-sm">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700"
            >
              <FaFacebook /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${websiteUrl}&text=${text}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-500"
            >
              <FaTwitter /> Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${text}${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
