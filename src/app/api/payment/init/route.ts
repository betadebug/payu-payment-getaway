// app/api/payment/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PaymentRequest } from "@/lib/payu-config";
import { preparePayUFormData } from "@/lib/payu-utils";

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    // Validate required fields
    if (
      !body.amount ||
      !body.productInfo ||
      !body.firstName ||
      !body.email ||
      !body.phone
    ) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone number (basic validation)
    if (body.phone.length < 10) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Prepare PayU form data
    const payuFormData = preparePayUFormData(body);

    // Debug hash calculation in development
    if (process.env.NODE_ENV === "development") {
      const { debugHashCalculation } = await import("@/lib/payu-utils");
      debugHashCalculation(
        payuFormData.key,
        payuFormData.txnid,
        payuFormData.amount,
        payuFormData.productinfo,
        payuFormData.firstname,
        payuFormData.email,
        payuFormData.udf1 || "",
        payuFormData.udf2 || "",
        payuFormData.udf3 || "",
        payuFormData.udf4 || "",
        payuFormData.udf5 || "",
        process.env.PAYU_MERCHANT_SALT!
      );
    }

    return NextResponse.json({
      success: true,
      data: payuFormData,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
