
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Filter,
  LogOut,
  Mail,
  Phone,
  PieChart as PieChartIcon,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../config";

const AUTO_REFRESH_MS = 30_000;
const PAGE_SIZE = 8;

const PLAN_OPTIONS = [
  "Basic Access",
  "Pro Athlete",
  "VIP Elite",
  "No Plan",
];

const PLAN_COLORS = {
  "Basic Access": "#38bdf8",
  "Pro Athlete": "#a78bfa",
  "VIP Elite": "#f59e0b",
  "No Plan": "#64748b",
};

function getToken() {
  return localStorage.getItem("titanfit_token");
}

function getMemberPlan(member) {
  const rawPlan =
    member?.activePlan ||
    member?.membershipPlan ||
    member?.plan ||
    "";

  const plan = String(rawPlan).trim().toLowerCase();

  if (plan.includes("basic")) return "Basic Access";
  if (plan.includes("pro")) return "Pro Athlete";
  if (plan.includes("vip") || plan.includes("elite")) {
    return "VIP Elite";
  }

  return "No Plan";
}

function getMemberId(member) {
  return member?._id || member?.id || member?.email;
}

function formatDate(value, includeTime = false) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return includeTime
    ? date.toLocaleString()
    : date.toLocaleDateString();
}

function createPieSlicePath(cx, cy, radius, startAngle, endAngle) {
  const toRadians = (angle) => (angle * Math.PI) / 180;

  const x1 = cx + radius * Math.cos(toRadians(startAngle));
  const y1 = cy + radius * Math.sin(toRadians(startAngle));
  const x2 = cx + radius * Math.cos(toRadians(endAngle));
  const y2 = cy + radius * Math.sin(toRadians(endAngle));

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    "Z",
  ].join(" ");
}

