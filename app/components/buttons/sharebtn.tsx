import { useState, useRef, useEffect } from "react";
import { FaShareAlt, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const ShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const websiteUrl = "https://guhuza.com/"; // Replace with your website URL
  const text = encodeURIComponent("Check out this amazing website! 🚀");

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" flex items-center gap-2 quizSbtn"
      >
        <FaShareAlt /> Share
      </button>

      {/* Popup */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-3 w-48 z-10"
        >
          <p className="text-sm text-gray-700 mb-2">Share this page:</p>
          <div className="flex flex-col space-y-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-700 hover:underline"
            >
              <FaFacebook /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${websiteUrl}&text=${text}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:underline"
            >
              <FaTwitter /> Twitter (X)
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FaLinkedin /> LinkedIn
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${text} ${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:underline"
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
