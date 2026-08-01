const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/quizzes', require('./functions/quizzes'));
app.use('/attempts', require('./functions/attempts'));

module.exports = app;
