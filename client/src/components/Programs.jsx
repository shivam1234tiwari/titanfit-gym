// src/components/Programs.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Dumbbell,
  HeartPulse,
  Flame,
  UserCheck,
  Activity,
  Zap,
  Search,
  Clock,
  Users,
  ArrowUpRight,
  X,
  CheckCircle2,
  CircleAlert,
  Bookmark,
  Target,
  Sparkles,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { API_BASE_URL } from "../config";

const programs = [
  {
    id: "strength-power",
    icon: Dumbbell,
    title: "Strength & Power",
    category: "Strength",
    desc: "Build muscle, improve lifting technique, and develop full-body strength with progressive resistance training.",
    duration: "45–60 min",
    level: "Intermediate",
    calories: "300–500",
    sessions: "4 days/week",
    accent: "from-amber-500/20 to-orange-500/5",
    benefits: [
      "Build lean muscle mass",
      "Improve strength and stability",
      "Develop proper lifting technique",
    ],
    workouts: ["Squats", "Bench press", "Deadlifts", "Core training"],
  },
  {
    id: "cardio-endurance",
    icon: HeartPulse,
    title: "Cardio Endurance",
    category: "Cardio",
    desc: "Improve cardiovascular fitness and stamina with structured, progressive endurance sessions.",
    duration: "30–45 min",
    level: "Beginner",
    calories: "250–450",
    sessions: "3–5 days/week",
    accent: "from-rose-500/20 to-pink-500/5",
    benefits: [
      "Improve cardiovascular endurance",
      "Build stamina",
      "Support overall heart health",
    ],
    workouts: ["Treadmill intervals", "Cycling", "Rowing", "Cool-down walk"],
  },
  {
    id: "fat-loss-hiit",
    icon: Flame,
    title: "Fat Loss HIIT",
    category: "HIIT",
    desc: "Combine short bursts of effort with recovery intervals for efficient, challenging workouts.",
    duration: "20–30 min",
    level: "Intermediate",
    calories: "200–400",
    sessions: "2–4 days/week",
    accent: "from-orange-500/20 to-red-500/5",
    benefits: [
      "Improve conditioning",
      "Train efficiently in less time",
      "Build workout consistency",
    ],
    workouts: ["Jump squats", "Mountain climbers", "Burpees", "Recovery intervals"],
  },
  {
    id: "yoga-recovery",
    icon: Activity,
    title: "Yoga & Recovery",
    category: "Recovery",
    desc: "Improve mobility, flexibility, breathing, and recovery with guided movement and stretching.",
    duration: "30–45 min",
    level: "Beginner",
    calories: "100–200",
    sessions: "2–4 days/week",
    accent: "from-emerald-500/20 to-teal-500/5",
    benefits: [
      "Improve mobility and flexibility",
      "Support recovery between workouts",
      "Practice breathing and relaxation",
    ],
    workouts: ["Dynamic stretching", "Yoga flows", "Hip mobility", "Breathing exercises"],
  },
  {
    id: "crossfit-circuits",
    icon: Zap,
    title: "CrossFit Circuits",
    category: "Functional",
    desc: "Combine functional movements, strength exercises, and timed circuits to challenge your fitness.",
    duration: "35–50 min",
    level: "Advanced",
    calories: "300–600",
    sessions: "3–4 days/week",
    accent: "from-violet-500/20 to-purple-500/5",
    benefits: [
      "Develop functional strength",
      "Improve coordination and conditioning",
      "Build work capacity",
    ],
    workouts: ["Kettlebell swings", "Box step-ups", "Medicine ball slams", "Timed circuits"],
  },
  {
    id: "personal-coaching",
    icon: UserCheck,
    title: "1-on-1 Coaching",
    category: "Coaching",
    desc: "Get personalized exercise guidance and a training approach tailored to your fitness goals.",
    duration: "45–60 min",
    level: "All levels",
    calories: "Varies",
    sessions: "Personalized",
    accent: "from-sky-500/20 to-blue-500/5",
    benefits: [
      "Individualized training guidance",
      "Technique and form feedback",
      "Progress reviews with a trainer",
    ],
    workouts: ["Goal assessment", "Movement screening", "Personalized workout", "Progress review"],
  },
];

