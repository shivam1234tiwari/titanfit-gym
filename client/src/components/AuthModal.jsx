import React, { useState, useEffect } from "react";
import { X, Lock, Mail, User, Phone, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    weight: "",
    height: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setErrorMsg("");
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        weight: "",
        height: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Filter Phone Number input to allow ONLY digits up to 10 characters
    if (name === "phoneNumber") {
      const numericVal = value.replace(/\D/g, "");
      if (numericVal.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: numericVal }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Password validation (6 - 16 characters)
    if (formData.password.length < 6 || formData.password.length > 16) {
      setErrorMsg("Password must be between 6 and 16 characters");
      return;
    }

    // Phone validation on sign up
    if (isSignUp) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        setErrorMsg(
          "Please enter a valid 10-digit mobile number starting with 6-9",
        );
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");

    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("titanfit_token", data.token);
        localStorage.setItem("titanfit_user", JSON.stringify(data.user));
        if (onAuthSuccess) onAuthSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.message || "Authentication failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-wider text-amber-500 uppercase">
            TITANFIT
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp
              ? "Create your member account to start tracking progress."
              : "Welcome back! Log in to your portal."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isSignUp
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isSignUp
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field (Signup Only) */}
          {isSignUp && (
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Email Address */}
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Phone Number Field (Signup Only) */}
          {isSignUp && (
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <span className="absolute left-10 text-xs text-slate-400 font-semibold">
                +91
              </span>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-18 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Password Input Field */}
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              maxLength={16}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (6-16 characters)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Weight & Height Fields (Signup Only) */}
          {isSignUp && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight (kg)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height (cm)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignUp ? "Create Account" : "Log In"}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase font-bold absolute">
            OR
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
