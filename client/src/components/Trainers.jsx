
import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Star,
  Calendar,
  LoaderCircle,
} from 'lucide-react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const trainers = [
  {
    name: 'Marcus Vance',
    role: 'Head Strength & Conditioning',
    experience: '8+ Years Exp.',
    image:
      'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
    certifications: ['CSCS Certified', 'Olympic Lifting'],
    bio: 'Marcus has trained elite athletes and bodybuilders for over 8 years. He specializes in strength progression, powerlifting, and hypertrophy.',
    specialties: ['Powerlifting', 'Hypertrophy', 'Injury Prevention'],
    rating: '4.9',
  },
  {
    name: 'Elena Rostova',
    role: 'HIIT & Mobility Specialist',
    experience: '6+ Years Exp.',
    image:
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600',
    certifications: ['CrossFit L2', 'Yoga Alliance RYT-500'],
    bio: 'Elena blends explosive cardiovascular conditioning with joint mobility routines to ensure fat loss while maintaining joint longevity.',
    specialties: ['HIIT Training', 'Mobility & Stretching', 'Fat Loss'],
    rating: '5.0',
  },
  {
    name: 'David Miller',
    role: 'Bodybuilding & Powerlifting Coach',
    experience: '10+ Years Exp.',
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
    certifications: ['NASM CPT', 'Precision Nutrition L2'],
    bio: 'David combines science-backed strength programming with macro nutrition strategy to help members maximize muscle gains.',
    specialties: ['Contest Prep', 'Strength Mechanics', 'Nutrition Coaching'],
    rating: '4.9',
  },
  {
    name: 'Sophia Chen',
    role: 'Pilates & Functional Movement',
    experience: '5+ Years Exp.',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
    certifications: ['ACE Certified', 'Pilates Master Trainer'],
    bio: 'Sophia focuses on core alignment, posture correction, and body awareness through low-impact Pilates and functional movement.',
    specialties: ['Mat & Reformer Pilates', 'Core Stability', 'Postural Realignment'],
    rating: '4.8',
  },
  {
    name: 'Vikram Singh',
    role: 'Fat Loss & Endurance Coach',
    experience: '7+ Years Exp.',
    image:
      'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=600',
    certifications: ['ISSA Strength Coach', 'TRX Specialist'],
    bio: 'Vikram specializes in body re-composition, metabolic conditioning, and endurance development through high-intensity circuit training.',
    specialties: ['TRX Suspension', 'Metabolic Conditioning', 'Calisthenics'],
    rating: '4.9',
  },
  {
    name: 'Aaliyah Khan',
    role: 'Boxing & Athletic Conditioning',
    experience: '9+ Years Exp.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
    certifications: ['USA Boxing Coach', 'Kettlebell L2'],
    bio: 'Aaliyah brings intense combat-sports conditioning, quick footwork drills, and kettlebell movements to build explosive speed.',
    specialties: ['Boxing Footwork', 'Heavy Bag Drills', 'Explosive Power'],
    rating: '5.0',
  },
];

