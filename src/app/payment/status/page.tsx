"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentData {
  success: boolean;
  message: string;
  txnId: string;
  payuMoneyId?: string;
  amount?: string;
  error?: string;
}

export default function PaymentSuccess() {
  function handleLoading() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={handleLoading()}>
      <PaymentCheck />
    </Suspense>
  );
}

function PaymentCheck() {
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txnid");
  const status = searchParams.get("status");
  const message = searchParams.get("msg");

  // useEffect(() => {
  //   const processPaymentResponse = async () => {
  //     try {
  //       // Create URLSearchParams from the searchParams object
  //       const params = new URLSearchParams(searchParams.toString());
  //       const formData = new FormData();

  //       // Add all parameters to FormData
  //       params.forEach((value, key) => {
  //         formData.append(key, value);
  //       });

  //       // Send to backend for verification
  //       // Send to backend for verification
  //       const response = await fetch("/api/payment/response", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       const result = await response.json();
  //       setPaymentData(result);
  //     } catch (error) {
  //       console.error("Error processing payment response:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   processPaymentResponse();
  // }, [searchParams]); // Add searchParams as a dependency

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        {status === "success" ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-4">Thank you for your payment.</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Transaction ID:</strong> {txnId}
                </p>
                <p>{message}</p>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-4">
              {message || "There was an issue with your payment."}
            </p>

            {txnId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Transaction ID:</strong> {txnId}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => (window.location.href = "/payment")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
