'use client';
import { useState } from 'react';
import { motion } from 'framer-motion'; 
import { useTheme } from "@/context/ThemeContext"; 
import * as XLSX from 'xlsx'; // اضافه کردن کتابخانه xlsx

const DailyReport = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    taskType: '',
    taskDate: '', // تاریخ به فرمت شمسی
    startTime: '', // ساعت شروع به صورت دلخواه
    endTime: '' // ساعت پایان به صورت دلخواه
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // شماره واتساپ
  const WHATSAPP_NUMBER = '989388780198';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateExcelFile = (data) => {
    // ایجاد یک ورک بوک جدید
    const wb = XLSX.utils.book_new();
    
    // تبدیل داده‌ها به فرمت مناسب برای اکسل
    const ws = XLSX.utils.json_to_sheet([data]);

    // اضافه کردن شیت به ورک بوک
    XLSX.utils.book_append_sheet(wb, ws, 'گزارش روزانه');

    // تبدیل ورک بوک به باینری
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    
    // تبدیل به Base64
    const base64File = window.btoa(wbout);
    return base64File;
  };

  const sendToWhatsApp = (base64File) => {
    const message = `گزارش روزانه شما: \n\n لطفا این فایل اکسل را دانلود کنید.`;
    
    const encodedMessage = encodeURIComponent(message);
    // در اینجا باید فایل اکسل را به صورت Base64 به لینک تبدیل کنید
    const fileLink = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64File}`;
    
    const whatsappLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}%0A${fileLink}`;

    try {
      // هدایت به لینک واتساپ برای ارسال پیام
      window.location.href = whatsappLink;
      console.log("پیام با موفقیت ارسال شد به واتساپ");
    } catch (error) {
      console.error("خطا در ارسال پیام به واتساپ:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("گزارش روزانه ارسال شد:", formData);
    setIsFormSubmitted(true);

    // ایجاد فایل اکسل به فرمت Base64
    const base64File = generateExcelFile(formData);
    
    // ارسال فایل به واتساپ
    sendToWhatsApp(base64File);
  };

  return (
    <div className={`flex justify-center items-center px-4 min-h-screen ${isDarkMode ? 'bg-black/60 text-white' : 'bg-white text-black'}`}>
      <div className={`p-8 shadow-lg rounded-lg w-full max-w-lg ${isDarkMode ? 'bg-gray-800/60 text-white' : 'bg-white/60 text-black'}`}>
        {!isFormSubmitted ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">گزارش روزانه وظایف سازمانی</h2>
            <motion.form
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="نام و نام خانوادگی"
                  required
                  className="w-full py-2 px-4 rounded-md border bg-gray-100 text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">نوع تسک:</label>
                <input
                  type="text"
                  name="taskType"
                  value={formData.taskType}
                  onChange={handleChange}
                  placeholder="نوع تسک"
                  required
                  className="w-full py-2 px-4 rounded-md border bg-gray-100 text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">تاریخ انجام تسک:</label>
                <input
                  type="text"
                  name="taskDate"
                  value={formData.taskDate}
                  onChange={handleChange}
                  placeholder="1403/12/01"  // راهنمایی برای فرمت تاریخ
                  required
                  className="w-full py-2 px-4 rounded-md border bg-gray-100 text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">ساعت شروع:</label>
                <input
                  type="text"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  placeholder="09:00 یا 9:00 AM"  // راهنمایی برای فرمت ساعت
                  required
                  className="w-full py-2 px-4 rounded-md border bg-gray-100 text-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">ساعت پایان:</label>
                <input
                  type="text"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  placeholder="18:00 یا 6:00 PM"  // راهنمایی برای فرمت ساعت
                  required
                  className="w-full py-2 px-4 rounded-md border bg-gray-100 text-black focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                ارسال گزارش
              </button>
            </motion.form>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-500">گزارش شما با موفقیت ارسال شد!</h3>
            <p className="mt-4">نام و نام خانوادگی: {formData.fullName}</p>
            <p>نوع تسک: {formData.taskType}</p>
            <p>تاریخ انجام تسک: {formData.taskDate}</p>
            <p>ساعت شروع: {formData.startTime}</p>
            <p>ساعت پایان: {formData.endTime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReport;