export default function Trainers() {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const openTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setBookingStatus('');
  };

  const closeTrainer = () => {
    if (isBooking) return;
    setSelectedTrainer(null);
    setBookingStatus('');
  };

  // Book consultation with the selected trainer.
  const handleBookConsultation = async (trainer) => {
    const token = localStorage.getItem('titanfit_token');

    if (!token) {
      setBookingStatus(
        'error: Consultation book karne ke liye pehle login karein.'
      );
      return;
    }

    setIsBooking(true);
    setBookingStatus('');

    let storedUser = {};

    try {
      storedUser = JSON.parse(
        localStorage.getItem('titanfit_user') || '{}'
      );
    } catch (err) {
      console.error('User parse error:', err);
    }

    // Local date in YYYY-MM-DD format.
    const now = new Date();
    const todayDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    try {
      const trainerId = trainer.id || trainer._id;

      const payload = {
        fullName:
          storedUser.name ||
          storedUser.fullName ||
          'TitanFit Member',
        email: storedUser.email || 'member@titanfit.com',
        phone:
          storedUser.phoneNumber ||
          storedUser.phone ||
          '9999999999',
        plan: `Consultation with ${trainer.name}`,
        preferredDate: todayDate,
        preferredTime: 'Morning (08:00 AM)',
        fitnessGoal:
          trainer.role || 'Fat Loss & Endurance Training',
        ...(trainerId ? { trainerId } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.success) {
        setBookingStatus(
          `success: 🎉 Consultation request for ${trainer.name} submitted!`
        );
      } else {
        setBookingStatus(
          `error: ${
            data.message || 'Consultation book nahi ho paya.'
          }`
        );
      }
    } catch (err) {
      console.error('Booking Error:', err);
      setBookingStatus(
        'error: Server connection error. Check backend terminal.'
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <section
      id="trainers"
      className="relative bg-slate-900/40 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-amber-500">
            Expert Coaches
          </h2>

          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
            Train With The Very Best
          </h3>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Click on any coach to view their full profile, bio, and
            specialization details.
          </p>
        </div>

        {/* Trainer cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <button
              type="button"
              key={trainer.name}
              onClick={() => openTrainer(trainer)}
              aria-label={`View ${trainer.name}'s profile`}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/50"
            >
              <div className="relative h-80 w-full overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute bottom-3 right-3 rounded-full border border-amber-500/20 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
                  {trainer.experience}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h4 className="mb-1 text-xl font-bold text-white transition-colors group-hover:text-amber-500">
                    {trainer.name}
                  </h4>

                  <p className="mb-4 text-sm font-medium text-amber-500">
                    {trainer.role}
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-4">
                  <p className="mb-2 text-xs font-medium text-slate-400">
                    Certifications:
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {trainer.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-md border border-slate-700/50 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trainer details modal */}
      {selectedTrainer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeTrainer();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="trainer-modal-title"
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeTrainer}
              disabled={isBooking}
              aria-label="Close trainer details"
              className="absolute right-4 top-4 z-10 cursor-pointer rounded-full border border-slate-800 bg-slate-950/70 p-2 text-slate-300 transition-colors hover:text-white disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Trainer image and details */}
            <div className="relative h-56 sm:h-64">
              <img
                src={selectedTrainer.image}
                alt={selectedTrainer.name}
                className="h-full w-full object-cover object-top"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-3">
                <div>
                  <h3
                    id="trainer-modal-title"
                    className="text-2xl font-bold text-white"
                  >
                    {selectedTrainer.name}
                  </h3>

                  <p className="text-xs font-medium text-amber-500">
                    {selectedTrainer.role}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {selectedTrainer.rating}
                </div>
              </div>
            </div>

            {/* Modal content */}
            <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
              {/* Biography */}
              <div>
                <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  About Coach
                </h4>

                <p className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs leading-relaxed text-slate-300">
                  {selectedTrainer.bio}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Specialties
                </h4>

                <div className="flex flex-wrap gap-2">
                  {selectedTrainer.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-slate-950 px-3 py-1 text-xs font-medium text-emerald-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Certifications
                </h4>

                <div className="flex flex-wrap gap-2">
                  {selectedTrainer.certifications.map((certification) => (
                    <span
                      key={certification}
                      className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400"
                    >
                      <Award className="h-3.5 w-3.5" />
                      {certification}
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleBookConsultation(selectedTrainer)}
                  disabled={isBooking}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isBooking ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      Book Consultation with{' '}
                      {selectedTrainer.name.split(' ')[0]}
                    </>
                  )}
                </button>

                {/* Success and error messages */}
                {bookingStatus && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-3 rounded-xl border p-3 text-sm ${
                      bookingStatus.startsWith('success:')
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-red-500/30 bg-red-500/10 text-red-300'
                    }`}
                  >
                    {bookingStatus.replace(/^(success|error):\s*/, '')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
