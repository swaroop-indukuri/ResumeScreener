import { useState } from "react";
import { Search as SearchIcon, FileText } from "lucide-react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/hybrid-rank?q=${query}`);

      setResults(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <SearchIcon size={45} />
            </div>

            <h1 className="text-4xl font-bold">AI Resume Search</h1>

            <p className="text-gray-500 mt-2">
              Find the best candidates using AI ranking
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white shadow-lg rounded-2xl p-3 flex gap-3 mb-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="python react fastapi ai..."
              className="flex-1 outline-none px-3"
            />

            <button
              onClick={search}
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              Search
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {loading && <p className="text-center">Searching...</p>}

            {results.map((r, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <FileText />

                    <div>
                      <h2 className="font-bold text-lg">{r.filename}</h2>

                      <p className="text-sm text-gray-500">
                        Skills: {r.matched_skills?.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black text-white px-4 py-2 rounded-xl text-sm">
                    Score: {r.final_score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
