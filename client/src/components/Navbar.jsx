import React, { useState } from 'react';
import { Dumbbell, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenBooking }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Programs', href: '#programs' },
    { name: 'Membership', href: '#membership' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
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
          <button
            onClick={onOpenBooking}
            className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Free Trial Pass
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-300 hover:text-white focus:outline-none cursor-pointer"
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
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenBooking();
            }}
            className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold py-3 rounded-xl text-sm cursor-pointer"
          >
            Free Trial Pass
          </button>
        </div>
      )}
    </nav>
  );
}