"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/");
        router.refresh(); 
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#f4f6f8]">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" className="text-[#00b4d8] fill-current">
             <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#00b4d8"/>
             <path d="M12 2L2 12L12 12L22 12L12 2Z" fill="#0096c7"/>
          </svg>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">MedBot</span>
        </div>
        <button className="px-5 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-gray-700 font-semibold rounded-lg text-sm transition-colors">
          Support
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[960px] h-[640px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex overflow-hidden">
          
          {/* Left panel */}
          <div className="w-1/2 bg-gradient-to-b from-[#defafa] to-[#bceef5] flex flex-col items-center justify-center p-12 text-center relative">
            <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,180,216,0.1)] mb-8">
              <div className="w-[84px] h-[64px] bg-[#0ebae3] rounded-xl relative flex items-center justify-center mt-3">
                {/* Briefcase Handle */}
                <div className="absolute -top-4 w-9 h-5 border-[5.5px] border-[#0ebae3] rounded-t-xl border-b-0"></div>
                {/* Cross */}
                <div className="absolute w-7 h-[7px] bg-white rounded-md"></div>
                <div className="absolute w-[7px] h-7 bg-white rounded-md"></div>
              </div>
            </div>
            <h2 className="text-[26px] font-bold text-gray-900 mb-3 tracking-tight">Your AI Health Partner</h2>
            <p className="text-gray-500 font-medium leading-relaxed text-[15px] px-8">
              Access secure medical consultations and personalized health insights powered by advanced AI.
            </p>
          </div>

          {/* Right panel */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-[32px] font-extrabold text-gray-900 mb-2 tracking-tight">Sign In</h1>
              <p className="text-gray-500 font-medium text-[15px]">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all"
                  placeholder="name@hospital.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-gray-800">Password</label>
                  <Link href="/forgot-password" className="text-sm font-bold text-[#00b4d8] hover:text-[#0096c7] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all pr-12 font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-1 pb-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-[18px] h-[18px] text-[#00b4d8] border-gray-300 rounded focus:ring-[#00b4d8] transition-all cursor-pointer accent-[#00b4d8]"
                />
                <label htmlFor="remember" className="ml-2.5 block text-[15px] font-medium text-gray-500 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#14bae3] hover:bg-[#00a8d6] text-white font-bold rounded-xl px-4 py-4 flex items-center justify-center transition-all active:scale-[0.99] text-[15px]"
              >
                {loading ? "Signing in..." : (
                  <>
                    Sign In to MedBot <LogIn size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-[15px] font-medium">
              <span className="text-gray-500">Don't have an account? </span>
              <Link href="/register" className="font-bold text-[#00b4d8] hover:text-[#0096c7] transition-colors">Create an account</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 pt-4 text-center text-[13px] font-medium text-gray-400 bg-[#f4f6f8]">

        <div className="flex gap-4 justify-center mt-2.5">
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Security</a>
        </div>
      </footer>
    </div>
  );
}

