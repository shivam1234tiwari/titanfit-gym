import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Camera,
  Utensils,
  Activity,
  Save,
  Loader2,
  CheckCircle,
  Target,
  Scale,
  Ruler,
  ArrowLeft,
  Check,
  Crown,
  RefreshCw,
  Bookmark,
  Award,
  ArrowRight,
  Trash2,
} from "lucide-react";

import { API_BASE_URL } from "../config";
import WorkoutTracker from "./WorkoutTracker";

const MEMBERSHIP_PLANS = [
  {
    id: "basic",
    name: "Basic Access",
    price: "1,499",
    features: [
      "Gym floor & equipment access",
      "Locker room & shower access",
      "1 complimentary body composition analysis",
      "Free high-speed Wi-Fi",
    ],
  },
  {
    id: "pro",
    name: "Pro Athlete",
    price: "2,999",
    features: [
      "Full gym access across all time slots",
      "Unlimited Zumba, Yoga & HIIT classes",
      "2 guest passes per month",
      "Steam & sauna access",
      "1 personal trainer guidance session per month",
    ],
  },
  {
    id: "vip",
    name: "VIP Elite",
    price: "4,999",
    features: [
      "24/7 unlimited gym & facility access",
      "4 personal training sessions per month",
      "Customized Indian diet & nutrition plan",
      "Unlimited guest passes",
      "Dedicated locker & complimentary towel service",
    ],
  },
];

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("titanfit_user") || "{}");
  } catch {
    return {};
  }
};

const getActivePlanName = (user = {}) =>
  user.activePlan || user.membershipPlan || "";

