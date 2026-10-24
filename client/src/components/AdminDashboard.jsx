import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LogOut,
  User,
  Users,
  Activity,
  ShieldCheck,
  Search,
  Phone,
  Mail,
  Loader2,
  RefreshCw,
  ArrowLeft,
  PieChart,
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const AUTO_REFRESH_MS = 30_000;

const PLAN_COLORS = {
  'Basic Access': '#38bdf8',
  'Pro Athlete': '#f59e0b',
  'VIP Elite': '#a78bfa',
  'No Plan': '#64748b',
};

const MEMBERSHIP_PLANS = ['Basic Access', 'Pro Athlete', 'VIP Elite', 'No Plan'];

function getMemberPlan(member) {
  const rawPlan = member?.activePlan || member?.membershipPlan || member?.plan;
  if (!rawPlan) return 'No Plan';

  const normalized = String(rawPlan).trim().toLowerCase();
  if (normalized === 'basic' || normalized === 'basic access') return 'Basic Access';
  if (normalized === 'pro' || normalized === 'pro athlete') return 'Pro Athlete';
  if (normalized === 'vip' || normalized === 'vip elite') return 'VIP Elite';
  return 'No Plan';
}

function describePlanDistribution(members) {
  const counts = MEMBERSHIP_PLANS.reduce((result, plan) => {
    result[plan] = 0;
    return result;
  }, {});

  members.forEach((member) => {
    counts[getMemberPlan(member)] += 1;
  });

  return MEMBERSHIP_PLANS.map((name) => ({
    name,
    value: counts[name],
    color: PLAN_COLORS[name],
  }));
}

