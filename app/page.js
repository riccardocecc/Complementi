'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [selectedQuiz, setSelectedQuiz] = useState('quiz');

  return (
    <main>
      <div className='container'>
        <h1>Quiz App</h1>
        <select
          value={selectedQuiz}
          onChange={(e) => setSelectedQuiz(e.target.value)}
          className='px-3 py-1 mt-2 rounded-sm'
        >
          <option value="quiz">Quiz</option>
          <option value="quiz1_50">Quiz 1-50</option>
          <option value="quiz51_99">Quiz 51-99</option>
          <option value="quiz100_150">Quiz 100-150</option>
          <option value="quiz151_201">Quiz 151-201</option>
          <option value="quiz202_252">Quiz 202-252</option>
          <option value="quiz253_302">Quiz 253-302</option>
          <option value="quiz303_347">Quiz 303-347</option>
        </select>
        <Link href={`/quiz?dataset=${selectedQuiz}`}>
          <button>Start Quiz</button>
        </Link>
      </div>
    </main>
  );
}