function MembershipPieChart({ members }) {
  const distribution = useMemo(() => {
    const counts = {
      "Basic Access": 0,
      "Pro Athlete": 0,
      "VIP Elite": 0,
      "No Plan": 0,
    };

    members.forEach((member) => {
      counts[getMemberPlan(member)] += 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: PLAN_COLORS[name],
      percentage: members.length
        ? (value / members.length) * 100
        : 0,
    }));
  }, [members]);

  let currentAngle = -90;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Membership Analytics
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Distribution of registered members by plan
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-amber-400">
          <PieChartIcon size={20} />
        </div>
      </div>

      <div className="grid items-center gap-5 sm:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[230px]">
          <svg
            viewBox="0 0 200 200"
            className="w-full"
            role="img"
            aria-label="Pie chart of membership plan distribution"
          >
            {distribution.map((item) => {
              if (item.value === 0) return null;

              const startAngle = currentAngle;
              const endAngle =
                currentAngle + (item.value / Math.max(members.length, 1)) * 360;

              currentAngle = endAngle;

              return (
                <path
                  key={item.name}
                  d={createPieSlicePath(
                    100,
                    100,
                    82,
                    startAngle,
                    endAngle
                  )}
                  fill={item.color}
                  stroke="#0f172a"
                  strokeWidth="2"
                >
                  <title>
                    {item.name}: {item.value} members
                  </title>
                </path>
              );
            })}

            {members.length === 0 && (
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="#334155"
              />
            )}

            <circle cx="100" cy="100" r="53" fill="#0f172a" />

            <text
              x="100"
              y="94"
              fill="#ffffff"
              fontSize="25"
              fontWeight="bold"
              textAnchor="middle"
            >
              {members.length}
            </text>

            <text
              x="100"
              y="114"
              fill="#94a3b8"
              fontSize="10"
              textAnchor="middle"
            >
              TOTAL USERS
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.name}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-slate-300">
                    {item.name}
                  </span>
                </div>

                <span className="text-xs font-bold text-white">
                  {item.value}{" "}
                  <span className="font-normal text-slate-400">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-[11px] text-slate-500">
        Statistics update when fresh member data is received from the server.
      </p>
    </section>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div>
        <p className="text-xs font-medium text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-black text-white">{value}</p>
        <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
      </div>

      <div className={`rounded-xl border p-3 ${color}`}>
        <Icon size={23} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMembers = useCallback(async (manual = false) => {
    const token = getToken();

    if (!token) {
      setError("Admin authentication token is missing. Please log in again.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (manual) {
      setRefreshing(true);
    } else {
      setLoading((previous) => previous && members.length === 0);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Access denied. Your session may have expired or you may not have admin access."
        );
      }

      if (!response.ok) {
        throw new Error(`Unable to load members (HTTP ${response.status}).`);
      }

      const data = await response.json();

      const users = Array.isArray(data)
        ? data
        : Array.isArray(data.users)
          ? data.users
          : Array.isArray(data.members)
            ? data.members
            : null;

      if (!users) {
        throw new Error(
          "Unexpected API response. Expected an array of users or a users/members array."
        );
      }

      setMembers(users);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong while loading members.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [members.length]);

  useEffect(() => {
    fetchMembers();

    const interval = window.setInterval(() => {
      fetchMembers();
    }, AUTO_REFRESH_MS);

    const handleMembershipUpdate = () => {
      fetchMembers();
    };

    window.addEventListener(
      "titanfit:membership-updated",
      handleMembershipUpdate
    );

    return () => {
      window.clearInterval(interval);
      window.removeEventListener(
        "titanfit:membership-updated",
        handleMembershipUpdate
      );
    };
  }, [fetchMembers]);

  const recentSignups = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    return members.filter((member) => {
      if (!member.createdAt) return false;

      const joined = new Date(member.createdAt);

      return !Number.isNaN(joined.getTime()) && joined >= cutoff;
    }).length;
  }, [members]);

  const membersWithPlan = useMemo(
    () => members.filter((member) => getMemberPlan(member) !== "No Plan").length,
    [members]
  );

  const filteredMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = members.filter((member) => {
      const name = String(member.name || "").toLowerCase();
      const email = String(member.email || "").toLowerCase();
      const phone = String(member.phoneNumber || member.phone || "");
      const matchesSearch =
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(searchTerm.trim());

      const matchesPlan =
        planFilter === "All Plans" ||
        getMemberPlan(member) === planFilter;

      return matchesSearch && matchesPlan;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return String(a.name || "").localeCompare(String(b.name || ""));
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortBy === "plan") {
        return getMemberPlan(a).localeCompare(getMemberPlan(b));
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [members, searchTerm, planFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, planFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedMembers = filteredMembers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const exportMembersCsv = () => {
    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Membership Plan",
      "Weight (kg)",
      "Height (cm)",
      "Joined Date",
    ];

    const rows = filteredMembers.map((member) => [
      member.name,
      member.email,
      member.phoneNumber || member.phone,
      getMemberPlan(member),
      member.weight,
      member.height,
      formatDate(member.createdAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "titanfit-members.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("titanfit_token");
    localStorage.removeItem("titanfit_user");
    window.location.href = "/login";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 text-amber-400">
              <Activity size={23} />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-wide">
                TITAN<span className="text-amber-400">FIT</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Admin Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 sm:flex">
              <ShieldCheck size={14} />
              Admin
            </span>

            <button
              type="button"
              onClick={handleGoBack}
              className="flex items-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-slate-600"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/20"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Dashboard Overview
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Welcome, Admin
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Monitor your gym members and membership activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-500">Last updated</p>
              <p className="mt-1 text-xs text-slate-300">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "Waiting for data"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchMembers(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <X size={18} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">Could not update dashboard</p>
              <p className="mt-1 text-xs">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => fetchMembers(true)}
              className="text-xs font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Registered Members"
            value={loading ? "..." : members.length}
            subtitle="Total users returned by API"
            icon={Users}
            color="border-sky-500/20 bg-sky-500/10 text-sky-400"
          />

          <StatCard
            title="Members With a Plan"
            value={loading ? "..." : membersWithPlan}
            subtitle="Users assigned a membership plan"
            icon={CheckCircle2}
            color="border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          />

          <StatCard
            title="New Members (7 Days)"
            value={loading ? "..." : recentSignups}
            subtitle="Based on account creation date"
            icon={CalendarDays}
            color="border-violet-500/20 bg-violet-500/10 text-violet-400"
          />

          <StatCard
            title="Auto Refresh"
            value="30 sec"
            subtitle="Periodic API refresh enabled"
            icon={Clock}
            color="border-amber-500/20 bg-amber-500/10 text-amber-400"
          />
        </section>

        <MembershipPieChart members={members} />

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-lg font-bold text-white">
                Member Directory
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Search, filter, review, and export member records.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[190px] flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search name, email, phone..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-amber-500"
                />
              </div>

              <div className="relative">
                <Filter
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <select
                  value={planFilter}
                  onChange={(event) => setPlanFilter(event.target.value)}
                  aria-label="Filter by membership plan"
                  className="rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-8 pr-3 text-xs text-slate-200 outline-none focus:border-amber-500"
                >
                  <option value="All Plans">All Plans</option>
                  {PLAN_OPTIONS.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort members"
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-amber-500"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
                <option value="plan">Membership plan</option>
              </select>

              <button
                type="button"
                onClick={exportMembersCsv}
                disabled={filteredMembers.length === 0}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-40"
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-950/70 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Member</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Membership Plan</th>
                  <th className="px-4 py-4">Fitness Details</th>
                  <th className="px-4 py-4">Joined Date</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/80">
                {loading && members.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <RefreshCw
                        size={23}
                        className="mx-auto animate-spin text-amber-400"
                      />
                      <p className="mt-3 text-sm text-slate-400">
                        Loading members...
                      </p>
                    </td>
                  </tr>
                ) : paginatedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <Users
                        size={28}
                        className="mx-auto text-slate-600"
                      />
                      <p className="mt-3 text-sm font-semibold text-slate-300">
                        No members found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member, index) => {
                    const plan = getMemberPlan(member);

                    return (
                      <tr
                        key={getMemberId(member) || index}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-amber-400">
                              <User size={17} />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-100">
                                {member.name || "Unnamed Member"}
                              </p>
                              <p className="mt-1 text-[10px] text-slate-500">
                                ID: {String(getMemberId(member) || "N/A").slice(-12)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <Mail size={13} className="shrink-0 text-slate-500" />
                            {member.email || "N/A"}
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={13} className="shrink-0" />
                            {member.phoneNumber || member.phone || "N/A"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className="inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold"
                            style={{
                              color: PLAN_COLORS[plan],
                              borderColor: `${PLAN_COLORS[plan]}55`,
                              backgroundColor: `${PLAN_COLORS[plan]}15`,
                            }}
                          >
                            {plan}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-xs text-slate-400">
                          <p>Weight: {member.weight ? `${member.weight} kg` : "N/A"}</p>
                          <p className="mt-1">Height: {member.height ? `${member.height} cm` : "N/A"}</p>
                        </td>

                        <td className="px-4 py-4 text-xs text-slate-400">
                          {formatDate(member.createdAt)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedMember(member)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 transition hover:border-amber-500/50 hover:text-amber-300"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-[11px] text-slate-500">
              Showing{" "}
              {filteredMembers.length
                ? (safePage - 1) * PAGE_SIZE + 1
                : 0}
              {"–"}
              {Math.min(safePage * PAGE_SIZE, filteredMembers.length)}
              {" of "}
              {filteredMembers.length} matching members
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <span className="text-xs tabular-nums text-slate-400">
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-2 pb-4 text-[11px] text-slate-500 sm:flex-row">
          <p>TitanFit Admin Dashboard</p>
          <p>
            <span className="text-emerald-400">●</span>{" "}
            Refresh interval: 30 seconds
            {lastUpdated && ` · Last sync: ${lastUpdated.toLocaleTimeString()}`}
          </p>
        </footer>
      </main>

      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-detail-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMember(null);
            }
          }}
        >
          <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  Member Profile
                </p>

                <h3
                  id="member-detail-title"
                  className="mt-1 text-xl font-black text-white"
                >
                  {selectedMember.name || "Unnamed Member"}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedMember.email || "No email provided"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                aria-label="Close member profile"
                className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              {[
                ["Membership Plan", getMemberPlan(selectedMember)],
                [
                  "Phone",
                  selectedMember.phoneNumber ||
                    selectedMember.phone ||
                    "Not provided",
                ],
                [
                  "Weight",
                  selectedMember.weight
                    ? `${selectedMember.weight} kg`
                    : "Not provided",
                ],
                [
                  "Height",
                  selectedMember.height
                    ? `${selectedMember.height} cm`
                    : "Not provided",
                ],
                ["Joined", formatDate(selectedMember.createdAt, true)],
                [
                  "Account ID",
                  getMemberId(selectedMember) || "Not provided",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm text-slate-200">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-800 p-5">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-slate-950 transition hover:bg-amber-400"
              >
                Close Profile
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
