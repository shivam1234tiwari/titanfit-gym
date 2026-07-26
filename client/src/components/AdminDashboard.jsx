import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  MessageSquare,
  RefreshCw,
  Dumbbell,
  CheckCircle2,
  Clock,
  Send,
  X,
  Check,
  UserCheck,
  ShieldAlert,
  Award
} from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AdminDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal State for replying to Message / Booking Request
  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    type: '', // 'booking' or 'contact'
    item: null,
    text: ''
  });

  // Fetch Live Data based on Active Tab
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'bookings') {
        const res = await fetch(`${API_BASE_URL}/api/bookings`);
        const json = await res.json();
        if (json.success) setBookings(json.data);
      } else if (activeTab === 'messages') {
        const res = await fetch(`${API_BASE_URL}/api/contact`);
        const json = await res.json();
        if (json.success) setMessages(json.data);
      } else if (activeTab === 'members') {
        const res = await fetch(`${API_BASE_URL}/api/auth/members`);
        const json = await res.json();
        if (json.success) setMembers(json.data);
      }
    } catch (err) {
      setError('Server se connect nahi ho paya. Backend service check karein.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // 🔄 Handle Booking Status Change (Confirmed / Cancelled / Pending)
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (data.success) {
        setBookings((prevBookings) =>
          prevBookings.map((item) =>
            item._id === bookingId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        alert('Status update error: ' + data.message);
      }
    } catch (err) {
      alert('Server error: Status update nahi ho paaya.');
    }
  };

  // 👥 Handle Member Plan / Trainer Update
  const handleMemberUpdate = async (memberId, field, value) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });

      const data = await res.json();

      if (data.success) {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member._id === memberId ? { ...member, [field]: value } : member
          )
        );
      } else {
        alert('Member update failed: ' + data.message);
      }
    } catch (err) {
      alert('Server error: Member update nahi ho paya.');
    }
  };

  // ✉️ Submit Admin Reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    const { type, item, text } = replyModal;

    try {
      const endpoint =
        type === 'booking'
          ? `${API_BASE_URL}/api/bookings/${item._id}`
          : `${API_BASE_URL}/api/contact/${item._id}`;

      const payload =
        type === 'booking'
          ? { adminReply: text, status: 'Confirmed' }
          : { replyMessage: text };

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setReplyModal({ isOpen: false, type: '', item: null, text: '' });
        fetchData();
      } else {
        alert('Reply error: ' + data.message);
      }
    } catch (err) {
      alert('Server error: Reply send nahi hua.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-amber-500" />
              TITANFIT Management Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Trial requests confirm karein, member plans & personal trainers manage karein aur user queries ka reply dein.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/10"
            >
              Back To Website
            </button>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              <p className="text-3xl font-black text-white mt-1">{bookings.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/20">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Members</p>
              <p className="text-3xl font-black text-amber-500 mt-1">{members.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmed Trials</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">
                {bookings.filter(b => b.status === 'Confirmed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Enquiries</p>
              <p className="text-3xl font-black text-purple-400 mt-1">{messages.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Trial & Plan Requests ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Member Management ({members.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            User Messages & Enquiries ({messages.length})
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {/* TAB 1: BOOKINGS & REQUESTS */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                {loading ? 'Bookings load ho rahi hain...' : 'Koi trial booking request nahi aayi hai.'}
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse min-w-[850px]">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Plan & Goal</th>
                    <th className="p-4">Slot Date & Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Admin Reply / Note</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {bookings.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{item.fullName}</div>
                        <div className="text-xs text-slate-400">{item.email}</div>
                        <div className="text-xs text-amber-500/90 font-mono">{item.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-semibold block w-fit mb-1">
                          {item.plan}
                        </span>
                        <span className="text-xs text-slate-400">{item.fitnessGoal}</span>
                      </td>
                      <td className="p-4 text-xs">
                        <div className="text-white font-medium">{new Date(item.preferredDate).toLocaleDateString('en-IN')}</div>
                        <div className="text-slate-400">{item.preferredTime}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={item.status || 'Pending'}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                            item.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : item.status === 'Cancelled'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          <option value="Pending" className="bg-slate-900 text-white">⏳ Pending</option>
                          <option value="Confirmed" className="bg-slate-900 text-white">✅ Confirmed</option>
                          <option value="Cancelled" className="bg-slate-900 text-white">❌ Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs">
                        {item.adminReply ? (
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 max-w-xs">
                            <span className="text-[10px] text-amber-500 font-bold uppercase block mb-0.5">Note:</span>
                            {item.adminReply}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No note added</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setReplyModal({ isOpen: true, type: 'booking', item, text: item.adminReply || '' })}
                          className="bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold px-3 py-2 rounded-lg border border-slate-700 transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Reply / Note
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: MEMBER MANAGEMENT */}
        {activeTab === 'members' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
            {members.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                {loading ? 'Members list load ho rahi hai...' : 'Koi registered member nahi mila.'}
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse min-w-[850px]">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Member Info</th>
                    <th className="p-4">Active Membership Plan</th>
                    <th className="p-4">Assigned Personal Trainer</th>
                    <th className="p-4">Body Stats & Goal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {members.map((member) => (
                    <tr key={member._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>{member.name}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{member.email}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={member.activePlan || 'Free Trial'}
                          onChange={(e) => handleMemberUpdate(member._id, 'activePlan', e.target.value)}
                          className="bg-slate-950 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                        >
                          <option value="Free Trial">Free Trial</option>
                          <option value="Basic Access">Basic Access (₹1,499)</option>
                          <option value="Pro Athlete">Pro Athlete (₹2,999)</option>
                          <option value="VIP Elite">VIP Elite (₹4,999)</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <select
                          value={member.assignedTrainer || 'Marcus Vance'}
                          onChange={(e) => handleMemberUpdate(member._id, 'assignedTrainer', e.target.value)}
                          className="bg-slate-950 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                        >
                          <option value="Marcus Vance">Marcus Vance (Strength)</option>
                          <option value="Elena Rostova">Elena Rostova (HIIT)</option>
                          <option value="David Miller">David Miller (Bodybuilding)</option>
                          <option value="Sophia Chen">Sophia Chen (Pilates)</option>
                          <option value="Aaliyah Khan">Aaliyah Khan (Boxing)</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs">
                        <div className="text-slate-300">
                          Weight: <span className="text-white font-bold">{member.weightKg || 70} kg</span> | Height: <span className="text-white font-bold">{member.heightCm || 175} cm</span>
                        </div>
                        <div className="text-amber-400 font-semibold mt-1 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>Goal: {member.fitnessGoal || 'General Fitness'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: USER MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                {loading ? 'Messages load ho rahe hain...' : 'Koi user query nahi mili.'}
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse min-w-[750px]">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Sender</th>
                    <th className="p-4">User Message</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Admin Response</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {messages.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.email}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(item.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="p-4 max-w-xs text-xs text-slate-200 leading-relaxed">
                        "{item.message}"
                      </td>
                      <td className="p-4">
                        {item.status === 'Replied' ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Replied
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            New
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs">
                        {item.replyMessage ? (
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 max-w-xs">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-0.5">Response:</span>
                            {item.replyMessage}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Pending response</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setReplyModal({ isOpen: true, type: 'contact', item, text: item.replyMessage || '' })}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Send Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

      {/* REPLY MODAL */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl">
            <button
              onClick={() => setReplyModal({ isOpen: false, type: '', item: null, text: '' })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              Response for {replyModal.item?.fullName || replyModal.item?.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Email: <span className="text-amber-500 font-mono">{replyModal.item?.email}</span>
            </p>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Note / Message</label>
                <textarea
                  rows="5"
                  required
                  value={replyModal.text}
                  onChange={(e) => setReplyModal({ ...replyModal, text: e.target.value })}
                  placeholder="Type response or slot details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-500 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReplyModal({ isOpen: false, type: '', item: null, text: '' })}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}