export default function UserProfile({ onClose, onLogout }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    weight: "",
    height: "",
    goal: "Maintenance",
    profilePic: "",
    activePlan: "",
    membershipPlan: "",
    assignedTrainer: null,
  });

  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [savedPrograms, setSavedPrograms] = useState([]);

  // Load saved programs from LocalStorage
  const loadSavedPrograms = useCallback(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("titanfit_saved_programs") || "[]"
      );
      setSavedPrograms(saved);
    } catch {
      setSavedPrograms([]);
    }
  }, []);

  const removeSavedProgram = (id) => {
    const updated = savedPrograms.filter((pId) => pId !== id);
    setSavedPrograms(updated);
    localStorage.setItem("titanfit_saved_programs", JSON.stringify(updated));
  };

  const applyUser = useCallback((user, nextDietPlan) => {
    setProfile((previous) => ({
      ...previous,
      name: user.name ?? previous.name ?? "",
      email: user.email ?? previous.email ?? "",
      phoneNumber: user.phoneNumber ?? previous.phoneNumber ?? "",
      weight: user.weight ?? previous.weight ?? "",
      height: user.height ?? previous.height ?? "",
      goal: user.goal ?? previous.goal ?? "Maintenance",
      profilePic: user.profilePic ?? previous.profilePic ?? "",
      activePlan:
        getActivePlanName(user) || getActivePlanName(previous),
      membershipPlan:
        user.membershipPlan ||
        user.activePlan ||
        previous.membershipPlan ||
        previous.activePlan ||
        "",
      assignedTrainer: user.assignedTrainer || previous.assignedTrainer || null,
    }));

    if (nextDietPlan !== undefined) {
      setDietPlan(nextDietPlan);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("titanfit_token");

      if (!token) {
        setMsg({
          type: "error",
          text: "Please log in to view your profile.",
        });
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.user) {
        setMsg({
          type: "error",
          text: data.message || "Failed to fetch profile.",
        });
        return;
      }

      const savedUser = getSavedUser();

      const user = {
        ...savedUser,
        ...data.user,
        activePlan:
          getActivePlanName(data.user) ||
          getActivePlanName(savedUser),
        membershipPlan:
          data.user.membershipPlan ||
          data.user.activePlan ||
          savedUser.membershipPlan ||
          savedUser.activePlan ||
          "",
      };

      applyUser(user, data.dietPlan ?? null);

      localStorage.setItem("titanfit_user", JSON.stringify(user));

      setMsg({ type: "", text: "" });
    } catch (error) {
      console.error("Profile fetch error:", error);

      const savedUser = getSavedUser();

      if (Object.keys(savedUser).length) {
        applyUser(savedUser);
      }

      setMsg({
        type: "error",
        text: "Could not connect to the server. Showing saved profile data if available.",
      });
    } finally {
      setLoading(false);
    }
  }, [applyUser]);

  useEffect(() => {
    fetchProfile();
    loadSavedPrograms();

    const handleMembershipUpdated = (event) => {
      const planName =
        event?.detail?.plan ||
        event?.detail?.activePlan ||
        event?.detail?.membershipPlan;

      if (!planName) return;

      setProfile((previous) => ({
        ...previous,
        activePlan: planName,
        membershipPlan: planName,
      }));

      const savedUser = getSavedUser();

      localStorage.setItem(
        "titanfit_user",
        JSON.stringify({
          ...savedUser,
          activePlan: planName,
          membershipPlan: planName,
        })
      );

      setMsg({
        type: "success",
        text: `${planName} membership updated in your profile.`,
      });
    };

    const handleStorage = (event) => {
      if (event.key === "titanfit_saved_programs") {
        loadSavedPrograms();
      }

      if (event.key !== "titanfit_user" || !event.newValue) {
        return;
      }

      try {
        const user = JSON.parse(event.newValue);
        const planName = getActivePlanName(user);

        if (planName) {
          setProfile((previous) => ({
            ...previous,
            activePlan: planName,
            membershipPlan: planName,
          }));
        }
      } catch {
        // Ignore malformed storage data.
      }
    };

    window.addEventListener(
      "titanfit:membership-updated",
      handleMembershipUpdated
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "titanfit:membership-updated",
        handleMembershipUpdated
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchProfile, loadSavedPrograms]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMsg({
        type: "error",
        text: "Please choose an image file.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({
        type: "error",
        text: "Image file size must be less than 5MB.",
      });

      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    setUploading(true);
    setMsg({ type: "", text: "" });

    try {
      const token = localStorage.getItem("titanfit_token");

      if (!token) {
        throw new Error(
          "Please log in before uploading a profile picture."
        );
      }

      const res = await fetch(
        `${API_BASE_URL}/api/auth/upload-avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.profilePic) {
        throw new Error(data.message || "Image upload failed.");
      }

      const imageUrl = data.profilePic.startsWith("http")
        ? data.profilePic
        : `${API_BASE_URL}${data.profilePic}`;

      setProfile((previous) => ({
        ...previous,
        profilePic: imageUrl,
      }));

      const savedUser = getSavedUser();

      localStorage.setItem(
        "titanfit_user",
        JSON.stringify({
          ...savedUser,
          profilePic: imageUrl,
        })
      );

      setMsg({
        type: "success",
        text: "Profile picture uploaded successfully.",
      });
    } catch (error) {
      setMsg({
        type: "error",
        text: error.message || "Error uploading image.",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      const token = localStorage.getItem("titanfit_token");

      if (!token) {
        throw new Error("Please log in to save your profile.");
      }

      const payload = {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        weight: profile.weight,
        height: profile.height,
        goal: profile.goal,
        profilePic: profile.profilePic,
        activePlan: profile.activePlan,
        membershipPlan:
          profile.membershipPlan || profile.activePlan,
      };

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Profile update failed.");
      }

      const savedUser = {
        ...getSavedUser(),
        ...(data.user || {}),
        ...payload,
        email: data.user?.email || profile.email,
      };

      applyUser(savedUser, data.dietPlan ?? dietPlan);

      localStorage.setItem(
        "titanfit_user",
        JSON.stringify(savedUser)
      );

      setMsg({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (error) {
      setMsg({
        type: "error",
        text:
          error.message ||
          "Server connection error. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateBMI = () => {
    const weight = Number.parseFloat(profile.weight);
    const height = Number.parseFloat(profile.height) / 100;

    if (!weight || !height || weight <= 0 || height <= 0) {
      return null;
    }

    const bmi = (weight / (height * height)).toFixed(1);
    const value = Number(bmi);

    let category = "Normal";

    if (value < 18.5) category = "Underweight";
    else if (value >= 25) category = "Overweight";

    return { bmi, category };
  };

  const bmiData = calculateBMI();

  const activePlanName =
    profile.activePlan || profile.membershipPlan;

  const activePlan = MEMBERSHIP_PLANS.find(
    (plan) => plan.name === activePlanName
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-3 text-sm">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-amber-500 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            Back to Home
          </button>

          <button
            type="button"
            onClick={fetchProfile}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-amber-500 px-3 py-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Profile header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-amber-500/40 overflow-hidden flex items-center justify-center">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-slate-500" />
              )}

              {uploading && (
                <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center rounded-full">
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                </div>
              )}
            </div>

            <label
              title="Upload new profile picture"
              className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-400 p-2 rounded-full text-slate-950 cursor-pointer"
            >
              <Camera className="w-4 h-4" />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              {profile.name || "Member Profile"}
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              {profile.email}
              {profile.phoneNumber ? ` • +91 ${profile.phoneNumber}` : ""}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-semibold">
                Goal: {profile.goal}
              </span>

              {bmiData && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-semibold">
                  BMI: {bmiData.bmi} ({bmiData.category})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Success and error messages */}
        {msg.text && (
          <div
            role="status"
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
            }`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Membership section */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Crown className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white">
                My Membership
              </h2>

              <p className="text-xs text-slate-400">
                Your current TitanFit membership plan
              </p>
            </div>
          </div>

          {activePlan ? (
            <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                    Active plan
                  </span>

                  <h3 className="text-xl font-black text-white mt-1">
                    {activePlan.name}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-2xl font-black text-amber-400">
                    ₹{activePlan.price}
                  </p>

                  <p className="text-xs text-slate-400">per month</p>
                </div>
              </div>

              <ul className="grid sm:grid-cols-2 gap-3">
                {activePlan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-center">
              <p className="text-sm font-semibold text-white">
                No active membership
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Choose a plan from the Membership Plans section to see it here.
              </p>
            </div>
          )}
        </section>

        {/* Saved Programs & Assigned Trainer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saved Programs Card */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Saved Programs
                    </h2>
                    <p className="text-xs text-slate-400">
                      Your bookmarked workouts
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {savedPrograms.length} Saved
                </span>
              </div>

              {savedPrograms.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 p-5 text-center my-2">
                  <p className="text-xs text-slate-400">
                    No programs bookmarked yet.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 text-xs font-bold text-amber-500 hover:underline"
                  >
                    Browse Programs →
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {savedPrograms.map((programId) => (
                    <div
                      key={programId}
                      className="flex items-center justify-between bg-slate-950 border border-slate-800/80 rounded-xl p-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-white capitalize">
                          {programId.replace(/-/g, " ")}
                        </p>
                        <span className="text-[10px] text-amber-500 font-medium">
                          Bookmarked
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSavedProgram(programId)}
                        title="Remove program"
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Assigned Trainer Card */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Assigned Personal Trainer
                  </h2>
                  <p className="text-xs text-slate-400">
                    Dedicated coach assigned by Admin
                  </p>
                </div>
              </div>

              {profile.assignedTrainer ? (
                <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <img
                    src={profile.assignedTrainer.image}
                    alt={profile.assignedTrainer.name}
                    className="w-14 h-14 rounded-xl object-cover border border-amber-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {profile.assignedTrainer.name}
                    </h3>
                    <p className="text-xs text-amber-500 font-medium">
                      {profile.assignedTrainer.role}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Exp: {profile.assignedTrainer.experienceYears} Years
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-5 text-center my-2">
                  <p className="text-xs text-slate-400">
                    No dedicated trainer assigned yet.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Contact TitanFit desk to get a personal coach.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Edit profile and diet plan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit Fitness Profile */}
          <section className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Edit Fitness Profile
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="profilePic"
                  className="text-slate-400 block mb-1"
                >
                  Image URL (optional)
                </label>

                <input
                  id="profilePic"
                  type="url"
                  name="profilePic"
                  value={profile.profilePic}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="text-slate-400 block mb-1"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="goal"
                  className="text-slate-400 block mb-1"
                >
                  Fitness Goal
                </label>

                <div className="relative">
                  <Target className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />

                  <select
                    id="goal"
                    name="goal"
                    value={profile.goal}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="weight"
                    className="text-slate-400 block mb-1"
                  >
                    Weight (kg)
                  </label>

                  <div className="relative">
                    <Scale className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />

                    <input
                      id="weight"
                      type="number"
                      min="1"
                      max="500"
                      step="0.1"
                      name="weight"
                      value={profile.weight}
                      onChange={handleChange}
                      placeholder="75"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="height"
                    className="text-slate-400 block mb-1"
                  >
                    Height (cm)
                  </label>

                  <div className="relative">
                    <Ruler className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />

                    <input
                      id="height"
                      type="number"
                      min="30"
                      max="300"
                      step="0.1"
                      name="height"
                      value={profile.height}
                      onChange={handleChange}
                      placeholder="175"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}

                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </form>
          </section>

          {/* Personalized Diet Plan */}
          <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-500" />
                  Personalized Diet Plan
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  Target recommendations for{" "}
                  <span className="text-amber-400 font-semibold">
                    {profile.goal}
                  </span>
                </p>
              </div>

              {dietPlan && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Daily intake target
                  </span>

                  <span className="text-xs font-mono font-bold text-amber-500">
                    {dietPlan.calories}
                  </span>
                </div>
              )}
            </div>

            {dietPlan ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Protein
                    </p>

                    <p className="text-sm font-bold text-emerald-400 mt-1">
                      {dietPlan.macros?.protein || "30%"}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Carbs
                    </p>

                    <p className="text-sm font-bold text-sky-400 mt-1">
                      {dietPlan.macros?.carbs || "40%"}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Fats
                    </p>

                    <p className="text-sm font-bold text-amber-400 mt-1">
                      {dietPlan.macros?.fats || "30%"}
                    </p>
                  </div>
                </div>

                {[
                  ["🌅 Breakfast", dietPlan.breakfast],
                  ["☀️ Lunch", dietPlan.lunch],
                  ["🍎 Afternoon Snack", dietPlan.snack],
                  ["🌙 Dinner", dietPlan.dinner],
                ].map(([label, meal]) => (
                  <div
                    key={label}
                    className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80"
                  >
                    <span className="text-amber-500 font-bold block mb-1">
                      {label}
                    </span>

                    <p className="text-slate-300">
                      {meal || "No recommendation provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Your personalized diet plan is not available yet. Update your
                fitness profile and refresh after the backend generates the
                plan.
              </p>
            )}
          </section>
        </div>

        {/* Workout Tracker */}
        <section
          id="workout-tracker"
          className="mt-10 border-t border-slate-800 pt-8"
        >
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
              <Activity className="w-6 h-6 text-amber-500" />
              Workout Tracker
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Track your workouts and monitor your fitness progress.
            </p>
          </div>

          <WorkoutTracker />
        </section>
      </div>
    </div>
  );
}