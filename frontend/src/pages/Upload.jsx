import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);

      await API.post("/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upload successful");
      setFiles([]);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <UploadCloud size={50} />
            </div>

            <h1 className="text-3xl font-bold">Upload Resumes</h1>

            <p className="text-gray-500 mt-2">
              Upload multiple resumes for AI analysis
            </p>
          </div>

          {/* Upload Area */}
          <label className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
            <UploadCloud size={40} className="mb-4 text-gray-500" />

            <p className="font-medium">Click to select resumes</p>

            <p className="text-sm text-gray-500 mt-1">PDF files only</p>

            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles([...e.target.files])}
            />
          </label>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl"
                >
                  <FileText size={20} />

                  <p className="text-sm font-medium">{file.name}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            {loading ? "Uploading..." : "Upload Resumes"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
