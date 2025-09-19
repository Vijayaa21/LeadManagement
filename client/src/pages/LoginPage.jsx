export default function Login() {
  return (
    <div
      className="flex items-center justify-center min-h-screen w-screen"
      style={{ background: "linear-gradient(135deg, #008080, #00ffff)" }}
    >
      <div className="bg-gray-900/80 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
        <form className="space-y-5">
          <div>
            <label className="block text-gray-200 mb-1">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg text-md font-semibold transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
