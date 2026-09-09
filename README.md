QuizForge — Adaptive Practice & Progress Tracker

Zoho Catalyst Program Submission — Theme: Education

Problem Statement

Students often practice using scattered PDFs or generic apps that don't show where they're weak. Teachers have no lightweight way to create quick topic-wise quizzes and instantly see how their class is performing — most tools are either too heavy (full LMS) or too shallow (a plain form).

Solution

QuizForge lets teachers create topic-tagged quizzes in minutes. Students take them and get instant scoring plus a topic-wise weak-area breakdown. Teachers get a live class performance dashboard. Scoring happens server-side in a Catalyst Function — correct answers are never sent to the browser before submission.

Tech Stack
Frontend: React (React Router for navigation, role-based views)
Backend: Node.js + Express, deployed as a Zoho Catalyst Advanced I/O Function
Platform: Zoho Catalyst
Data Store — Quizzes, Questions, Attempts tables
Functions — quiz creation/listing, server-side scoring, analytics endpoints
Authentication — (see Auth section below — currently stubbed, wire in before final submission)
Project Structure
zoho-catalyst-project/
├── client/                     # React frontend
│   └── src/
│       ├── context/AuthContext.jsx   # stubbed login (swap for Catalyst Auth)
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── BrowseQuizzes.jsx     # student: browse quizzes
│       │   ├── TakeQuiz.jsx          # student: take + get graded
│       │   ├── StudentDashboard.jsx  # student: progress + weak topics
│       │   ├── CreateQuiz.jsx        # teacher: create quiz
│       │   └── TeacherDashboard.jsx  # teacher: quiz list + analytics
│       ├── services/api.js
│       └── App.jsx
├── server/                     # Express backend → deployed as Catalyst Function
│   ├── config/catalyst.config.js
│   ├── functions/
│   │   ├── quizzes.js           # create/list/get quiz (answers hidden)
│   │   └── attempts.js          # submit + score, student/teacher analytics
│   ├── DATA_SCHEMA.md           # Data Store table definitions
│   └── index.js
└── README.md
Getting Started (local dev)
1. Install dependencies
bash
cd client && npm install
cd ../server && npm install
2. Set up Zoho Catalyst
Go to https://catalyst.zoho.com → create a new project (e.g. "QuizForge").
Create the Data Store tables described in server/DATA_SCHEMA.md.
Install the CLI: npm install -g zcatalyst-cli
Inside server/, run catalyst login then catalyst init and link to your project.
Set up Authentication in Catalyst Console (Authentication → User Management) with a role field ("student" / "teacher") on the user profile.
3. Run locally
bash
# Terminal 1 - backend
cd server && npm start
# Terminal 2 - frontend
cd client && npm start
4. Deploy
bash
cd server
catalyst deploy

Then deploy the React build (npm run build in client/) as a Catalyst Client/Web app, or serve it via Catalyst's static hosting — see Catalyst Console → your project → Web Client.

What's stubbed vs. wired to Catalyst
✅ Wired: All quiz/attempt logic goes through the Express routes in server/functions/, written against the zcatalyst-sdk-node Data Store API — this becomes real once tables exist and catalyst init links the project.
⚠️ Stubbed (do before final submission): AuthContext.jsx currently just stores a name/role in localStorage so the app is testable without a live Catalyst project. Replace this with Catalyst's Authentication SDK so student_id comes from a verified session — this matters for both correctness (can't fake being another student) and for showing judges you used Catalyst Auth.
Pushing to GitHub
bash
cd zoho-catalyst-project
git init
git add .
git commit -m "Initial QuizForge project"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
