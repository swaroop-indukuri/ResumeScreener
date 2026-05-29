from fastapi import FastAPI, HTTPException
from database import engine, SessionLocal
from models import Base, User
from schemas import UserRegister
from auth import hash_password
from schemas import UserRegister, UserLogin
from auth import hash_password, verify_password, create_access_token
from fastapi import Header
from auth import verify_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends
from fastapi import UploadFile, File
import shutil
import os
from models import Resume
from utils import extract_text_from_pdf
from ai_search import semantic_score
from typing import List
from fastapi import UploadFile, File
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "Resume SaaS Running"}

@app.post("/register")
def register(user: UserRegister):
    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {
        "message": "Account created",
        "id": new_user.id,
        "email": new_user.email
    }
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        form_data.password,
        existing_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {"sub": existing_user.email}
    )

    db.close()

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/me")
def get_me(token: str = Depends(oauth2_scheme)):

    email = verify_token(token)

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    db.close()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "plan": user.plan
    }

@app.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    token: str = Depends(oauth2_scheme)
):
    email = verify_token(token)

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        text = extract_text_from_pdf(file_path)
    except Exception:
        text = ""

    new_resume = Resume(
        filename=file.filename,
        filepath=file_path,
        text_content=text,
        user_id=user.id
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    db.close()

    return {
        "message": "Resume uploaded",
        "file": file.filename,
        "resume_id": new_resume.id
    }

@app.get("/my-resumes")
def my_resumes(token: str = Depends(oauth2_scheme)):

    email = verify_token(token)

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resumes = db.query(Resume).filter(
        Resume.user_id == user.id
    ).all()

    keywords = [
        "python",
        "react",
        "fastapi",
        "sql",
        "javascript",
        "java",
        "mongodb",
        "ai",
        "machine learning",
        "langchain"
    ]

    results = []

    for r in resumes:

        text = r.text_content.lower()

        found_skills = []

        for skill in keywords:
            if skill in text:
                found_skills.append(skill)

        results.append({
            "id": r.id,
            "filename": r.filename,
            "skills": found_skills[:4]
        })

    db.close()

    return results

@app.delete("/resume/{resume_id}")
def delete_resume(
    resume_id: int,
    token: str = Depends(oauth2_scheme)
):
    email = verify_token(token)

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    if resume.user_id != user.id:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    db.delete(resume)
    db.commit()
    db.close()

    return {
        "message": "Resume deleted"
    }

@app.get("/search-resumes")
def search_resumes(q: str):
    db = SessionLocal()

    results = db.query(Resume).filter(
        Resume.text_content.ilike(f"%{q}%")
    ).all()

    db.close()

    return results

@app.get("/rank-resumes")
def rank_resumes(q: str):
    db = SessionLocal()

    resumes = db.query(Resume).all()

    skills = q.lower().split()

    results = []

    for resume in resumes:
        text = resume.text_content.lower()

        matched = []

        score = 0

        for skill in skills:
            if skill in text:
                matched.append(skill)
                score += 1

        if score > 0:
            results.append({
                "id": resume.id,
                "filename": resume.filename,
                "score": score,
                "matched_skills": matched
            })

    db.close()

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results

@app.get("/hybrid-rank")
def hybrid_rank(
    q: str,
    token: str = Depends(oauth2_scheme)
):

    email = verify_token(token)

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resumes = db.query(Resume).filter(
        Resume.user_id == user.id
    ).all()

    skills = q.lower().split()

    results = []

    for resume in resumes:

        text = resume.text_content.lower()

        keyword_score = 0
        matched = []

        for skill in skills:

            if skill in text:
                keyword_score += 1
                matched.append(skill)

        ai_score = semantic_score(
            q,
            resume.text_content
        )

        final_score = (
            keyword_score * 10
        ) + (
            ai_score * 100
        )

        results.append({
            "id": resume.id,
            "filename": resume.filename,
            "keyword_score": keyword_score,
            "ai_score": round(ai_score, 2),
            "final_score": round(final_score, 2),
            "matched_skills": matched
        })

    db.close()

    results.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return results

@app.post("/bulk-upload")
def bulk_upload(
    files: List[UploadFile] = File(...),
    token: str = Depends(oauth2_scheme)
):
    email = verify_token(token)

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    uploaded = []

    for file in files:
        file_path = f"uploads/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text_from_pdf(file_path)

        new_resume = Resume(
            filename=file.filename,
            filepath=file_path,
            text_content=text,
            user_id=user.id
        )

        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        uploaded.append({
            "id": new_resume.id,
            "filename": file.filename
        })

    db.close()

    return {
        "uploaded_count": len(uploaded),
        "files": uploaded
    }

@app.get("/score-resumes")
def score_resumes(q: str):
    db = SessionLocal()

    resumes = db.query(Resume).all()

    required_skills = q.lower().split()

    results = []

    for resume in resumes:
        text = resume.text_content.lower()

        matched = []
        missing = []

        for skill in required_skills:
            if skill in text:
                matched.append(skill)
            else:
                missing.append(skill)

        score = int(
            (len(matched) / len(required_skills)) * 100
        )

        if score >= 80:
            verdict = "Excellent Fit"
        elif score >= 60:
            verdict = "Good Fit"
        elif score >= 40:
            verdict = "Average Fit"
        else:
            verdict = "Low Fit"

        results.append({
            "candidate": resume.filename,
            "score": score,
            "matched": matched,
            "missing": missing,
            "verdict": verdict
        })

    db.close()

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results

@app.get("/candidate-summary/{resume_id}")
def candidate_summary(resume_id: int):
    db = SessionLocal()

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    text = resume.text_content.lower()

    strengths = []

    if "python" in text:
        strengths.append("Python")

    if "sql" in text:
        strengths.append("SQL")

    if "fastapi" in text:
        strengths.append("FastAPI")

    if "react" in text:
        strengths.append("React")

    if "machine learning" in text or "ai" in text:
        strengths.append("AI/ML")

    if "intern" in text:
        exp = "Has internship experience"
    else:
        exp = "No clear internship experience"

    summary = {
        "candidate": resume.filename,
        "top_strengths": strengths,
        "experience": exp,
        "recommendation":
            "Worth Interviewing"
            if len(strengths) >= 3
            else "Needs Review"
    }

    db.close()

    return summary

@app.get("/dashboard")
def dashboard(
    token: str = Depends(oauth2_scheme)
):

    email = verify_token(token)

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    resumes = db.query(Resume).filter(
        Resume.user_id == user.id
    ).all()

    total_resumes = len(resumes)

    skills = []

    keywords = [
        "python",
        "sql",
        "fastapi",
        "react",
        "java",
        "javascript",
        "machine learning",
        "ai"
    ]

    recommended = 0

    for resume in resumes:

        text = resume.text_content.lower()

        found_count = 0

        for word in keywords:

            if word in text:
                skills.append(word)
                found_count += 1

        if found_count >= 3:
            recommended += 1

    top_skills = Counter(skills).most_common(5)

    recent = [
        {
            "id": r.id,
            "file": r.filename
        }
        for r in resumes[-5:]
    ]

    db.close()

    return {
        "total_resumes": total_resumes,
        "recommended_candidates": recommended,
        "top_skills": top_skills,
        "recent_uploads": recent
    }