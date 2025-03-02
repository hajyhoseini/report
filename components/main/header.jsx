import React, { useEffect, useState } from 'react';  
import { FaRegLightbulb } from 'react-icons/fa'; // وارد کردن آیکون لامپ از react-icons
import NavMenu from '../detailical/navMenu';
import DarkModeToggle from '../detailical/DarkModeToggle';
import { useTheme } from '@/context/ThemeContext'; // استفاده از context برای مدیریت حالت شب و روز
import MobileButton from '../detailical/MobileButton';
import SidebarMain from './sidebarMain';

const Header = () => {
  const { isDarkMode } = useTheme(); // دریافت وضعیت حالت شب و روز از context
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);

      // در حالت دسکتاپ، سایدبار همیشه باز باشد
      if (!isNowMobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false); // در حالت موبایل پیش‌فرض بسته باشد
      }
    };

    handleResize(); // برای بار اول هم بررسی می‌کنیم
    window.addEventListener("resize", handleResize);

    // پاک کردن event listener هنگام unmount شدن کامپوننت
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`w-full p-3 ${isDarkMode ? " bg-gray-400/80" : " bg-gray-600/80"} bg-cover bg-center fixed top-0 left-0 right-0 z-30`}>
      {/* بخش خوشامدگویی */}
      <div className={`relative text-white text-center py-1 px-4 font-semibold text-xs sm:text-sm shadow-lg z-10 max-w-screen-lg mx-auto rounded-xl overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full animate-lightning z-20"></div>
        
        <p className={`relative text-xl lg:text-xl font-bold text-gray-100 z-30`}>
          {/* آیکون لامپ چپ */}
          <FaRegLightbulb className="lamp left-lamp absolute top-1/2 transform -translate-y-1/2 left-[-40px] z-50 animate-bounce" />
          
          {/* عنوان */}
          <span className={`${isDarkMode ? "text-white bg-gray-600" : "text-black bg-white/60"} rounded-md p-2 text-md:text-3xl lg:text-5xl`} style={{ fontFamily: 'Vazir' }}>
            استعداد سنجی ملل کیدز
          </span>
          
          {/* آیکون لامپ راست */}
          <FaRegLightbulb className="lamp right-lamp absolute top-1/2 transform -translate-y-1/2 right-[-40px] z-50 animate-bounce" />
        </p>
      </div>
      
      {/* دکمه تغییر حالت شب و روز */}
      <DarkModeToggle />
    </header>
  );
};

export default Header;
