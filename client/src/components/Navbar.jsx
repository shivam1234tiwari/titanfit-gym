import React, { useState, useEffect } from 'react';
import { Dumbbell, Menu, X, User } from 'lucide-react';

export default function Navbar({ onOpenBooking, onOpenAuth, onOpenProfile, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Programs', href: '#programs' },
    { name: 'Membership', href: '#membership' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-2xl font-black tracking-wider text-white">
          <Dumbbell className="w-8 h-8 text-amber-500" />
          <span>TITAN<span className="text-amber-500">FIT</span></span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-300 hover:text-amber-500 text-sm font-semibold transition-colors"
            >
              {link.name}
            </a>
          ))}

          {/* User Auth or Profile Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-400 font-bold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-slate-300 hover:text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Log In
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Free Trial Pass
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
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
            <button
              onClick={() => { setIsOpen(false); onOpenProfile(); }}
              className="w-full text-left font-bold text-amber-400 py-2"
            >
              My Profile ({currentUser.name})
            </button>
          ) : (
            <button
              onClick={() => { setIsOpen(false); onOpenAuth(); }}
              className="w-full text-left font-bold text-slate-300 py-2"
            >
              Log In / Sign Up
            </button>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenBooking();
            }}
            className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold py-3 rounded-xl text-sm"
          >
            Free Trial Pass
          </button>
        </div>
      )}
    </nav>
  );
}