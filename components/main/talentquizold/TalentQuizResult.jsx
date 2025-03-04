import React from 'react';

const TalentQuizResult = ({ answers }) => {
    // محاسبه امتیازها برای هر بخش
    let scoreE = 0;  // برون‌گرایی
    let scoreI = 0;  // درون‌گرایی
    let scoreS = 0;  // حسی
    let scoreN = 0;  // شهودی
    let scoreT = 0;  // تفکری
    let scoreF = 0;  // احساسی
    let scoreJ = 0;  // قضاوتی
    let scoreP = 0;  // ادراکی
  
    answers.forEach(sectionAnswers => {
      sectionAnswers.forEach(answer => {
        // بر اساس پاسخ‌ها امتیازها را اضافه می‌کنیم
        if (answer.answer === 1) {
          if (sectionAnswers.section === 'شیوه تعامل با دنیا: برون‌گرایی (E) / درون‌گرایی (I)') {
            scoreE += 1;  // برون‌گرایی
          } else if (sectionAnswers.section === 'حسی (S) / شهودی (N)') {
            scoreS += 1;  // حسی
          } else if (sectionAnswers.section === 'تفکری (T) / احساسی (F)') {
            scoreT += 1;  // تفکری
          } else if (sectionAnswers.section === 'قضاوتی (J) / ادراکی (P)') {
            scoreJ += 1;  // قضاوتی
          }
        } else {
          if (sectionAnswers.section === 'حسی (S) / شهودی (N)') {
            scoreN += 1;  // شهودی
          } else if (sectionAnswers.section === 'تفکری (T) / احساسی (F)') {
            scoreF += 1;  // احساسی
          } else if (sectionAnswers.section === 'قضاوتی (J) / ادراکی (P)') {
            scoreP += 1;  // ادراکی
          } else {
            scoreI += 1;  // درون‌گرایی
          }
        }
      });
    });
  
    // تعیین نتیجه نهایی
    const result = {
      E_I: scoreE > scoreI ? "برون‌گرا (E)" : "درون‌گرا (I)",
      S_N: scoreS > scoreN ? "حسی (S)" : "شهودی (N)",
      T_F: scoreT > scoreF ? "تفکری (T)" : "احساسی (F)",
      J_P: scoreJ > scoreP ? "قضاوتی (J)" : "ادراکی (P)",
    };
  
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-black">
        <div className="p-8 shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold text-black">نتایج آزمون شما</h2>
          <div className="mt-4">
            <div className="font-bold">شیوه تعامل با دنیا:</div>
            <div>{result.E_I}</div>
          </div>
          <div className="mt-2">
            <div className="font-bold">حسی (S) / شهودی (N):</div>
            <div>{result.S_N}</div>
          </div>
          <div className="mt-2">
            <div className="font-bold">تفکری (T) / احساسی (F):</div>
            <div>{result.T_F}</div>
          </div>
          <div className="mt-2">
            <div className="font-bold">قضاوتی (J) / ادراکی (P):</div>
            <div>{result.J_P}</div>
          </div>
        </div>
      </div>
    );
  };
  

export default TalentQuizResult;
