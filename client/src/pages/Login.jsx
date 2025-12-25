import { useState } from "react";
import { api } from "../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const location = useLocation();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      nav(redirect || "/characters");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center p-4">
      <div className="bg-[#18181b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/5">
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
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
              placeholder="Enter your password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={login}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-red-600/20"
          >
            Sign In
          </button>

          <div className="flex items-center justify-center my-4">
            <span className="text-gray-500 text-sm">Or continue with</span>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  if (!credentialResponse.credential) {
                    setError("Google authentication failed");
                    return;
                  }

                  const res = await api.post("/auth/google", {
                    token: credentialResponse.credential,
                  });
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("userId", res.data.userId);
                  localStorage.setItem("name", res.data.name);

                  const params = new URLSearchParams(location.search);
                  const redirect = params.get("redirect");
                  nav(redirect || "/characters");
                } catch (err) {
                  setError("Google Login Failed");
                }
              }}
              onError={() => {
                setError("Google Login Failed");
              }}
              theme="filled_black"
              shape="pill"
              width="100%"
            />
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-500 hover:text-red-400 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
