# ResumeAI – AI-Powered Resume Screening Platform

## Overview

ResumeAI is a full-stack AI-powered recruitment platform that helps recruiters and hiring teams efficiently screen, search, rank, and analyze resumes.

The platform combines traditional keyword matching with semantic AI search to identify the most relevant candidates for a given job requirement. Recruiters can upload resumes individually or in bulk, perform intelligent searches, generate candidate summaries, and manage applicants through a modern dashboard.

---

## Features

### Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* User-Specific Data Isolation
* Secure Password Hashing

### Resume Management

* Upload Resume PDF
* Bulk Resume Upload
* Resume Storage
* Resume Deletion
* Personal Resume Library

### AI-Powered Candidate Search

* Keyword-Based Search
* Resume Ranking
* Hybrid Ranking (Keyword + Semantic Search)
* Candidate Fit Scoring
* Semantic Similarity Matching

### Candidate Analysis

* Candidate Summary Generation
* Skill Extraction
* Match Score Calculation
* Strength Identification
* Hiring Recommendations

### Dashboard & Analytics

* Resume Statistics
* Top Skills Detection
* Recent Uploads
* Candidate Insights

---

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite / PostgreSQL
* JWT Authentication
* PyPDF2
* Sentence Transformers
* Scikit-Learn

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router

### AI / NLP

* all-MiniLM-L6-v2
* Cosine Similarity
* Semantic Search
* Hybrid Ranking Engine

---

## Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
FastAPI Backend
 │
 ├── Authentication (JWT)
 ├── Resume Upload
 ├── Resume Search
 ├── Candidate Ranking
 ├── Candidate Analysis
 │
 ▼
Database (SQLite/PostgreSQL)

AI Layer
 ├── Sentence Transformers
 ├── Semantic Search
 └── Cosine Similarity
```

---

## Project Structure

```text
ResumeScreener/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── ai_search.py
├── auth.py
├── config.py
├── crud.py
├── database.py
├── main.py
├── models.py
├── schemas.py
├── utils.py
├── requirements.txt
├── .env.example
└── README.md
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

DATABASE_URL=sqlite:///./resume.db

RESEND_API_KEY=your_resend_api_key
```

### Generate a Secure Secret Key

```python
import secrets
print(secrets.token_hex(32))
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/swaroop-indukuri/ResumeScreener.git
cd ResumeScreener
```

---

### 2. Backend Setup

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Linux / macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 3. Configure Environment Variables

Create:

```text
.env
```

and add the required values.

---

### 4. Start Backend

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 5. Frontend Setup

Move into frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint  |
| ------ | --------- |
| POST   | /register |
| POST   | /login    |
| GET    | /me       |

### Resume Management

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /upload-resume |
| POST   | /bulk-upload   |
| GET    | /my-resumes    |
| DELETE | /resume/{id}   |

### Search & Ranking

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | /search-resumes         |
| GET    | /rank-resumes           |
| GET    | /hybrid-rank            |
| GET    | /score-resumes          |
| GET    | /candidate-summary/{id} |

### Dashboard

| Method | Endpoint   |
| ------ | ---------- |
| GET    | /dashboard |

---

## AI Search Engine

ResumeAI uses a hybrid ranking approach:

### Keyword Matching

Matches exact skills such as:

* Python
* SQL
* React
* FastAPI
* JavaScript

### Semantic Search

Uses Sentence Transformers:

```python
all-MiniLM-L6-v2
```

to understand meaning and context rather than relying only on exact keyword matches.

### Final Ranking Formula

```text
Final Score =
(Keyword Score × Weight)
+
(Semantic Similarity × Weight)
```

This produces more accurate candidate rankings.

---

## Future Improvements

* Email OTP Verification
* Resume Preview
* Drag & Drop Upload
* Job Description Upload
* AI Interview Question Generator
* Resume Embeddings Storage
* Vector Database Integration (FAISS / ChromaDB)
* Team Workspaces
* Advanced Analytics
* Cloud Deployment
* Recruiter Collaboration Tools

---

## Screenshots

Add screenshots of:

* Home Page
* Login Page
* Dashboard
* Resume Upload
* Candidate Search
* Candidate Summary

after deployment.

---

## Author

**Swaroop Indukuri**

Built as a hands-on project to learn:

* FastAPI
* React
* JWT Authentication
* Resume Parsing
* Semantic Search
* AI-Powered Ranking Systems
* SaaS Architecture
* Full-Stack Development

---

## License

This project is available for educational and portfolio purposes.
