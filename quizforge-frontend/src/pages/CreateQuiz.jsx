import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../services/api';
import { useAuth } from '../context/AuthContext';

const blankQuestion = () => ({
  question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'a',
});

export default function CreateQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([blankQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const updateQuestion = (idx, field, value) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  };

  const addQuestion = () => setQuestions((prev) => [...prev, blankQuestion()]);
  const removeQuestion = (idx) => setQuestions((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createQuiz({ title, subject, topic, created_by: user.id, questions });
      navigate('/teacher');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Create a Quiz</h1>
      <p className="page-sub">Takes a couple of minutes. Students see this instantly.</p>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="two-col">
            <div className="field">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Photosynthesis Basics" />
            </div>
            <div className="field">
              <label>Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g. Biology" />
            </div>
          </div>
          <div className="field">
            <label>Topic (used for weak-area tracking)</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="e.g. Plant Nutrition" />
          </div>
        </div>

        {questions.map((q, idx) => (
          <div className="question-block" key={idx}>
            <div className="question-num">Question {idx + 1}</div>
            <div className="field">
              <input
                value={q.question_text}
                onChange={(e) => updateQuestion(idx, 'question_text', e.target.value)}
                placeholder="Question text"
                required
              />
            </div>
            <div className="two-col">
              {['a', 'b', 'c', 'd'].map((opt) => (
                <div className="field" key={opt}>
                  <label>Option {opt.toUpperCase()}</label>
                  <input
                    value={q[`option_${opt}`]}
                    onChange={(e) => updateQuestion(idx, `option_${opt}`, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
            <div className="field">
              <label>Correct option</label>
              <select value={q.correct_option} onChange={(e) => updateQuestion(idx, 'correct_option', e.target.value)}>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </div>
            {questions.length > 1 && (
              <button type="button" className="btn secondary" onClick={() => removeQuestion(idx)}>
                Remove Question
              </button>
            )}
          </div>
        ))}

        <button type="button" className="btn secondary" onClick={addQuestion} style={{ marginRight: 10 }}>
          + Add Question
        </button>

        {error && <p style={{ color: 'var(--red-pen)', marginTop: 12 }}>{error}</p>}

        <div style={{ marginTop: 20 }}>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Publish Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}
