'use client';

import { useState } from 'react';
import { motion } from 'framer-motion'; 
import { useTheme } from "@/context/ThemeContext"; 
import supabase from '@/lib/supabase';
import { questionsDataOld } from '../QuestionsDataold';
import UserForm from '../UserForm';
import TalentQuizResult from './TalentQuizResult';

const TalentQuiz = () => {
  const { isDarkMode } = useTheme();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState({ firstName: '', lastName: '', phone: '' });

  const handleStartQuiz = async (userName) => {
    const userId = await saveUserToSupabase(userName);
    if (userId) {
      setUserId(userId);
    }
  };

  const saveUserToSupabase = async ({ firstName, lastName, phone }) => {
    const { data, error } = await supabase.from('users').insert([{ 
      first_name: firstName, 
      last_name: lastName, 
      phone_number: phone 
    }]).select();

    if (error) {
      console.error('Error saving user:', error.message);
      return null;
    }
    return data[0].id;
  };

  const handleOptionClick = (optionIndex) => {
    // تغییر امتیازدهی بر اساس سوالات
    let score = 0;
    if (optionIndex === 0) { // برای بله
      score = 1;
    } else if (optionIndex === 1) { // برای خیر
      score = 2;
    }

    setSelectedOption(optionIndex);

    const currentSectionAnswers = answers[currentSectionIndex] || [];
    currentSectionAnswers.push({ 
      questionId: currentQuestionIndex + 1, 
      answer: score 
    });

    const updatedAnswers = [...answers];
    updatedAnswers[currentSectionIndex] = currentSectionAnswers;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = async () => {
    if (selectedOption === null) {
      alert('لطفاً یک گزینه انتخاب کنید!');
      return;
    }

    if (currentQuestionIndex < questionsDataOld[currentSectionIndex].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else if (currentSectionIndex < questionsDataOld.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      await saveAnswersToSupabase(userId, answers);
    }
  };

  const saveAnswersToSupabase = async (userId, answers) => {
    const formattedAnswers = [];

    // برای هر بخش از پاسخ‌ها
    for (let sectionIndex = 0; sectionIndex < answers.length; sectionIndex++) {
        const sectionAnswers = answers[sectionIndex];
        for (let i = 0; i < sectionAnswers.length; i++) {
            const answer = sectionAnswers[i];

            // فرض بر این است که question_id را از داده‌های قبلی بدست می‌آوریم
            const questionId = i + 1; // مثلا سوالات شما به ترتیب از 1 شروع می‌شوند

            formattedAnswers.push({
                user_id: userId,  // شناسه کاربر
                question_id: questionId,  // شناسه سوال
                answer_value: answer.answer,  // امتیاز جواب
                created_at: new Date().toISOString(),  // زمان پاسخ دادن
                section: questionsDataOld[sectionIndex].section // بخش سوالات
            });
        }
    }

    // ذخیره جواب‌ها در جدول new_answers
    const { error } = await supabase.from('new_answers').insert(formattedAnswers);

    if (error) {
        console.error('Error saving answers:', error.message);
    }
  };

  if (quizFinished) {
    return (
      <TalentQuizResult answers={answers} />  // کامپوننت نتیجه آزمون
    );
  }

  const currentSection = questionsDataOld[currentSectionIndex];

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
                {['بله', 'خیر'].map((option, index) => (
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
