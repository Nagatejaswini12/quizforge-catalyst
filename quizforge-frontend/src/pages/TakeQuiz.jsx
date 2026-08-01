import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizForTaking, submitAttempt } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TakeQuiz() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuizForTaking(quizId)
      .then((data) => setQuestions(data.questions))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [quizId]);

  const selectAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitAttempt({
        quiz_id: quizId,
        student_id: user.id,
        student_name: user.name,
        answers,
      });
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><p>Loading quiz…</p></div>;
  if (error && !result) return <div className="container"><p style={{ color: 'var(--red-pen)' }}>{error}</p></div>;

  if (result) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Graded</h1>
        <div className="score-stamp">{result.score}/{result.total}</div>
        <p className="page-sub">Nice work. Check your dashboard to see how this topic compares to others.</p>
        <button className="btn" onClick={() => navigate('/dashboard')}>View Dashboard</button>
      </div>
    );
  }

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.question_id]);

  return (
    <div className="container">
      <h1 className="page-title">Quiz Time</h1>
      <p className="page-sub">Answer every question, then submit for instant grading.</p>

      {questions.map((q, idx) => (
        <div className="question-block" key={q.question_id}>
          <div className="question-num">Question {idx + 1} of {questions.length}</div>
          <div className="question-text">{q.question_text}</div>
          {['a', 'b', 'c', 'd'].map((opt) => (
            <div
              key={opt}
              className={`option-row ${answers[q.question_id] === opt ? 'selected' : ''}`}
              onClick={() => selectAnswer(q.question_id, opt)}
            >
              <input
                type="radio"
                readOnly
                checked={answers[q.question_id] === opt}
                name={`q-${q.question_id}`}
              />
              <span>{q[`option_${opt}`]}</span>
            </div>
          ))}
        </div>
      ))}

      {error && <p style={{ color: 'var(--red-pen)' }}>{error}</p>}

      <button className="btn" disabled={!allAnswered || submitting} onClick={handleSubmit}>
        {submitting ? 'Grading…' : 'Submit Quiz'}
      </button>
    </div>
  );
}
