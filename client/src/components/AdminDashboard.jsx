import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  MessageSquare,
  RefreshCw,
  Dumbbell,
  CreditCard,
  CheckCircle2,
  Clock,
  Send,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal State for replying to Message / Request
  const [replyModal, setReplyModal] = useState({
    isOpen: false,
    type: '', // 'booking' or 'contact'
    item: null,
    text: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'bookings') {
        const res = await fetch('http://localhost:5000/api/bookings');
        const json = await res.json();
        if (json.success) setBookings(json.data);
      } else if (activeTab === 'messages') {
        const res = await fetch('http://localhost:5000/api/contact');
        const json = await res.json();
        if (json.success) setMessages(json.data);
      }
    } catch (err) {
      setError('Server se connect nahi ho paya. Backend status check karein.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Handle Booking Status Change (Confirmed / Cancelled / Pending)
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Status update nahi ho paaya.');
    }
  };

  // Submit Reply (Message / Booking)
  const handleSendReply = async (e) => {
    e.preventDefault();
    const { type, item, text } = replyModal;

    try {
      let endpoint = type === 'booking' 
        ? `http://localhost:5000/api/bookings/${item._id}` 
        : `http://localhost:5000/api/contact/${item._id}`;

      let payload = type === 'booking' 
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
      }
    } catch (err) {
      alert('Reply send nahi ho paaya.');
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
              TITANFIT Interactive Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Trial requests confirm karein, user queries ka reply dein aur status manage karein.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              Back To Website
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
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

        {/* 1. BOOKINGS & REQUESTS TAB */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Koi trial booking request nahi aayi hai.</div>
            ) : (
              <table className="w-full text-left text-sm border-collapse min-w-[850px]">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Plan & Goal</th>
                    <th className="p-4">Slot Date & Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Admin Note / Reply</th>
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
                          <option value="Pending">⏳ Pending</option>
                          <option value="Confirmed">✅ Confirmed</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs">
                        {item.adminReply ? (
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 max-w-xs">
                            <span className="text-[10px] text-amber-500 font-bold uppercase block mb-0.5">Replied:</span>
                            {item.adminReply}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No reply sent</span>
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

        {/* 2. MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Koi query ya message nahi aaya hai.</div>
            ) : (
              <table className="w-full text-left text-sm border-collapse min-w-[750px]">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Sender</th>
                    <th className="p-4">User Query / Message</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Admin Reply</th>
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
                            New Query
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs">
                        {item.replyMessage ? (
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 max-w-xs">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-0.5">Sent Reply:</span>
                            {item.replyMessage}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Pending reply</span>
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

      {/* REASON / REPLY MODAL POPUP */}
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
              Send Reply to {replyModal.item?.fullName || replyModal.item?.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Recipient Email: <span className="text-amber-500 font-mono">{replyModal.item?.email}</span>
            </p>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Response / Message</label>
                <textarea
                  rows="5"
                  required
                  value={replyModal.text}
                  onChange={(e) => setReplyModal({ ...replyModal, text: e.target.value })}
                  placeholder="Type your official response or confirmation details here..."
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
                  Save & Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}