function createPieSlicePath(value, total, startAngle) {
  if (value <= 0 || total <= 0) return '';

  const radius = 76;
  const center = 100;
  const angle = (value / total) * Math.PI * 2;
  const endAngle = startAngle + angle;

  // A single 100% slice needs two arcs because SVG's large-arc path cannot
  // draw a complete circle using only one arc command.
  if (value === total) {
    const middleAngle = startAngle + Math.PI;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const xm = center + radius * Math.cos(middleAngle);
    const ym = center + radius * Math.sin(middleAngle);
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${xm} ${ym} A ${radius} ${radius} 0 1 1 ${x1} ${y1} Z`;
  }

  const x1 = center + radius * Math.cos(startAngle);
  const y1 = center + radius * Math.sin(startAngle);
  const x2 = center + radius * Math.cos(endAngle);
  const y2 = center + radius * Math.sin(endAngle);
  const largeArc = angle > Math.PI ? 1 : 0;

  return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function MembershipPieChart({ members }) {
  const distribution = useMemo(() => describePlanDistribution(members), [members]);
  const total = members.length;
  let currentAngle = -Math.PI / 2;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-500" />
            Membership Plan Distribution
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live breakdown of registered users by their saved membership plan.
          </p>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
          {total} registered {total === 1 ? 'user' : 'users'}
        </span>
      </div>

      {total === 0 ? (
        <div className="min-h-44 flex items-center justify-center text-center text-sm text-slate-500">
          No user data is available to chart yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <div className="flex justify-center">
            <svg
              viewBox="0 0 200 200"
              role="img"
              aria-label={`Membership plan distribution for ${total} users`}
              className="w-48 h-48 max-w-full"
            >
              {distribution.map((slice) => {
                const path = createPieSlicePath(slice.value, total, currentAngle);
                currentAngle += total > 0 ? (slice.value / total) * Math.PI * 2 : 0;

                if (!path) return null;

                return (
                  <path
                    key={slice.name}
                    d={path}
                    fill={slice.color}
                    stroke="#0f172a"
                    strokeWidth="2"
                  >
                    <title>{`${slice.name}: ${slice.value} users`}</title>
                  </path>
                );
              })}
              <circle cx="100" cy="100" r="43" fill="#0f172a" />
              <text
                x="100"
                y="96"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="24"
                fontWeight="800"
              >
                {total}
              </text>
              <text
                x="100"
                y="115"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
              >
                TOTAL USERS
              </text>
            </svg>
          </div>

          <div className="space-y-3">
            {distribution.map((slice) => {
              const percentage = total ? Math.round((slice.value / total) * 100) : 0;

              return (
                <div key={slice.name} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: slice.color }}
                      />
                      {slice.name}
                    </span>
                    <span className="text-slate-400 tabular-nums">
                      {slice.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: slice.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default function AdminDashboard({ adminUser, onLogout, onClose }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMembers = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('titanfit_token');

      if (!token || token === 'null' || token === 'undefined') {
        setError('Authorization token missing. Please log in as an Admin.');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || `Error ${res.status}: Failed to fetch member directory.`);
        return;
      }

      const userList = Array.isArray(data) ? data : data.users;
      if (!Array.isArray(userList)) {
        setError('The server response did not contain a valid users list.');
        return;
      }

      setMembers(userList);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
      setError('Unable to connect to the server. Please try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();

    const intervalId = window.setInterval(() => {
      fetchMembers({ silent: true });
    }, AUTO_REFRESH_MS);

    const handleMembershipUpdated = () => {
      fetchMembers({ silent: true });
    };

    window.addEventListener('titanfit:membership-updated', handleMembershipUpdated);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('titanfit:membership-updated', handleMembershipUpdated);
    };
  }, [fetchMembers]);

  const handleLogoutClick = () => {
    localStorage.removeItem('titanfit_token');
    localStorage.removeItem('titanfit_user');
    if (onLogout) onLogout();
  };

  const filteredMembers = members.filter((member) => {
    const search = searchTerm.toLowerCase();
    return (
      member.name?.toLowerCase().includes(search) ||
      member.email?.toLowerCase().includes(search) ||
      member.phoneNumber?.includes(searchTerm)
    );
  });

  const planDistribution = useMemo(() => describePlanDistribution(members), [members]);
  const usersWithPlan = members.filter((member) => getMemberPlan(member) !== 'No Plan').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            title="Return to main website"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Back to Site</span>
          </button>

          <h1 className="text-xl font-black tracking-wider text-amber-500 uppercase">
            TITANFIT <span className="text-xs text-slate-400 font-medium tracking-normal hidden md:inline">| Admin Portal</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
            <User className="w-4 h-4 text-amber-500" />
            <span className="font-semibold">{adminUser?.name || 'Administrator'}</span>
          </div>

          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Registered Members</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{members.length}</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs text-slate-400 font-medium">Members With a Plan</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{usersWithPlan}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs text-slate-400 font-medium">Server Health</p>
              <p className="text-2xl font-black text-sky-400 mt-1">Operational</p>
            </div>
            <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <MembershipPieChart members={members} />

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Member Directory</h2>
              <p className="text-xs text-slate-400">Manage user accounts and view registration details.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Auto-refreshes every 30 seconds
                {lastUpdated ? ` · Last updated ${lastUpdated.toLocaleTimeString()}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => fetchMembers()}
                disabled={loading}
                className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl cursor-pointer transition-all disabled:opacity-50"
                title="Refresh Directory"
                aria-label="Refresh member directory"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Member Name</th>
                  <th className="px-4 py-3">Contact Email</th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Membership Plan</th>
                  <th className="px-4 py-3">Weight / Height</th>
                  <th className="px-4 py-3 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        <span>Loading directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      No members found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member._id || member.id || member.email} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 shrink-0 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center font-bold text-xs">
                            {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          {member.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{member.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {member.phoneNumber ? (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>+91 {member.phoneNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 text-[11px]">
                          {getMemberPlan(member)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {member.weight || member.height ? (
                          <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
                            {member.weight ? `${member.weight} kg` : '-'} / {member.height ? `${member.height} cm` : '-'}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500 font-mono text-[11px]">
                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500">
            Chart distribution: {planDistribution.map((item) => `${item.name}: ${item.value}`).join(' · ')}
          </p>
        </section>
      </main>
    </div>
  );
}
