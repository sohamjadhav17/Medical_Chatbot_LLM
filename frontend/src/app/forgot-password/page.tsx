"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message || "Password reset successful");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex font-sans overflow-hidden">
      {/* Left Column */}
      <div className="relative hidden lg:flex w-1/2 flex-col items-center justify-center p-12 text-center">
        {/* Abstract subtle background shapes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[400px] h-[400px] bg-white/40 rounded-[3rem] shadow-[0_8px_32px_rgba(0,0,0,0.02)] absolute ml-[-100px] mt-[100px] transform rotate-[-2deg] backdrop-blur-sm z-0 flex items-center justify-center">
             <div className="w-[80px] h-[250px] bg-[#f8fafc]/80 absolute rounded-xl"></div>
             <div className="w-[250px] h-[80px] bg-[#f8fafc]/80 absolute rounded-xl"></div>
          </div>
          <div className="w-[150px] h-[150px] bg-white/40 rounded-full absolute ml-[-250px] mt-[-100px] shadow-[0_8px_32px_rgba(0,0,0,0.02)] z-0"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Shield Icon Container */}
          <div className="w-32 h-32 bg-[#f0f9fa]/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(14,186,227,0.15)] mb-10">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="#0ebae3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path
                d="M12 8v8M8 12h8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-[44px] font-extrabold text-[#0f172a] leading-[1.05] mb-6 tracking-tight">
            Regaining Access to Your<br />
            <span className="text-[#0ebae3] mt-1 inline-block">Sanctuary</span>
          </h1>

          <p className="text-[#64748b] font-medium leading-[1.6] text-[16px] max-w-[440px]">
            Security is the foundation of our clinical care. We'll help you
            securely reset your credentials and restore your connection to the
            MedBot AI platform.
          </p>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#f8fafc]">
        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
          <h2 className="text-[24px] font-bold text-[#0f172a] mb-2 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-[14px] text-[#64748b] font-medium mb-8 leading-relaxed">
            Enter the email associated with your account and we'll send a
            clinical-grade verification link to reset your access.
          </p>

          <form onSubmit={handleSubmit}>
            {message && (
              <div className="mb-6 rounded-xl bg-[#f0fdf4] p-4 text-[13px] font-bold text-[#166534] border border-[#dcfce7]">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-xl bg-[#fef2f2] p-4 text-[13px] font-bold text-[#991b1b] border border-[#fee2e2]">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-[11px] font-bold text-[#64748b] tracking-widest uppercase mb-2.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@healthcare.com"
                  className="w-full bg-[#f1f5f9] border-none rounded-xl py-3.5 pl-[42px] pr-4 text-[14px] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0ebae3]/40 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#14bae3] hover:bg-[#00a8d6] active:scale-[0.99] text-white font-bold rounded-xl py-3.5 flex justify-center items-center transition-all text-[15px] shadow-sm disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? "Sending..." : "Send Reset Link"}
              {!loading && (
                <svg
                  className="ml-2"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-[14px] font-bold text-[#0ebae3] hover:text-[#0096c7] transition-colors"
            >
              <svg
                className="mr-1.5"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Sign In
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[#f1f5f9] flex justify-center items-center">
            <svg
              className="text-[#cbd5e1] mr-2"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[10.5px] uppercase tracking-widest font-extrabold text-[#94a3b8]">
              HIPAA Compliant Protocol
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
