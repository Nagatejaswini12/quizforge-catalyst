import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listQuizzes } from '../services/api';

export default function BrowseQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listQuizzes()
      .then(setQuizzes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Practice Quizzes</h1>
      <p className="page-sub">Pick a topic, take the quiz, see exactly where you stand.</p>

      {loading && <p>Loading quizzes…</p>}
      {error && <p style={{ color: 'var(--red-pen)' }}>Couldn't load quizzes: {error}. Is the server running?</p>}
      {!loading && !error && quizzes.length === 0 && (
        <div className="empty">No quizzes yet. Ask your teacher to create one.</div>
      )}

      {quizzes.map((q) => (
        <div className="card" key={q.quiz_id}>
          <div className="card-title">{q.title}</div>
          <div className="card-meta">{q.subject} · {q.topic}</div>
          <Link className="btn" to={`/take/${q.quiz_id}`}>Take Quiz</Link>
        </div>
      ))}
    </div>
  );
}
