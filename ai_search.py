from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

def semantic_score(query, text):
    q_vec = model.encode([query])
    t_vec = model.encode([text[:3000]])

    score = cosine_similarity(q_vec, t_vec)[0][0]

    return float(score)