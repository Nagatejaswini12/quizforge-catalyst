import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listQuizzes, getQuizAttempts } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listQuizzes()
      .then((all) => setQuizzes(all.filter((q) => q.created_by === user.id)))
      .finally(() => setLoading(false));
  }, [user.id]);

  const viewAnalytics = (quiz) => {
    setSelected(quiz);
    getQuizAttempts(quiz.quiz_id).then(setAnalytics);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Your Quizzes</h1>
          <p className="page-sub">Manage what you've published and see how the class is doing.</p>
        </div>
        <Link className="btn" to="/create">+ New Quiz</Link>
      </div>

      {loading && <p>Loading…</p>}
      {!loading && quizzes.length === 0 && (
        <div className="empty">You haven't created any quizzes yet.</div>
      )}

      {quizzes.map((q) => (
        <div className="card" key={q.quiz_id}>
          <div className="card-title">{q.title}</div>
          <div className="card-meta">{q.subject} · {q.topic}</div>
          <button className="btn secondary" onClick={() => viewAnalytics(q)}>View Analytics</button>
        </div>
      ))}

      {selected && analytics && (
        <div className="card">
          <div className="card-title">Analytics — {selected.title}</div>
          <p style={{ marginBottom: 16 }}>
            Class average: <strong>{analytics.averageScorePercent}%</strong> across {analytics.attempts.length} attempt(s)
          </p>
          {analytics.attempts.length > 0 && (
            <table className="data-table">
              <thead><tr><th>Student</th><th>Score</th><th>Submitted</th></tr></thead>
              <tbody>
                {analytics.attempts.map((a) => (
                  <tr key={a.attempt_id}>
                    <td>{a.student_name}</td>
                    <td>{a.score}/{a.total}</td>
                    <td>{new Date(a.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
