import React, { useState } from 'react';
import { Dumbbell, Menu, X, User, LogOut, ShieldCheck, LogIn } from 'lucide-react';

export default function Navbar({ onOpenBooking, onOpenAuth, onOpenProfile, currentUser, onLogout, onOpenAdmin }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Programs', href: '#programs' },
    { name: 'Membership', href: '#membership' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLogoutClick = () => {
    localStorage.removeItem('titanfit_token');
    localStorage.removeItem('titanfit_user');
    
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-2xl font-black tracking-wider text-white">
          <Dumbbell className="w-8 h-8 text-amber-500" />
          <span>TITAN<span className="text-amber-500">FIT</span></span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-300 hover:text-amber-500 text-sm font-semibold transition-colors"
            >
              {link.name}
            </a>
          ))}

          {/* User Actions */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Admin Portal Button (Admin Only) */}
              {currentUser.role === 'admin' && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}

              {/* User Profile Button */}
              <button
                type="button"
                onClick={onOpenProfile}
                className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-200 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                {currentUser.profilePic ? (
                  <img
                    src={currentUser.profilePic}
                    alt="Avatar"
                    className="w-5 h-5 rounded-full object-cover border border-amber-500/50"
                  />
                ) : (
                  <User className="w-4 h-4 text-amber-500" />
                )}
                <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}</span>
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogoutClick}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-500 text-sm font-bold transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenBooking}
            className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Free Trial Pass
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 hover:text-white focus:outline-none"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-4 pb-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-slate-200 hover:text-amber-500 text-base font-semibold"
            >
              {link.name}
            </a>
          ))}

          {currentUser ? (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {currentUser.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenAdmin) onOpenAdmin();
                  }}
                  className="w-full text-left flex items-center gap-2 font-bold text-amber-400 py-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className="w-full text-left flex items-center gap-2 font-bold text-slate-200 py-2 text-sm"
              >
                <User className="w-4 h-4 text-amber-500" />
                <span>My Profile ({currentUser.name})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleLogoutClick();
                }}
                className="w-full text-left flex items-center gap-2 font-bold text-rose-400 py-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenAuth();
              }}
              className="w-full text-left font-bold text-slate-300 py-2 text-sm"
            >
              Log In / Sign Up
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenBooking();
            }}
            className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold py-3 rounded-xl text-xs"
          >
            Free Trial Pass
          </button>
        </div>
      )}
    </nav>
  );
}