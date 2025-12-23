import { useState } from "react";
import { api } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const register = async () => {
    try {
      await api.post("/auth/register", { name, email, password });
      nav("/");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center p-4">
      <div className="bg-[#18181b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/5">
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          Join HawkinsVerse
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">UserName</label>
            <input
              className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Enter your name"
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">Email</label>
            <input
              className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">Password</label>
            <input
              className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Create a password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={register}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-red-600/20"
          >
            Create Account
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-red-500 hover:text-red-400 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
