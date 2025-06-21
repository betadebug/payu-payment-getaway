// app/payment/page.tsx
"use client";

import PaymentForm from "@/components/PaymentForm";

export default function PaymentPage() {
  const handlePaymentInitiated = (txnId: string) => {
    console.log("Payment initiated with transaction ID:", txnId);
    // You can store this in your database or state management
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Make Payment</h1>
        <PaymentForm onPaymentInitiated={handlePaymentInitiated} />
      </div>
    </div>
  );
}
