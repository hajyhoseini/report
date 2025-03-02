import React, { useState, useRef, useEffect } from "react"; 
import { FaPhoneAlt, FaWhatsapp, FaTelegramPlane } from "react-icons/fa"; 
import { Button } from "react-bootstrap"; 

const CallToHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setIsOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {/* دکمه اصلی تماس */}
      <Button
        ref={buttonRef} 
        className="bg-green-600 text-white rounded-full p-3 shadow-xl hover:scale-110 transform transition-all wave-effect" // اضافه کردن کلاس wave-effect
        onClick={toggleMenu}
      >
        <span className="text-2xl">📞</span> {/* آیکون قهوه */}
      </Button>

      {/* منوی باز شده */}
      {isOpen && (
        <div
          ref={menuRef}
          className="flex flex-col items-start bg-cover bg-center bg-black/80 rounded-lg mt-3 p-3 w-48 space-y-3"
          style={{
            backgroundImage: "url('https://via.placeholder.com/200x200.png?text=Coffee+Beans')",
            backgroundSize: "cover", 
            backgroundPosition: "center",
          }}
        >
          <a
            href="tel:09388780198"
            className="flex items-center p-3 text-white hover:bg-green-800 rounded-lg transition-all transform hover:scale-105"
          >
            <FaPhoneAlt className="ml-3 text-green-600" size={24} />
            تماس تلفنی
          </a>
          <a
            href="https://wa.me/989388780198"
            className="flex items-center p-3 text-white hover:bg-green-800 rounded-lg transition-all transform hover:scale-105"
          >
            <FaWhatsapp className="ml-3 text-green-500" size={24} />
            واتس‌اپ
          </a>
          <a
            href="https://t.me/hajy81"
            className="flex items-center p-3 text-white hover:bg-green-800 rounded-lg transition-all transform hover:scale-105"
          >
            <FaTelegramPlane className="ml-3 text-blue-500" size={24} />
            تلگرام
          </a>
        </div>
      )}
    </div>
  );
};

export default CallToHelper;
