import { useState } from "react";
import { api } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const BACKGROUND_IMAGE = "https://res.cloudinary.com/di75recky/image/upload/v1766651473/ChatGPT_Image_Dec_25_2025_02_00_14_PM_iobhpc.png";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleRegister = async () => {
    try {
      setError("");
      if (step === 1) {
        await api.post("/auth/register", { name, email, password });
        setStep(2);
      } else {
        const res = await api.post("/auth/verify-otp", { email, otp });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("name", res.data.name);
        // Force reload or event dispatch if navbar doesn't update automatically
        // But for now just navigate
        nav("/");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0b0b0f] flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="bg-[#18181b]/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          {step === 1 ? "Join HawkinsVerse" : "Verify Email"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">UserName</label>
                <input
                  className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Password</label>
                <input
                  className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Create a password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">One-Time Password</label>
              <input
                className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors tracking-widest text-center text-xl"
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
              />
              <p className="text-gray-500 text-xs mt-2 text-center">
                Enter the 6-digit code sent to {email}
              </p>
            </div>
          )}

          <button
            onClick={handleRegister}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-red-600/20"
          >
            {step === 1 ? "Create Account" : "Verify & Login"}
          </button>

          {step === 1 && (
            <>
              <div className="flex items-center justify-center my-4">
                <span className="text-gray-500 text-sm">Or get started with</span>
              </div>

              <div className="flex justify-center mb-4">
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
                      nav("/"); // Navigate to home/dashboard
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
            </>
          )}

          {step === 1 && (
            <p className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{" "}
              <Link to="/" className="text-red-500 hover:text-red-400 font-medium hover:underline">
                Login here
              </Link>
            </p>
          )}

          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="w-full text-gray-500 text-sm hover:text-white transition-colors"
            >
              Back to Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
