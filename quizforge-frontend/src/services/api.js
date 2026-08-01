const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function handle(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const checkHealth = () => fetch(`${BASE_URL}/health`).then(handle);

// Quizzes
export const listQuizzes = () => fetch(`${BASE_URL}/quizzes`).then(handle);

export const getQuizForTaking = (quizId) =>
  fetch(`${BASE_URL}/quizzes/${quizId}`).then(handle);

export const createQuiz = (quiz) =>
  fetch(`${BASE_URL}/quizzes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quiz),
  }).then(handle);

// Attempts
export const submitAttempt = (attempt) =>
  fetch(`${BASE_URL}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attempt),
  }).then(handle);

export const getStudentHistory = (studentId) =>
  fetch(`${BASE_URL}/attempts/student/${studentId}`).then(handle);

export const getQuizAttempts = (quizId) =>
  fetch(`${BASE_URL}/attempts/quiz/${quizId}`).then(handle);
