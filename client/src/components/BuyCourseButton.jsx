/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const BuyCourseButton = ({ courseId, user }) => {
  const [isLoading, setIsLoading] = useState(false);

  const purchaseCourseHandler = async () => {
    try {
      console.log(user);
      setIsLoading(true);
      // fetching the razorpay key
      const res = await axios.get(
        "http://localhost:8080/api/v1/payment/getkey",
        { withCredentials: true }
      );
      const key = res.data.key;

      // fetching the order created by razorpay
      const {
        data: { order },
      } = await axios.get(
        `http://localhost:8080/api/v1/payment/${courseId}/purchase`,
        { withCredentials: true }
      );
      console.log(order);
      console.log(user);

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: user?.name,
        description: "Creating purchase order",
        image: user?.photoUrl,
        order_id: order.id,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        notes: {
          courseId,
          userId: user?.id,
          amount: order.amount,
        },
        handler: async function (response) {
          // Send the Razorpay response + courseId + userId to backend
          try {
            const res = await axios.post(
              "http://localhost:8080/api/v1/payment/payment-verify",
              {
                ...response,
                notes: {
                  courseId,
                  userId: user?.id,
                },
                amount: order.amount,
              },
              { withCredentials: true }
            );
            console.log(res);
            window.location.href = `/paymentsuccess?reference=${res.data.reference}`;
            toast.success("Payment successful!");
          } catch (err) {
            console.error("Verification failed:", err);
            toast.error("Payment verification failed.");
          }
        },
        theme: {
          color: "#121212",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <Button disabled={false} onClick={purchaseCourseHandler} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
