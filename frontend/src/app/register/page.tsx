"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, History, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "An error occurred during registration.");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-900 flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#f4f6f8] w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" className="text-[#00b4d8] fill-current">
             <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#00b4d8"/>
             <path d="M12 2L2 12L12 12L22 12L12 2Z" fill="#0096c7"/>
          </svg>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">MedBot</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500 hidden sm:inline">Already have an account?</span>
          <Link href="/login" className="px-5 py-2.5 bg-[#def5f9] hover:bg-[#cbeff5] text-[#00b4d8] font-bold rounded-lg text-sm transition-colors cursor-pointer">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[500px]">
          
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-[36px] font-extrabold text-gray-900 mb-3 tracking-tight">Create your account</h1>
            <p className="text-gray-500 font-medium text-[16px] leading-relaxed">
              Join our medical chatbot platform today for personalized healthcare assistance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-200 bg-white rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all font-medium"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-gray-200 bg-white rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full border border-gray-200 bg-white rounded-xl pl-12 pr-12 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all font-medium"
                  placeholder="Create a password"
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

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <History size={20} className="transform -scale-x-100" /> {/* Flip it to look like a repeat/refresh lock */}
                </div>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full border border-gray-200 bg-white rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all font-medium"
                  placeholder="Repeat your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-start pt-2 pb-2">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-[18px] h-[18px] text-[#00b4d8] border-gray-300 rounded focus:ring-[#00b4d8] transition-all cursor-pointer accent-[#00b4d8]"
                />
              </div>
              <label htmlFor="terms" className="ml-2.5 block text-[15px] font-medium text-gray-500 cursor-pointer">
                I agree to the <a href="#" className="text-[#00b4d8] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#00b4d8] font-bold hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#14bae3] hover:bg-[#00a8d6] text-white font-bold rounded-xl px-4 py-4 flex items-center justify-center transition-all active:scale-[0.99] text-[15.5px]"
            >
              {loading ? "Creating..." : (
                <>
                  Create Account <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 pt-12 text-center text-[13px] font-medium text-gray-400 bg-[#f4f6f8]">
        
      </footer>
    </div>
  );
}
