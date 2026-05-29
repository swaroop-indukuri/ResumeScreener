import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register.jsx"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import Search from "./pages/Search"
import Layout from "./components/Layout"
import Candidate from "./pages/Candidate";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/search" element={<Search />} />
        <Route path="/candidate/:id" element={<Candidate />} />
      </Routes>
    </BrowserRouter>
  );
}