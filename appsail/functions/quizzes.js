// server/functions/quizzes.js
// Handles: creating quizzes (teacher), listing quizzes, fetching a quiz for taking (no answers exposed)

const express = require('express');
const router = express.Router();
const { initCatalyst } = require('../config/catalyst.config');

// POST /api/quizzes  — teacher creates a quiz with questions
router.post('/', async (req, res) => {
  try {
    const { title, subject, topic, created_by, questions } = req.body;
    if (!title || !subject || !topic || !questions || !questions.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const catalystApp = initCatalyst(req);
    const quizzesTable = catalystApp.datastore().table('Quizzes');
    const questionsTable = catalystApp.datastore().table('Questions');

    const quizRow = await quizzesTable.insertRow({
      title, subject, topic, created_by,
      created_at: new Date().toISOString(),
    });
    const quiz_id = quizRow.ROWID;

    // Insert all questions linked to this quiz
    const questionRows = questions.map(q => ({
      quiz_id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option, // 'a' | 'b' | 'c' | 'd'
    }));
    await questionsTable.insertRows(questionRows);

    res.status(201).json({ quiz_id, message: 'Quiz created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quizzes — list all quizzes (for student browse page)
router.get('/', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const quizzesTable = catalystApp.datastore().table('Quizzes');
    const rows = await quizzesTable.getAllRows();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quizzes/:id — fetch a quiz WITHOUT correct answers, for a student to take
router.get('/:id', async (req, res) => {
  try {
    const catalystApp = initCatalyst(req);
    const questionsTable = catalystApp.datastore().table('Questions');

    // Ideally use a zcql query filtered by quiz_id; getAllRows shown here for simplicity
    const allQuestions = await questionsTable.getAllRows();
    const quizQuestions = allQuestions
      .filter(q => String(q.quiz_id) === String(req.params.id))
      .map(q => ({
        question_id: q.question_id,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        // correct_option intentionally omitted
      }));

    res.json({ quiz_id: req.params.id, questions: quizQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
