# QuizForge — Catalyst Data Store Schema

Create these tables in Catalyst Console → Data Store → Create Table.
(Console → your project → Data Store → New Table)

## Table: Quizzes
| Column      | Type      | Notes                              |
|-------------|-----------|-------------------------------------|
| quiz_id     | Auto (PK) | auto-generated                      |
| title       | String    | e.g. "Photosynthesis Basics"        |
| subject     | String    | e.g. "Biology"                      |
| topic       | String    | e.g. "Plant Nutrition" — used for weak-area analytics |
| created_by  | String    | teacher's user ID (from Catalyst Auth) |
| created_at  | DateTime  | auto                                |

## Table: Questions
| Column       | Type    | Notes                                   |
|--------------|---------|------------------------------------------|
| question_id  | Auto (PK) | auto-generated                         |
| quiz_id      | Lookup  | references Quizzes.quiz_id              |
| question_text| String  |                                          |
| option_a     | String  |                                          |
| option_b     | String  |                                          |
| option_c     | String  |                                          |
| option_d     | String  |                                          |
| correct_option | String | 'a' / 'b' / 'c' / 'd' — NEVER sent to frontend before submission |

## Table: Attempts
| Column        | Type     | Notes                                  |
|---------------|----------|------------------------------------------|
| attempt_id    | Auto (PK)| auto-generated                          |
| quiz_id       | Lookup   | references Quizzes.quiz_id              |
| student_id    | String   | from Catalyst Auth                      |
| student_name  | String   | denormalized for easy dashboard display |
| score         | Number   | out of total questions                  |
| total         | Number   | total questions in quiz                 |
| topic         | String   | copied from quiz, for weak-area analytics |
| submitted_at  | DateTime | auto                                    |

## Roles
Use Catalyst Authentication's built-in role field, or a simple custom field on the user profile:
- `role: "teacher"` — can create quizzes, view all attempts for their quizzes
- `role: "student"` — can view/take quizzes, view only their own attempts

Set this up in Catalyst Console → Authentication → User Management.
