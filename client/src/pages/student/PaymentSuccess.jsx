import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";

function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract payment reference from query
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("reference");

  // Simulate storing enrollment & fetching slip info
  useEffect(() => {
    const storeEnrollment = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/v1/user/enroll-course",
          { paymentId },
          { withCredentials: true }
        );
        setPaymentDetails(res.data);
        console.log(res.data);

        setLoading(false);
        const courseId = res.data.courseId; // Extract course ID from response

        // Redirect after 5 seconds
        setTimeout(() => {
          navigate(`/course-detail/${courseId}`); // Replace with actual course ID
        }, 5000);
      } catch (err) {
        console.error("Enrollment failed:", err);
        navigate("/course-detail");
      }
    };

    storeEnrollment();
  }, [paymentId, navigate]);
  const downloadReceipt = () => {
    const doc = new jsPDF();

    const { courseName, userName, amount, orderId } = paymentDetails || {};
    const paymentDate = new Date().toLocaleString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("📄 Payment Receipt", 20, 25);

    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30); // Divider line

    // User Info
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text("👤 User Information", 20, 45);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Name: ${userName}`, 30, 55);
    doc.text(`Date: ${paymentDate}`, 30, 65);

    // Course Info
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(" Course Details", 20, 85);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Course Name: ${courseName}`, 30, 95);

    // Payment Info
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(" Payment Summary", 20, 115);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Amount Paid: ₹${amount / 100}`, 30, 125);
    doc.text(`Payment ID: ${paymentId}`, 30, 135);
    doc.text(`Order ID: ${orderId}`, 30, 145);

    // Footer
    doc.setLineWidth(0.2);
    doc.line(20, 160, 190, 160);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Thank you for your purchase! For queries, contact support@studybuddy.com",
      20,
      170
    );

    // Save
    doc.save(`PaymentReceipt_${paymentId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {loading ? (
        <div className="text-xl font-semibold">Verifying your purchase...</div>
      ) : (
        <>
          <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-green-700">
            Payment Successful!
          </h1>
          <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
          <p className="text-sm text-gray-500">
            You’ll be redirected shortly...
          </p>
          <button
            onClick={downloadReceipt}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download Receipt
          </button>
        </>
      )}
    </div>
  );
}

export default PaymentSuccess;
