import React, { useState, useEffect } from 'react';
import { LogOut, User, Users, Activity, ShieldCheck, Search, Phone, Mail, Loader2, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AdminDashboard({ adminUser, onLogout }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch registered users/members list on load
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('titanfit_token');
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (res.ok) {
        setMembers(data.users || data || []);
      } else {
        setError(data.message || 'Failed to fetch member records.');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('titanfit_token');
    localStorage.removeItem('titanfit_user');

    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
    }
  };

  // Search filter logic
  const filteredMembers = members.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phoneNumber?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header / Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black tracking-wider text-amber-500 uppercase">
            TITANFIT <span className="text-xs text-slate-400 font-medium tracking-normal">| Admin Portal</span>
          </h1>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
            <User className="w-4 h-4 text-amber-500" />
            <span className="font-semibold">{adminUser?.name || 'Administrator'}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-500/5 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Metric Cards Overview */}
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
              <p className="text-xs text-slate-400 font-medium">Active Trackers</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{members.filter(m => m.weight || m.height).length}</p>
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

        {/* Member Search & Refresh Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Member Directory</h2>
              <p className="text-xs text-slate-400">Manage user accounts and view registration details</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={fetchMembers}
                className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl cursor-pointer transition-all"
                title="Refresh Directory"
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

          {/* Members Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Member Name</th>
                  <th className="px-4 py-3">Contact Email</th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Weight / Height</th>
                  <th className="px-4 py-3 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        <span>Loading directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                      No members found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member._id || member.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                        <div className="w-7 h-7 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center font-bold text-xs">
                          {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {member.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{member.email}</span>
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
        </div>

      </main>
    </div>
  );
}