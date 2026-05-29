import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import API from "../services/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const formData = new URLSearchParams()

      formData.append("username", email)
      formData.append("password", password)

      const res = await API.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      console.log("SUCCESS RESPONSE:", res.data)

      const token = res.data.access_token

      if (!token) {
        throw new Error("Token missing")
      }

      Cookies.set("token", token)

      alert("Login success")

      navigate("/dashboard")

    } catch (err) {
      console.log("LOGIN ERROR:", err)
      alert("Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full rounded"
        />

        <button className="bg-black text-white w-full py-3 rounded">
          Login
        </button>
      </form>

    </div>
  )
}