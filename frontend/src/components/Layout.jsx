import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

export default function Layout({ children }) {
  const navigate = useNavigate()

  const logout = () => {
    Cookies.remove("token")
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow p-5 space-y-4">

        <h1 className="text-xl font-bold">Resume SaaS</h1>

        <nav className="space-y-3 mt-6">

          <Link to="/dashboard" className="block">Dashboard</Link>
          <Link to="/upload" className="block">Upload</Link>
          <Link to="/search" className="block">Search</Link>

        </nav>

        <button
          onClick={logout}
          className="mt-10 bg-black text-white w-full py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>

    </div>
  )
}