import React, { useEffect, useState } from 'react';
import { getStudentHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ attempts: [], topicBreakdown: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentHistory(user.id).then(setData).finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <div className="container"><p>Loading your progress…</p></div>;

  return (
    <div className="container">
      <h1 className="page-title">Your Progress</h1>
      <p className="page-sub">Where you're strong, and what needs another look.</p>

      <div className="card">
        <div className="card-title">Topic Breakdown</div>
        {data.topicBreakdown.length === 0 && <p style={{ color: 'var(--pencil)' }}>Take a quiz to see your breakdown here.</p>}
        {data.topicBreakdown.map((t) => (
          <div className="topic-bar-row" key={t.topic}>
            <div className="topic-label">{t.topic}</div>
            <div className="topic-track">
              <div className={`topic-fill ${t.percentage < 60 ? 'weak' : ''}`} style={{ width: `${t.percentage}%` }} />
            </div>
            <div className="topic-pct">{t.percentage}%</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Attempt History</div>
        {data.attempts.length === 0 ? (
          <p style={{ color: 'var(--pencil)' }}>No attempts yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Topic</th><th>Score</th><th>Submitted</th></tr>
            </thead>
            <tbody>
              {data.attempts.map((a) => (
                <tr key={a.attempt_id}>
                  <td>{a.topic}</td>
                  <td>{a.score}/{a.total}</td>
                  <td>{new Date(a.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
