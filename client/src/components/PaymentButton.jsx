import React, { useState } from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PaymentButton({ planName, amount, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const token = localStorage.getItem('titanfit_token');
    if (!token) {
      alert('Please log in to purchase a membership plan.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order from Backend API
      const res = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, planName }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || 'Failed to initiate payment.');
        setLoading(false);
        return;
      }

      // 2. Configure Razorpay SDK Modal Options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'TitanFit Gym',
        description: `Subscription for ${planName} Plan`,
        order_id: data.order.id,
        handler: async function (response) {
          // 3. Verify Payment Signature on Backend
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planName,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              alert(`🎉 Payment Successful! ${planName} Plan is now Active.`);
              if (onSuccess) onSuccess(planName);
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
          }
        },
        theme: {
          color: '#f59e0b',
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Payment processing error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 text-xs uppercase tracking-wider"
    >
      <CreditCard className="w-4 h-4" />
      {loading ? 'Processing...' : `Pay ₹${amount} & Activate`}
    </button>
  );
}