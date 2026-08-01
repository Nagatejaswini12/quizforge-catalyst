import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import BrowseQuizzes from './pages/BrowseQuizzes';
import TakeQuiz from './pages/TakeQuiz';
import CreateQuiz from './pages/CreateQuiz';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import './App.css';

function TopBar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="topbar">
      <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        Quiz<span>Forge</span>
      </Link>
      <nav>
        {user.role === 'student' ? (
          <>
            <Link to="/browse">Browse Quizzes</Link>
            <Link to="/dashboard">My Progress</Link>
          </>
        ) : (
          <>
            <Link to="/teacher">My Quizzes</Link>
            <Link to="/create">New Quiz</Link>
          </>
        )}
        <span className="role-tag">{user.role} · {user.name}</span>
        <button onClick={logout}>Log out</button>
      </nav>
    </div>
  );
}

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Login />;
  return <Navigate to={user.role === 'student' ? '/browse' : '/teacher'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <TopBar />
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/browse" element={<RequireAuth role="student"><BrowseQuizzes /></RequireAuth>} />
            <Route path="/take/:quizId" element={<RequireAuth role="student"><TakeQuiz /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth role="student"><StudentDashboard /></RequireAuth>} />
            <Route path="/teacher" element={<RequireAuth role="teacher"><TeacherDashboard /></RequireAuth>} />
            <Route path="/create" element={<RequireAuth role="teacher"><CreateQuiz /></RequireAuth>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
