// UserForm.js
import { useState } from 'react';

const UserForm = ({ onStartQuiz }) => {
  const [userName, setUserName] = useState({ firstName: '', lastName: '', phone: '' });
  const [errors, setErrors] = useState({ firstName: '', lastName: '', phone: '' });

  // تابع برای اعتبارسنجی فرم
  const validateForm = () => {
    let formErrors = { firstName: '', lastName: '', phone: '' };
    let isValid = true;

    // اعتبارسنجی نام (فقط حروف فارسی و فاصله مجاز)
    const namePattern = /^[\u0600-\u06FF\s]+$/;  // این الگو فقط حروف فارسی و فاصله را می‌پذیرد
    if (!userName.firstName) {
      formErrors.firstName = 'نام نمی‌تواند خالی باشد.';
      isValid = false;
    } else if (!namePattern.test(userName.firstName)) {
      formErrors.firstName = 'نام باید فقط شامل حروف فارسی باشد.';
      isValid = false;
    }

    // اعتبارسنجی نام خانوادگی (فقط حروف فارسی و فاصله مجاز)
    if (!userName.lastName) {
      formErrors.lastName = 'نام خانوادگی نمی‌تواند خالی باشد.';
      isValid = false;
    } else if (!namePattern.test(userName.lastName)) {
      formErrors.lastName = 'نام خانوادگی باید فقط شامل حروف فارسی باشد.';
      isValid = false;
    }

    // اعتبارسنجی شماره تلفن
    const phonePattern = /^(09)[0-9]{9}$/;
    if (!userName.phone) {
      formErrors.phone = 'شماره تلفن نمی‌تواند خالی باشد.';
      isValid = false;
    } else if (!phonePattern.test(userName.phone)) {
      formErrors.phone = 'شماره تلفن باید با 09 شروع و 11 رقم باشد.';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onStartQuiz(userName);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-center">ورود اطلاعات کاربر</h2>
      
      <input 
        type="text" 
        placeholder="نام" 
        value={userName.firstName}
        onChange={(e) => setUserName({ ...userName, firstName: e.target.value })}
        className="w-full p-2 mb-2 border rounded-md text-black"
      />
      {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

      <input 
        type="text" 
        placeholder="نام خانوادگی" 
        value={userName.lastName}
        onChange={(e) => setUserName({ ...userName, lastName: e.target.value })}
        className="w-full p-2 mb-2 border rounded-md text-black"
      />
      {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

      <input 
        type="text" 
        placeholder="شماره تلفن" 
        value={userName.phone}
        onChange={(e) => setUserName({ ...userName, phone: e.target.value })}
        className="w-full p-2 mb-4 border rounded-md text-black"
      />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

      <button
        onClick={handleSubmit}
        className="w-full py-2 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600"
      >
        شروع آزمون
      </button>
    </div>
  );
};

export default UserForm;
