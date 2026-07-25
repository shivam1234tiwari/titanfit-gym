import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import MembershipPlans from './components/MembershipPlans';
import Trainers from './components/Trainers';
import Gallery from './components/Gallery';
import ContactForm from './components/ContactForm';
import FreeTrialModal from './components/FreeTrialModal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleOpenBooking = (planName = 'Free Trial') => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

  if (isAdminView) {
    return <AdminDashboard onClose={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar onOpenBooking={() => handleOpenBooking('Free Trial')} />

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
        
        {/* Toggle to Admin Panel */}
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
    </div>
  );
}