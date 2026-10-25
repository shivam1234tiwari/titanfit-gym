import React, { useState, useEffect } from 'react';
import { UserCheck, MessageSquare, Send, Star, Clock } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function TrainerBooking() {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trainers`);
      const data = await res.json();
      if (data.success) setTrainers(data.trainers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (trainerId) => {
    const token = localStorage.getItem('titanfit_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/trainers/messages/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenChat = (trainer) => {
    setSelectedTrainer(trainer);
    fetchMessages(trainer._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTrainer) return;

    const token = localStorage.getItem('titanfit_token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/trainers/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ trainerId: selectedTrainer._id, text: newMessage })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <UserCheck className="w-7 h-7 text-amber-500" />
        <h2 className="text-xl font-bold">Personal Trainer Booking & Direct Messaging</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trainer List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase text-amber-500 tracking-wider">Available Certified Trainers</h3>
          {trainers.map((t) => (
            <div key={t._id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                <p className="text-xs text-amber-400 font-medium">{t.specialization}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {t.rating}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {t.experienceYears} Years Exp.</span>
                </div>
              </div>
              <button
                onClick={() => handleOpenChat(t)}
                className="bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 p-2.5 rounded-xl transition-all"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Chat Drawer */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col h-80 justify-between">
          {selectedTrainer ? (
            <>
              <div className="border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-amber-500">Chat with {selectedTrainer.name}</h4>
              </div>
              <div className="overflow-y-auto space-y-2 py-2 flex-1 text-xs">
                {messages.map((m, i) => (
                  <div key={i} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-200">
                    {m.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <button type="submit" className="bg-amber-500 text-slate-950 px-3 py-2 rounded-lg font-bold">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-500">
              Select a trainer to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}