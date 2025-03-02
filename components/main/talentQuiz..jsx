'use client';
import { useState } from 'react';
import { motion } from 'framer-motion'; 
import { useTheme } from "@/context/ThemeContext"; 
import supabase from '@/lib/supabase';
import { questionsData } from './QuestionsData'; // استفاده از آرایه سوالات
import UserForm from './UserForm'; // وارد کردن کامپوننت جدید

const TalentQuiz = () => {
  const { isDarkMode } = useTheme();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState({ firstName: '', lastName: '', phone: '' });

  // تعریف امتیازات برای هر گزینه
  const optionScores = [4, 3, 2, 1];

  // ثبت کاربر و ایجاد پرسشنامه
  const handleStartQuiz = async (userName) => {
    const userId = await saveUserToSupabase(userName);
    if (userId) {
      setUserId(userId);
    }
  };

  // ذخیره اطلاعات کاربر در Supabase
  const saveUserToSupabase = async ({ firstName, lastName, phone }) => {
    const { data, error } = await supabase.from('users').insert([{ first_name: firstName, last_name: lastName, phone_number: phone }]).select();
    if (error) {
      console.error('Error saving user:', error.message);
      return null;
    }
    return data[0].id;
  };

  // ثبت پاسخ
  const handleOptionClick = (optionIndex) => {
    const score = optionScores[optionIndex];
    setSelectedOption(optionIndex);
    setAnswers(prev => [...prev, { questionId: currentQuestionIndex + 1, answer: score }]);
  };

  // پیشروی به سوال بعدی
  const handleNextQuestion = async () => {
    if (selectedOption === null) {
      alert('Please select an option!');
      return;
    }

    if (currentQuestionIndex < questionsData[currentSectionIndex].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else if (currentSectionIndex < questionsData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      await saveAnswersToSupabase(userId, answers); // ذخیره پاسخ‌ها
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
      console.error('Error saving answers:', error.message);
    }
  };

  // محاسبه نمرات و نمایش آن در کارنامه
  const calculateResults = (answers) => {
    const results = {};
    
    questionsData.forEach((section, sectionIndex) => {
      let sectionScore = 0;
      section.questions.forEach((question, questionIndex) => {
        const answer = answers.find(a => a.questionId === questionIndex + 1);
        if (answer) {
          sectionScore += answer.answer;
        }
      });

      // تفسیر نمرات هر بخش
      if (sectionScore >= 17) {
        results[section.section] = { result: 'استعداد بالا', score: sectionScore };
      } else if (sectionScore >= 12) {
        results[section.section] = { result: 'استعداد متوسط، که با تقویت می‌تواند رشد کند', score: sectionScore };
      } else {
        results[section.section] = { result: 'استعداد کم، اما با تمرین می‌توان مهارت را بهبود بخشید', score: sectionScore };
      }
    });

    return results;
  };

  // نمایش کارنامه
  if (quizFinished) {
    const results = calculateResults(answers);

    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-black/60 text-white' : 'bg-white/60 text-black'}`}>
        <div className="p-8 shadow-lg rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-500">پاسخ شما ثبت شد!</h2>
          
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-4">نتایج شما:</h3>
            {Object.keys(results).map((section, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg font-semibold">{section}</h4>
                <p>{results[section].result}</p>
                <p className="text-lg font-bold">امتیاز: {results[section].score}</p> {/* نمایش امتیاز */}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={() => window.location.reload()} // ریست آزمون و بارگذاری مجدد صفحه
              className="w-full py-2 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              شروع مجدد آزمون
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = questionsData[currentSectionIndex];

  return (
    <div className="flex justify-center items-center px-4">
      <div className={`p-8 shadow-lg rounded-lg w-full max-w-lg ${isDarkMode ? 'bg-gray-800/60 text-white' : 'bg-white/60 text-black'}`}>
        {!userId ? (
          <UserForm onStartQuiz={handleStartQuiz} />
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">{`بخش: ${currentSection.section} - سوال ${currentQuestionIndex + 1}`}</h2>
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">{currentSection.questions[currentQuestionIndex]}</h3>
              <div className="space-y-4">
                {['خیلی زیاد', 'خوب', 'گاهی', 'به ندرت'].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    className={`w-full py-2 text-lg rounded-md border transition-colors duration-300 ${selectedOption === index ? 'bg-green-500 text-white' : 'bg-gray-400/80 hover:bg-green-600 hover:text-white'}`}
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
