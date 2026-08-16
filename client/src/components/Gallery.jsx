import React, { useState } from 'react';
import { X, ZoomIn, Dumbbell, ShieldCheck } from 'lucide-react';

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
    title: 'Heavy Dumbbell & Power Rack Zone',
    category: 'Strength Training',
    description: 'Equipped with rubberized cast-iron dumbbells up to 60kg, dual adjustable power racks, and Olympic benches designed for heavy strength progression.',
    highlights: ['Dumbbells up to 60 kg', 'Modular Power Racks', 'Spotter Safety Systems']
  },
  {
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    title: 'Functional Turf & Sprint Track',
    category: 'Athletic Conditioning',
    description: 'High-density synthetic sprint turf for sled pushes, battle ropes, plyometrics, and high-intensity functional conditioning.',
    highlights: ['25-meter Sprint Track', 'Heavy Sleds & Prowlers', 'Kettlebells & Battle Ropes']
  },
  {
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=1200',
    title: 'Olympic Weightlifting Platforms',
    category: 'Powerlifting & Olympic Lifting',
    description: 'IWF-certified shock-absorbing hardwood lifting decks paired with competition bumper plates and needle-bearing barbells.',
    highlights: ['IWF Spec Platforms', 'Competition Bumpers', 'Calibrated Steel Plates']
  },
  {
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200',
    title: 'Cardio Deck & Endurance Zone',
    category: 'Cardiovascular Training',
    description: 'Curved self-powered treadmills, concept-2 rowers, ski-ergs, and air bikes with real-time biometric tracking displays.',
    highlights: ['Curved Non-Motorized Treadmills', 'Concept-2 Rowers & SkiErgs', 'Live Heart-Rate Sync']
  },
];

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Our Facility</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">World-Class Gym Atmosphere</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Click on any zone to inspect equipment and facility specifications</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedItem(item)}
              className="relative h-64 rounded-xl overflow-hidden group border border-slate-800 cursor-pointer shadow-lg hover:border-amber-500/50 transition-all duration-300"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Hover Badge */}
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm p-1.5 rounded-lg border border-slate-700/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-amber-400" />
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          FULL VIEW & ZONE DETAILS MODAL
         ======================================================== */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden relative shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-10 bg-slate-950/70 hover:bg-slate-950 text-slate-300 hover:text-white p-1.5 rounded-full border border-slate-700 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative h-60 w-full overflow-hidden bg-slate-950">
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedItem.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-2 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-amber-500" />
                  {selectedItem.title}
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                {selectedItem.description}
              </p>

              {/* Equipment Highlights */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Key Zone Equipment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Facility View
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}