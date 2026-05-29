import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchUser();
    fetchResumes();
    fetchDashboard();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/me");
      setUser(res.data);
    } catch (err) {
      navigate("/login");
    }
  };

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/my-resumes");
      setResumes(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteResume = async (id) => {
    try {
      await API.delete(`/resume/${id}`);

      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p className="text-gray-500">Welcome {user?.name || "User"}</p>
        </div>

        <button
          onClick={() => {
            Cookies.remove("token");
            navigate("/login");
          }}
          className="bg-black text-white px-5 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">Total Resumes</h2>
          <p className="text-3xl font-bold">{resumes.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">AI Processed</h2>
          <p className="text-3xl font-bold">
            {stats?.recommended_candidates || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500">Top Match Score</h2>
          <p className="text-lg font-semibold">
            {stats?.top_skills?.[0]?.[0] || "None"}
          </p>
        </div>
      </div>

      {/* Resume List */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Uploaded Resumes</h2>

        {loading ? (
          <p className="text-gray-500">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="text-gray-500">No resumes found</p>
        ) : (
          <div className="space-y-3">
            {resumes.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/candidate/${r.id}`)}
                className="p-4 bg-gray-100 rounded-xl flex justify-between cursor-pointer hover:bg-gray-200 transition"
              >
                <div>
                  <p className="font-semibold">{r.filename}</p>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {r.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    AI Processed
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResume(r.id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
