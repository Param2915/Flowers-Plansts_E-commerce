const { Payment } = require('../models/Payment');

exports.verifyAndSavePayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, user_id } = req.body;

  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const payment = await Payment.create({
      user_id,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
      amount,
      status: 'completed'
    });

    res.json({ message: "Payment verified and saved", payment });
  } catch (err) {
    console.error('Error saving payment:', err);
    res.status(500).json({ message: "Error saving payment", error: err.message });
  }
};
