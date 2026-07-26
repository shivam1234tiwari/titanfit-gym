import React from 'react';

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600', title: 'Heavy Dumbbell & Power Rack Zone' },
  { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600', title: 'Functional Turf & Sprint Track' },
  { url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600', title: 'Olympic Weightlifting Platforms' },
  { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600', title: 'Cardio Deck & Endurance Zone' },
];

export default function Gallery() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Our Facility</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">World-Class Gym Atmosphere</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((item, idx) => (
            <div key={idx} className="relative h-64 rounded-xl overflow-hidden group border border-slate-800">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <p className="absolute bottom-4 left-4 right-4 text-xs font-semibold text-slate-200">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}