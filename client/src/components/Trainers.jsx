import React, { useState, useEffect } from 'react';
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

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Fetch trainers from backend
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setIsLoading(true);
        setFetchError('');

        const res = await fetch(`${API_BASE_URL}/api/trainers`);

        if (!res.ok) {
          throw new Error('Failed to load trainers.');
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setTrainers(data.data);
        } else {
          setTrainers([]);
          setFetchError(
            data.message || 'No trainers available right now.'
          );
        }
      } catch (err) {
        console.error('Fetch trainers error:', err);
        setFetchError(
          'Unable to load trainers. Please check your server connection.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const openTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setBookingStatus('');
  };

  const closeTrainer = () => {
    if (isBooking) return;

    setSelectedTrainer(null);
    setBookingStatus('');
  };

  // Book consultation with the selected trainer
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

    // Local date in YYYY-MM-DD format
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-amber-500">
            <LoaderCircle className="mb-3 h-8 w-8 animate-spin" />

            <p className="text-sm text-slate-300">
              Loading trainers...
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && fetchError && (
          <div
            role="alert"
            className="mx-auto max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center"
          >
            <p className="text-sm text-red-300">
              {fetchError}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading &&
          !fetchError &&
          trainers.length === 0 && (
            <p className="py-12 text-center text-slate-400">
              No trainers found.
            </p>
          )}

        {/* Trainer cards */}
        {!isLoading && !fetchError && trainers.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((trainer, index) => (
              <button
                type="button"
                key={trainer._id || trainer.id || trainer.name || index}
                onClick={() => openTrainer(trainer)}
                aria-label={`View ${trainer.name}'s profile`}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/50"
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <img
                    src={
                      trainer.image ||
                      'https://placehold.co/600x800?text=Trainer'
                    }
                    alt={trainer.name || 'Fitness Trainer'}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute bottom-3 right-3 rounded-full border border-amber-500/20 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
                    {trainer.experience || 'Experienced Coach'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h4 className="mb-1 text-xl font-bold text-white transition-colors group-hover:text-amber-500">
                      {trainer.name || 'Fitness Trainer'}
                    </h4>

                    <p className="mb-4 text-sm font-medium text-amber-500">
                      {trainer.role || 'Personal Trainer'}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4">
                    <p className="mb-2 text-xs font-medium text-slate-400">
                      Certifications:
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(trainer.certifications)
                        ? trainer.certifications
                        : []
                      ).map((cert, certIndex) => (
                        <span
                          key={`${cert}-${certIndex}`}
                          className="rounded-md border border-slate-700/50 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300"
                        >
                          {cert}
                        </span>
                      ))}

                      {(!Array.isArray(trainer.certifications) ||
                        trainer.certifications.length === 0) && (
                        <span className="text-xs text-slate-500">
                          Certifications not listed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
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
                src={
                  selectedTrainer.image ||
                  'https://placehold.co/600x800?text=Trainer'
                }
                alt={selectedTrainer.name || 'Fitness Trainer'}
                className="h-full w-full object-cover object-top"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-3">
                <div>
                  <h3
                    id="trainer-modal-title"
                    className="text-2xl font-bold text-white"
                  >
                    {selectedTrainer.name || 'Fitness Trainer'}
                  </h3>

                  <p className="text-xs font-medium text-amber-500">
                    {selectedTrainer.role || 'Personal Trainer'}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />

                  {selectedTrainer.rating ?? 'N/A'}
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
                  {selectedTrainer.bio ||
                    'Trainer biography is not available yet.'}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Specialties
                </h4>

                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedTrainer.specialties)
                    ? selectedTrainer.specialties
                    : []
                  ).map((specialty, index) => (
                    <span
                      key={`${specialty}-${index}`}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-slate-950 px-3 py-1 text-xs font-medium text-emerald-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {specialty}
                    </span>
                  ))}

                  {(!Array.isArray(selectedTrainer.specialties) ||
                    selectedTrainer.specialties.length === 0) && (
                    <span className="text-xs text-slate-500">
                      Specialties not listed
                    </span>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Certifications
                </h4>

                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedTrainer.certifications)
                    ? selectedTrainer.certifications
                    : []
                  ).map((certification, index) => (
                    <span
                      key={`${certification}-${index}`}
                      className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400"
                    >
                      <Award className="h-3.5 w-3.5" />
                      {certification}
                    </span>
                  ))}

                  {(!Array.isArray(selectedTrainer.certifications) ||
                    selectedTrainer.certifications.length === 0) && (
                    <span className="text-xs text-slate-500">
                      Certifications not listed
                    </span>
                  )}
                </div>
              </div>

              {/* Booking action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleBookConsultation(selectedTrainer)
                  }
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
                      {(selectedTrainer.name || 'Trainer').split(' ')[0]}
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