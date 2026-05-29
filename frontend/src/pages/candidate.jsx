import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

export default function Candidate() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    fetchCandidate();
  }, []);

  const fetchCandidate = async () => {
    try {
      const res = await API.get(`/candidate-summary/${id}`);

      setCandidate(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!candidate) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow p-8">
          <h1 className="text-3xl font-bold mb-2">{candidate.candidate}</h1>

          <p className="text-gray-500 mb-8">AI Candidate Analysis</p>

          {/* Strengths */}
          <div className="mb-8">
            <h2 className="font-bold text-xl mb-4">Top Strengths</h2>

            <div className="flex flex-wrap gap-3">
              {candidate.top_strengths.map((skill, i) => (
                <div
                  key={i}
                  className="bg-black text-white px-4 py-2 rounded-xl"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 className="font-bold text-xl mb-2">Experience</h2>

            <p className="text-gray-600">{candidate.experience}</p>
          </div>

          {/* Recommendation */}
          <div>
            <h2 className="font-bold text-xl mb-2">Recommendation</h2>

            <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-xl">
              {candidate.recommendation}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
