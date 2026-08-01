const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/quizzes', require('./functions/quizzes'));
app.use('/api/attempts', require('./functions/attempts'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/debug-env', (req, res) => { res.json({ CATALYST_CONFIG: process.env.CATALYST_CONFIG ? 'EXISTS' : 'MISSING', allCatalystKeys: Object.keys(process.env).filter(k => k.includes('CATALYST') || k.includes('ZC_') || k.includes('ZOHO')) }); });
