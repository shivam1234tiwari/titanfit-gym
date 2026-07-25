import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isProfileView, setIsProfileView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

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

  if (isAdminView) {
    return <AdminDashboard onClose={() => setIsAdminView(false)} />;
  }

  if (isProfileView) {
    return <UserProfile onClose={() => setIsProfileView(false)} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar
        onOpenBooking={() => handleOpenBooking('Free Trial')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileView(true)}
        currentUser={currentUser}
      />

      <main className="flex-1">
        <Hero onOpenBooking={() => handleOpenBooking('Free Trial')} />
        <Programs />
        <MembershipPlans onSelectPlan={(plan) => handleOpenBooking(plan)} />
        <Trainers />
        <Gallery />
        <ContactForm />
      </main>

      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-4">
        <p>&copy; {new Date().getFullYear()} TITANFIT Gym. All rights reserved.</p>

        <button
          onClick={() => setIsAdminView(true)}
          className="text-slate-400 hover:text-amber-500 underline text-xs cursor-pointer"
        >
          Admin Dashboard
        </button>
      </footer>

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
    </div>
  );
}