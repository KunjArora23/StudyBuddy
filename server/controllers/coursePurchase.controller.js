import { instance } from "../utils/razorpayConfig.js";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import crypto from 'crypto'

export const checkout = async (req, res) => {

  const { courseId } = req.params;
  const { userId } = req.id // from isAuthenticated middleware
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    })
  }

  const amount = (course.coursePrice * 100); // in paise
  // console.log(amount)
  try {
    const options = {
      amount: amount, // amount in the smallest currency unit
      currency: "INR",
    };
    // console.log("done")
    const order = await instance.orders.create(options);
    // console.log(order);

    return res.status(200).json({
      message: "Order created successfully",
      order,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}


export const getKey = async (req, res) => {
  try {
    const key = process.env.RAZORPAY_API_KEY;

    if (!key) {
      return res.status(404).json({
        success: false,
        message: "Key not found",
      })
    }
    return res.status(200).json({
      message: "Key fetched successfully",
      key,
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })

  }
}




export const paymentVerification = async (req, res) => {
  console.log("✅ paymentVerification controller called");

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;


    // You can include courseId and userId in Razorpay "notes"

    const courseId = req.body.notes?.courseId;
    const userId = req.body.notes?.userId;
    const amount = req.body.amount;




    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const coursePurchase = await CoursePurchase.create({
        courseId,
        userId,
        amount,
        status: "completed",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });



      return res.status(200).json({
        success: true,
        reference: razorpay_payment_id,
      });

    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature. Payment failed.",
      });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during payment verification.",
    });
  }
};




