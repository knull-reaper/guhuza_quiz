"use client";
import { useState, useRef, useEffect } from "react";
import {
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

const ShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const websiteUrl = "https://guhuza.com/";
  const text = encodeURIComponent("🎉 I just completed a quiz! Check it out: ");

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="quizSbtn flex items-center gap-2"
      >
        <FaShareAlt /> Share
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