import React from 'react';

const TalentQuizResult = ({ answers }) => {
  // محاسبه امتیازهای E و I
  let scoreE = 0;  // برون‌گرایی
  let scoreI = 0;  // درون‌گرایی

  answers.forEach(sectionAnswers => {
    sectionAnswers.forEach(answer => {
      if (answer.answer === 1) {
        scoreE += 1;  // بله برای E
      } else {
        scoreI += 1;  // خیر برای I
      }
    });
  });

  // تعیین نتیجه
  const result = scoreE > scoreI ? "برون‌گرا (E)" : "درون‌گرا (I)";

  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-black">
      <div className="p-8 shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold text-green-500">نتیجه آزمون شما</h2>
        <div className="mt-4">
          <p className="text-xl">نتیجه شما: {result}</p>
          <p className="mt-2 text-lg">
            {result === "برون‌گرا (E)" 
              ? "شما انرژی خود را از تعاملات اجتماعی می‌گیرید و به محیط‌های گروهی علاقه دارید." 
              : "شما ترجیح می‌دهید زمان بیشتری را به‌تنهایی یا در دایره کوچکی از دوستان نزدیک سپری کنید."}
          </p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()} 
              className="w-full py-2 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              شروع مجدد آزمون
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentQuizResult;
