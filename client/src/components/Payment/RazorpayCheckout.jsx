import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RazorpayCheckout = ({ amount, userId }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Failed to load Razorpay SDK.');
      return;
    }

    try {
      // 1. Create order on backend
      const { data: order } = await axios.post('/api/payment/create-order', { amount });

      // 2. Configure Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_PUBLIC_KEY', // Replace or use .env
        amount: order.amount,
        currency: order.currency,
        name: 'Flowers & Plants',
        description: 'Order Payment',
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // 3. Verify & save payment to DB
            const verifyRes = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              user_id: userId,
            });

            toast.success('Payment successful and saved!');
            console.log('Payment record:', verifyRes.data.payment);
          } catch (verifyErr) {
            console.error('Verification failed:', verifyErr);
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'you@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#8BC34A',
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      toast.error('Payment initiation failed.');
    }
  };

  return (
    <button className="btn btn-success mt-3" onClick={handlePayment}>
      Pay ₹{amount / 100}
    </button>
  );
};

export default RazorpayCheckout;
