import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto"

export const createOrder = async (req,res) => {
    try {
        const {planId, amount, credits} = req.body;
        if (!amount || !credits || !planId) {
      return res.status(400).json({ message: "Invalid plan data" });
    }

    // Validate amount is positive
    if (amount <= 0 || credits <= 0) {
      return res.status(400).json({ message: "Invalid amount or credits" });
    }

     const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options)

     await Payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.json(order);


    } catch (error) {
      console.error('Create order error:', error)
      return res.status(500).json({message:"Failed to create payment order. Please try again."})
    }
}


export const verifyPayment = async (req,res) => {
    try {
        const {razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature} = req.body

      // Validate all required fields are present
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({message: "Missing payment details"})
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Use atomic operation to prevent race condition:
    // Only update payment that is still in "created" status
    const updated = await Payment.findOneAndUpdate(
      {razorpayOrderId: razorpay_order_id, status: "created"},
      {status: "paid", razorpayPaymentId: razorpay_payment_id},
      {new: true}
    );

    if (!updated) {
      return res.status(409).json({message: "Payment already processed"});
    }

    // Authorization check: Verify user owns this payment
    if (updated.userId.toString() !== req.userId) {
      return res.status(403).json({message: "Unauthorized"})
    }

    // Add credits to user with atomic operation
    const updatedUser = await User.findByIdAndUpdate(updated.userId, {
      $inc: { credits: updated.credits }
    },{new:true});

    if (!updatedUser) {
      return res.status(404).json({message: "User not found"})
    }

    res.json({
      success: true,
      message: "Payment verified and credits added",
      user: {id: updatedUser._id, credits: updatedUser.credits, name: updatedUser.name},
    });

    } catch (error) {
      console.error('Payment verification error:', error)
      return res.status(500).json({message:"Failed to verify payment. Please try again."})
    }
}