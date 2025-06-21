// app/payment/failure/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentFailure() {
  function handleLoading() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing payment response...</p>
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
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPaymentResponse = async () => {
      try {
        // Get all URL parameters
        const params = new URLSearchParams(window.location.search);
        const formData = new FormData();

        // Add all parameters to FormData
        params.forEach((value, key) => {
          formData.append(key, value);
        });

        // Send to backend for verification
        const response = await fetch("/api/payment/response", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        setPaymentData(result);
      } catch (error) {
        console.error("Error processing payment response:", error);
        // Set default failure data if processing fails
        setPaymentData({
          success: false,
          message: "Payment processing failed",
          txnId: searchParams.get("txnid") || "Unknown",
        });
      } finally {
        setLoading(false);
      }
    };

    processPaymentResponse();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
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
            {paymentData?.message ||
              "Unfortunately, your payment could not be processed."}
          </p>

          {paymentData?.txnId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Transaction ID:</strong> {paymentData.txnId}
                </p>
                {paymentData?.error && (
                  <p>
                    <strong>Error:</strong> {paymentData.error}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/payment")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
