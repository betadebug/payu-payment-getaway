import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { date } from "zod/v4-mini";
import PaymentCheck from "./paymentCheck";

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
