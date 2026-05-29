export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b bg-white">
      <h1 className="text-2xl font-bold">HireFlow</h1>

      <div className="space-x-6 hidden md:block">
        <a href="#" className="text-gray-600 hover:text-black">Features</a>
        <a href="#" className="text-gray-600 hover:text-black">Pricing</a>
        <a href="#" className="text-gray-600 hover:text-black">About</a>
      </div>

      <button className="bg-black text-white px-5 py-2 rounded-xl">
        Login
      </button>
    </nav>
  )
}