const categories = [
  "All",
  "Saved",
  "Strength",
  "Cardio",
  "HIIT",
  "Recovery",
  "Functional",
  "Coaching",
];

const getToken = () => localStorage.getItem("titanfit_token");

export default function Programs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [savedPrograms, setSavedPrograms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("titanfit_saved_programs") || "[]");
    } catch {
      return [];
    }
  });
  const [joiningId, setJoiningId] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "titanfit_saved_programs",
      JSON.stringify(savedPrograms)
    );
  }, [savedPrograms]);

  useEffect(() => {
    if (!selectedProgram) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedProgram(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProgram]);

  // Single Memoized Filter Logic
  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesCategory =
        category === "All"
          ? true
          : category === "Saved"
          ? savedPrograms.includes(program.id)
          : program.category === category;

      const matchesSearch =
        !query ||
        program.title.toLowerCase().includes(query) ||
        program.desc.toLowerCase().includes(query) ||
        program.category.toLowerCase().includes(query) ||
        program.level.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category, savedPrograms]);

  const toggleSaved = (programId) => {
    setSavedPrograms((current) =>
      current.includes(programId)
        ? current.filter((id) => id !== programId)
        : [...current, programId]
    );

    setNotice({
      type: "success",
      text: savedPrograms.includes(programId)
        ? "Program removed from your saved list."
        : "Program saved to your favorites.",
    });
  };

  const handleJoinProgram = async (program) => {
    const token = getToken();

    if (!token) {
      setNotice({
        type: "error",
        text: "Please log in first to join a fitness program.",
      });
      return;
    }

    setJoiningId(program.id);
    setNotice(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/programs/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          programId: program.id,
          programTitle: program.title,
          category: program.category,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to join this program right now."
        );
      }

      setNotice({
        type: "success",
        text: result.message || `You're enrolled in ${program.title}!`,
      });

      setSelectedProgram(null);
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error.message === "Failed to fetch"
            ? "Cannot connect to the server. Please check your backend."
            : error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <section
      id="programs"
      className="relative overflow-hidden bg-slate-950 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            <Sparkles className="h-4 w-4" />
            Find your next challenge
          </div>

          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-amber-500">
            TitanFit Programs
          </h2>

          <h3 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
            Train With Purpose.
            <span className="mt-2 block text-amber-500">
              Perform Beyond Limits.
            </span>
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Discover training programs designed to help you build strength,
            improve endurance, recover smarter, and work toward your fitness
            goals.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Activity, value: "06", label: "Training programs" },
            { icon: Target, value: "06", label: "Fitness approaches" },
            { icon: Users, value: "All levels", label: "Find your starting point" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and category filters */}
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search programs, goals, or difficulty..."
              aria-label="Search fitness programs"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  category === item
                    ? "border-amber-500 bg-amber-500 text-slate-950"
                    : "border-slate-700 bg-slate-950 text-slate-400 hover:border-amber-500/50 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing {filteredPrograms.length} of {programs.length} programs
            </span>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="font-semibold text-amber-500 transition hover:text-amber-400"
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Status message */}
        {notice && (
          <div
            role="status"
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
              notice.type === "error"
                ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {notice.type === "error" ? (
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <p className="flex-1">{notice.text}</p>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss message"
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Program cards */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPrograms.map((program) => {
              const Icon = program.icon;
              const isSaved = savedPrograms.includes(program.id);

              return (
                <article
                  key={program.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 transition duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-950/20"
                >
                  <div className={`absolute inset-x-0 top-0 h-36 bg-gradient-to-br ${program.accent} opacity-80`} />

                  <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                    <div className="mb-6 flex items-start justify-between gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-slate-950/80 text-amber-500 transition duration-300 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-slate-950">
                        <Icon className="h-7 w-7" />
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaved(program.id)}
                        aria-label={
                          isSaved ? "Remove saved program" : "Save program"
                        }
                        aria-pressed={isSaved}
                        className={`rounded-xl border p-2.5 transition ${
                          isSaved
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                            : "border-slate-700 bg-slate-950/60 text-slate-500 hover:border-amber-500/40 hover:text-amber-400"
                        }`}
                      >
                        <Bookmark
                          className="h-5 w-5"
                          fill={isSaved ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {program.category}
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-400">
                        {program.level}
                      </span>
                    </div>

                    <h4 className="text-xl font-extrabold text-white transition group-hover:text-amber-400">
                      {program.title}
                    </h4>

                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                      {program.desc}
                    </p>

                    <div className="my-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <Clock className="mb-2 h-4 w-4 text-amber-500" />
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Duration
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-200">
                          {program.duration}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <Flame className="mb-2 h-4 w-4 text-amber-500" />
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Est. calories
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-200">
                          {program.calories}
                        </p>
                      </div>
                    </div>

                    <div className="mb-5 flex items-center justify-between border-t border-slate-800 pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Recommended
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-300">
                          {program.sessions}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedProgram(program)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 transition hover:text-amber-300"
                      >
                        Details
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleJoinProgram(program)}
                      disabled={joiningId !== null}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {joiningId === program.id ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          Join Program
                          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
            <Search className="mx-auto h-10 w-10 text-slate-600" />
            <h4 className="mt-4 text-lg font-bold text-white">
              No programs found
            </h4>
            <p className="mt-2 text-sm text-slate-400">
              Try another search term or choose a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400"
            >
              Show all programs
            </button>
          </div>
        )}

        {/* Saved programs shortcut */}
        {savedPrograms.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-3">
              <Bookmark className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-bold text-white">Your saved programs</p>
                <p className="mt-1 text-xs text-slate-400">
                  {savedPrograms.length} program
                  {savedPrograms.length === 1 ? "" : "s"} saved on this device.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("Saved");
              }}
              className="text-sm font-bold text-amber-500 hover:text-amber-300"
            >
              View saved programs
            </button>
          </div>
        )}
      </div>

      {/* Program details modal */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProgram(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="program-modal-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40"
          >
            <div
              className={`relative overflow-hidden bg-gradient-to-br ${selectedProgram.accent} p-6 sm:p-8`}
            >
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                aria-label="Close program details"
                className="absolute right-5 top-5 rounded-xl border border-slate-700 bg-slate-950/70 p-2 text-slate-300 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-slate-950 text-amber-500">
                <selectedProgram.icon className="h-7 w-7" />
              </div>

              <span className="rounded-full border border-amber-500/30 bg-slate-950/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                {selectedProgram.category}
              </span>

              <h3
                id="program-modal-title"
                className="mt-4 pr-8 text-2xl font-black text-white sm:text-3xl"
              >
                {selectedProgram.title}
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                {selectedProgram.desc}
              </p>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["Duration", selectedProgram.duration],
                  ["Difficulty", selectedProgram.level],
                  ["Frequency", selectedProgram.sessions],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="mb-4 flex items-center gap-2 font-bold text-white">
                  <Target className="h-5 w-5 text-amber-500" />
                  Program benefits
                </h4>
                <ul className="space-y-3">
                  {selectedProgram.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-bold text-white">
                  Sample workout activities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProgram.workouts.map((workout) => (
                    <span
                      key={workout}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300"
                    >
                      {workout}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Calorie estimates vary by individual, workout intensity, and
                duration. Adjust the training plan to your fitness level and
                seek professional guidance when needed.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => toggleSaved(selectedProgram.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3.5 text-sm font-bold text-slate-200 transition hover:border-amber-500/50"
                >
                  <Bookmark
                    className="h-4 w-4"
                    fill={
                      savedPrograms.includes(selectedProgram.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                  {savedPrograms.includes(selectedProgram.id)
                    ? "Saved"
                    : "Save program"}
                </button>

                <button
                  type="button"
                  onClick={() => handleJoinProgram(selectedProgram)}
                  disabled={joiningId !== null}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
                >
                  {joiningId === selectedProgram.id ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {joiningId === selectedProgram.id
                    ? "Joining..."
                    : "Join Program"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}