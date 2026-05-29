import { Link } from "react-router-dom";
import { FileSearch, Brain, Upload, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">ResumeAI</h1>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-700 hover:text-black">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-black text-white px-5 py-2 rounded-xl"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">
        <h1 className="text-6xl font-bold leading-tight mb-6">
          AI Powered
          <br />
          Resume Screening
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Upload resumes, analyze candidates, rank applicants using AI, and
          streamline hiring faster than ever.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-black text-white px-8 py-4 rounded-2xl text-lg"
          >
            Start Free
          </Link>

          <Link
            to="/login"
            className="bg-white border px-8 py-4 rounded-2xl text-lg"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful AI Features</h2>

          <p className="text-gray-500">
            Everything needed for modern AI recruiting
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow">
            <Upload size={40} className="mb-4" />

            <h3 className="font-bold text-xl mb-2">Bulk Upload</h3>

            <p className="text-gray-500">
              Upload hundreds of resumes instantly
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <Brain size={40} className="mb-4" />

            <h3 className="font-bold text-xl mb-2">AI Analysis</h3>

            <p className="text-gray-500">
              Intelligent candidate insights and summaries
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <FileSearch size={40} className="mb-4" />

            <h3 className="font-bold text-xl mb-2">Semantic Search</h3>

            <p className="text-gray-500">
              Find the best candidates using AI ranking
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <CheckCircle size={40} className="mb-4" />

            <h3 className="font-bold text-xl mb-2">Recruiter Dashboard</h3>

            <p className="text-gray-500">
              Manage and review applicants efficiently
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-black text-white py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Simple Pricing</h2>

          <p className="text-gray-300 mb-12">
            Start free and scale as you grow
          </p>

          <div className="bg-white text-black rounded-3xl p-10 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-2">Free Plan</h3>

            <p className="text-5xl font-bold mb-6">₹0</p>

            <div className="space-y-4 text-left mb-8">
              <p>✔ Upload resumes</p>
              <p>✔ AI ranking</p>
              <p>✔ Candidate summaries</p>
              <p>✔ Recruiter dashboard</p>
            </div>

            <Link
              to="/register"
              className="block bg-black text-white py-3 rounded-2xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">About ResumeAI</h2>

        <p className="text-gray-600 text-lg leading-relaxed">
          ResumeAI is an AI-powered recruitment platform designed to help
          recruiters and companies screen resumes faster using semantic search,
          intelligent ranking, and automated candidate analysis.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-500">
        © 2026 ResumeAI. All rights reserved.
      </footer>
    </div>
  );
}
