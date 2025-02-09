'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { quiz } from '../data.js';
import { quiz1_50 } from '../data1-50.js';
import { quiz51_99 } from '../data51-99.js';
import { quiz100_150 } from '../data100-150.js';
import { quiz151_201 } from '../data151-201.js';
import { quiz202_252 } from '../data202-252.js';
import { quiz253_302 } from '../data253-302.js';
import { quiz303_347 } from '../data303-347.js';
import { toast } from 'sonner';

const datasets = {
  quiz,
  quiz1_50,
  quiz51_99,
  quiz100_150,
  quiz151_201,
  quiz202_252,
  quiz253_302,
  quiz303_347,
};

const Page = () => {
  const searchParams = useSearchParams();
  const datasetKey = searchParams.get('dataset') || 'quiz'; 
  const selectedDataset = datasets[datasetKey];

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    wrongAnsweredOnce: new Set(), 
  });
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    if (selectedDataset) {
      setShuffledQuestions(shuffleArray([...selectedDataset.questions]));
    }
  }, [selectedDataset]);

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      setShuffledAnswers(shuffleArray([...shuffledQuestions[activeQuestion].answers]));
    }
  }, [activeQuestion, shuffledQuestions]);

  const onAnswerSelected = (answer, idx) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    const isCorrect = answer === shuffledQuestions[activeQuestion].correctAnswer;
    setSelectedAnswer(isCorrect);

    if (!isCorrect && !result.wrongAnsweredOnce.has(activeQuestion)) {
      setResult((prev) => {
        const updatedWrongAnswers = new Set(prev.wrongAnsweredOnce);
        updatedWrongAnswers.add(activeQuestion);
        return {
          ...prev,
          wrongAnsweredOnce: updatedWrongAnswers,
        };
      });
    }
  };

  const nextQuestion = () => {
    if (selectedAnswer) {
      setResult((prev) => ({
        ...prev,
        score: prev.score + 5,
        correctAnswers: prev.correctAnswers + 1,
      }));

      if (activeQuestion !== shuffledQuestions.length - 1) {
        setActiveQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }

      setChecked(false);
      setSelectedAnswerIndex(null);
    } else {
      toast("Risposta sbagliata riprova");
    }
  };

  return (
    <div className='container'>
      <h1>Quiz</h1>
      <div>
        <h2>
          Question: {activeQuestion + 1}
          <span>/{shuffledQuestions.length}</span>
        </h2>
      </div>
      <div>
        {!showResult ? (
          <div className='quiz-container'>
            <h3>{shuffledQuestions[activeQuestion]?.question}</h3>
            {shuffledAnswers.map((answer, idx) => (
              <li
                key={idx}
                onClick={() => onAnswerSelected(answer, idx)}
                className={
                  selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'
                }
              >
                <span>{answer}</span>
              </li>
            ))}
            {checked ? (
              <button onClick={nextQuestion} className='btn'>
                {activeQuestion === shuffledQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            ) : (
              <button onClick={nextQuestion} disabled className='btn-disabled'>
                {activeQuestion === shuffledQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        ) : (
          <div className='quiz-container'>
            <h3>Risultato</h3>
            <p>
              Risposte sbagliate: <span>{result.wrongAnsweredOnce.size}</span>
            </p>
            <button onClick={() => window.location.reload()}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
