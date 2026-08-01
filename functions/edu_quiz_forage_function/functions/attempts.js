// server/functions/attempts.js
// Handles: submitting a completed quiz (scored server-side, so answers never leak),
// and fetching a student's / teacher's attempt history for dashboards.

const express = require('express');
const router = express.Router();
const { initCatalyst } = require('../config/catalyst.config');

// POST /api/attempts — student submits answers, server scores it
// body: { quiz_id, student_id, student_name, answers: { question_id: 'a' | 'b' | 'c' | 'd' } }
router.post('/', async (req, res) => {
  try {
    const { quiz_id, student_id, student_name, answers } = req.body;
    if (!quiz_id || !student_id || !answers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const catalystApp = initCatalyst(req);
    const questionsTable = catalystApp.datastore().table('Questions');
    const quizzesTable = catalystApp.datastore().table('Quizzes');
    const attemptsTable = catalystApp.datastore().table('Attempts');

    const allQuestions = await questionsTable.getAllRows();
    const quizQuestions = allQuestions.filter(q => String(q.quiz_id) === String(quiz_id));

    let score = 0;
    quizQuestions.forEach(q => {
      if (answers[q.ROWID] === q.correct_option) score += 1;
    });

    // Get topic from the quiz for weak-area analytics
    const allQuizzes = await quizzesTable.getAllRows();
    const quiz = allQuizzes.find(q => String(q.ROWID) === String(quiz_id));

    const attemptRow = await attemptsTable.insertRow({
      quiz_id,
      student_id,
      student_name,
      score,
      total: quizQuestions.length,
      topic: quiz ? quiz.topic : 'Unknown',
      submitted_at: new Date().toISOString(),
    });

    res.status(201).json({
      attempt_id: attemptRow.ROWID,
      score,
      total: quizQuestions.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/attempts/student/:studentId — a student's own history + weak topics
router.get('/student/:studentId', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const attemptsTable = catalystApp.datastore().table('Attempts');
    const all = await attemptsTable.getAllRows();
    const mine = all.filter(a => String(a.student_id) === String(req.params.studentId));

    // Compute weak topics: average score % per topic, sorted worst-first
    const byTopic = {};
    mine.forEach(a => {
      if (!byTopic[a.topic]) byTopic[a.topic] = { scoreSum: 0, totalSum: 0 };
      byTopic[a.topic].scoreSum += Number(a.score);
      byTopic[a.topic].totalSum += Number(a.total);
    });
    const topicBreakdown = Object.entries(byTopic).map(([topic, v]) => ({
      topic,
      percentage: Math.round((v.scoreSum / v.totalSum) * 100),
    })).sort((a, b) => a.percentage - b.percentage);

    res.json({ attempts: mine, topicBreakdown });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/attempts/quiz/:quizId — teacher's view of all attempts for one quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const attemptsTable = catalystApp.datastore().table('Attempts');
    const all = await attemptsTable.getAllRows();
    const forQuiz = all.filter(a => String(a.quiz_id) === String(req.params.quizId));

    const avgScore = forQuiz.length
      ? Math.round(forQuiz.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / forQuiz.length)
      : 0;

    res.json({ attempts: forQuiz, averageScorePercent: avgScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
