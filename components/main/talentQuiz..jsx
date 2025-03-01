'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { useTheme } from "@/context/ThemeContext"; 
import supabase from '@/lib/supabase';

const TalentQuiz = () => {
  const { isDarkMode } = useTheme(); 

  const questionsData = [
    'آیا کودک هنگام شنیدن موسیقی با دست یا پا ضرب می‌گیرد؟',
    'آیا کودک تلاش می‌کند یک آهنگ ساده را بخواند یا تکرار کند؟',
    'آیا صدای آلات موسیقی کودک را جذب خود می‌کند؟',
    'آیا کودک می‌تواند تفاوت بین صدای زیر و بم را تشخیص دهد؟',
    'آیا کودک به‌طور طبیعی ریتم‌های موسیقی را دنبال می‌کند؟',
    'آیا کودک می‌تواند روی یک پا بایستد؟',
    'آیا کودک در دویدن یا پریدن هماهنگ است؟',
    'آیا کودک می‌تواند با دقت توپ را هدف بگیرد؟',
    'آیا کودک توانایی بالارفتن از تجهیزات پارک را دارد؟',
    'آیا در فعالیت‌هایی مثل رقصیدن با انرژی و هماهنگی حرکت می‌کند؟',
    'آیا کودک در حل پازل‌های ساده موفق عمل می‌کند؟',
    'آیا می‌تواند تشخیص دهد که چه شیئی کجاست؟',
    'آیا علاقه‌مند به بازی‌های جورچین یا دسته‌بندی اشیا است؟',
    'آیا کودک قادر است ترتیب رویدادها را بیان کند؟',
    'آیا کودک به مرتب‌سازی و سازمان‌دهی اشیا علاقه دارد؟',
    'آیا کودک به طراحی و نقاشی علاقه نشان می‌دهد؟',
    'آیا کودک دوست دارد با خمیربازی اشکال بسازد؟',
    'آیا هنگام بازی داستان یا ماجرایی برای خود می‌سازد؟',
    'آیا کودک به رنگ‌آمیزی تصاویر و استفاده از ابزارهای هنری علاقه دارد؟',
    'آیا اشیای معمولی را به شیوه خلاقانه‌ای استفاده می‌کند؟',
    
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [userName, setUserName] = useState({ firstName: '', lastName: '', phone: '' });

  // ثبت کاربر و ایجاد پرسشنامه
  const handleStartQuiz = async () => {
    const userId = await saveUserToSupabase(userName);
    if (userId) {
      setUserId(userId);
      const questionnaireId = await saveQuestionnaireToSupabase(userId);
      if (questionnaireId) {
        setQuestionnaireId(questionnaireId);
        await saveQuestionsToSupabase(questionnaireId);
      }
    }
  };

  // ذخیره اطلاعات کاربر در Supabase
  const saveUserToSupabase = async ({ firstName, lastName, phone }) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ first_name: firstName, last_name: lastName, phone_number: phone }])
      .select();
    
    if (error) {
      console.error('خطا در ذخیره کاربر:', error.message);
      return null;
    }
    return data[0].id;
  };

  // ایجاد یک پرسشنامه جدید
  const saveQuestionnaireToSupabase = async (userId) => {
    const { data, error } = await supabase
      .from('questionnaires')
      .insert([{ user_id: userId, questionnaire_number: Math.floor(Math.random() * 100000) }])
      .select();
    
    if (error) {
      console.error('خطا در ذخیره پرسشنامه:', error.message);
      return null;
    }
    return data[0].id;
  };

  // ذخیره سوالات آزمون در Supabase
  const saveQuestionsToSupabase = async (questionnaireId) => {
    const questions = questionsData.map((text) => ({
      questionnaire_id: questionnaireId,
      question_text: text
    }));

    const { error } = await supabase.from('questions').insert(questions);

    if (error) {
      console.error('خطا در ذخیره سوالات:', error.message);
    }
  };

  // ثبت پاسخ
  const handleOptionClick = (optionIndex) => {
    setSelectedOption(optionIndex);
    setAnswers(prev => [...prev, { questionId: currentQuestionIndex + 1, answer: optionIndex }]);
  };

  const handleNextQuestion = async () => {
    if (selectedOption === null) {
      alert('لطفا یک گزینه انتخاب کنید!');
      return;
    }

    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      await saveAnswersToSupabase(userId, answers);
    }
  };

  // ذخیره پاسخ‌ها در Supabase
  const saveAnswersToSupabase = async (userId, answers) => {
    const formattedAnswers = answers.map(answer => ({
      user_id: userId,
      question_id: answer.questionId,
      answer_value: answer.answer,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('answers').insert(formattedAnswers);

    if (error) {
      console.error('خطا در ذخیره پاسخ‌ها:', error.message);
    }
  };

  if (quizFinished) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-black/60 text-white' : 'bg-white/60 text-black'}`}>
        <div className="p-8 shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-500">پاسخ شما ثبت شد!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center px-4">
      <div className={`p-8 shadow-lg rounded-lg w-full max-w-lg ${isDarkMode ? 'bg-gray-800/60 text-white' : 'bg-white/60 text-black'}`}>
        {!userId ? (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">ورود اطلاعات کاربر</h2>
            <input 
              type="text" 
              placeholder="نام" 
              value={userName.firstName}
              onChange={(e) => setUserName({ ...userName, firstName: e.target.value })}
              className="w-full p-2 mb-2 border rounded-md"
            />
            <input 
              type="text" 
              placeholder="نام خانوادگی" 
              value={userName.lastName}
              onChange={(e) => setUserName({ ...userName, lastName: e.target.value })}
              className="w-full p-2 mb-2 border rounded-md"
            />
            <input 
              type="text" 
              placeholder="شماره تلفن" 
              value={userName.phone}
              onChange={(e) => setUserName({ ...userName, phone: e.target.value })}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <button
              onClick={handleStartQuiz}
              className="w-full py-2 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              شروع آزمون
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">{`سوال ${currentQuestionIndex + 1}`}</h2>
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">{questionsData[currentQuestionIndex]}</h3>
              <div className="space-y-4">
                {['خیلی زیاد', 'خوب', 'گاهی', 'به ندرت'].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index + 1)}
                    className={`w-full py-2 text-lg rounded-md border transition-colors duration-300 ${selectedOption === index + 1 ? 'bg-green-500 text-white' : 'bg-gray-400/80 hover:bg-green-600 hover:text-white'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="mt-4">
              <button onClick={handleNextQuestion} className="w-full py-2 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600">
                سوال بعدی
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TalentQuiz;
