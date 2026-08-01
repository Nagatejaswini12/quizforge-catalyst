import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(name.trim(), role);
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h1 className="page-title">QuizForge</h1>
      <p className="page-sub">Topic-wise practice quizzes with instant, honest feedback.</p>
      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Teja" required />
        </div>
        <div className="field">
          <label htmlFor="role">I am a</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <button className="btn" type="submit" style={{ width: '100%' }}>Continue</button>
      </form>
      <p style={{ fontSize: 12, color: 'var(--pencil)', marginTop: 12 }}>
        Demo login for now — swap for Catalyst Authentication before final submission.
      </p>
    </div>
  );
}
