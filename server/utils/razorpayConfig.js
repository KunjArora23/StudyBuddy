import Razorpay from "razorpay";

// Initialize Razorpay with your API key and secret
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});