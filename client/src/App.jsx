import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import MembershipPlans from './components/MembershipPlans';
import Trainers from './components/Trainers';
import Gallery from './components/Gallery';
import ContactForm from './components/ContactForm';
import FreeTrialModal from './components/FreeTrialModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import AIChatbot from './components/AIChatbot';
import { ShieldAlert, Lock, X } from 'lucide-react';

const GOOGLE_CLIENT_ID = "884662759151-8qlh4ot9b8h9r4bmoqfn0mj8crgs7mfn.apps.googleusercontent.com";

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isProfileView, setIsProfileView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const [showAdminPassModal, setShowAdminPassModal] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [accessDeniedMsg, setAccessDeniedMsg] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('titanfit_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleOpenBooking = (planName = 'Free Trial') => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('titanfit_token');
    localStorage.removeItem('titanfit_user');
    setCurrentUser(null);
    setIsProfileView(false);
  };

  const handlePlanUpdated = (updatedPlanName) => {
    if (currentUser) {
      const updated = { ...currentUser, activePlan: updatedPlanName };
      setCurrentUser(updated);
      localStorage.setItem('titanfit_user', JSON.stringify(updated));
    }
  };

  const handleAdminAccessClick = () => {
    setAccessDeniedMsg(null);
    setAdminPassInput('');

    if (currentUser && currentUser.role !== 'admin') {
      setAccessDeniedMsg('🚫 Access Denied: Regular members do not have admin privileges.');
      return;
    }

    setShowAdminPassModal(true);
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminPassInput === 'admin123') {
      setShowAdminPassModal(false);
      setIsAdminView(true);
    } else {
      setAccessDeniedMsg('❌ Incorrect Secret Admin PIN. Access Denied!');
    }
  };

  if (isAdminView) {
    return <AdminDashboard onClose={() => setIsAdminView(false)} />;
  }

  if (isProfileView) {
    return <UserProfile onClose={() => setIsProfileView(false)} onLogout={handleLogout} />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans relative">
        <Navbar
          onOpenBooking={() => handleOpenBooking('Free Trial')}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileView(true)}
          currentUser={currentUser}
        />

        {accessDeniedMsg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-rose-500/90 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-400 text-xs sm:text-sm font-bold backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{accessDeniedMsg}</span>
            <button onClick={() => setAccessDeniedMsg(null)} className="ml-2 hover:text-slate-200 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <main className="flex-1">
          <Hero onOpenBooking={() => handleOpenBooking('Free Trial')} />
          <Programs />
          {/* Membership Plans with Direct Plan Activation */}
          <MembershipPlans onSelectPlan={handlePlanUpdated} />
          <Trainers />
          <Gallery />
          <ContactForm />
        </main>

        <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-4">
          <p>&copy; {new Date().getFullYear()} TITANFIT Gym. All rights reserved.</p>

          <button
            onClick={handleAdminAccessClick}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-amber-500 transition-colors text-xs cursor-pointer font-medium"
          >
            <Lock className="w-3 h-3" />
            Admin Portal
          </button>
        </footer>

        <AIChatbot />

        <FreeTrialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedPlan={selectedPlan}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(user) => setCurrentUser(user)}
        />

        {showAdminPassModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
              <button
                onClick={() => setShowAdminPassModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Admin Authentication</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Enter master PIN to access Management Portal.
                </p>
              </div>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    value={adminPassInput}
                    onChange={(e) => setAdminPassInput(e.target.value)}
                    placeholder="Enter Secret Key (default: admin123)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 text-center tracking-widest font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  Verify & Open Portal
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}