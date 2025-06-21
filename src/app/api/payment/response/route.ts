// app/api/payment/response/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyPayUResponse } from "@/lib/payu-utils";
import { PAYU_CONFIG } from "@/lib/payu-config";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const responseData = {
      key: formData.get("key") as string,
      txnid: formData.get("txnid") as string,
      amount: formData.get("amount") as string,
      productinfo: formData.get("productinfo") as string,
      firstname: formData.get("firstname") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      status: formData.get("status") as string,
      hash: formData.get("hash") as string,
      udf1: (formData.get("udf1") as string) || "",
      udf2: (formData.get("udf2") as string) || "",
      udf3: (formData.get("udf3") as string) || "",
      udf4: (formData.get("udf4") as string) || "",
      udf5: (formData.get("udf5") as string) || "",
      payuMoneyId: formData.get("payuMoneyId") as string,
      error: formData.get("error") as string,
      error_Message: formData.get("error_Message") as string,
    };

    // Verify hash
    const isValidHash = verifyPayUResponse(
      responseData.key,
      responseData.txnid,
      responseData.amount,
      responseData.productinfo,
      responseData.firstname,
      responseData.email,
      responseData.status,
      responseData.udf1,
      responseData.udf2,
      responseData.udf3,
      responseData.udf4,
      responseData.udf5,
      PAYU_CONFIG.merchantSalt,
      responseData.hash
    );

    if (!isValidHash) {
      console.error("Invalid hash received from PayU");
      return NextResponse.json(
        { error: "Invalid payment response" },
        { status: 400 }
      );
    }

    // Process payment based on status
    if (responseData.status === "success") {
      // Handle successful payment
      console.log("Payment successful:", responseData);

      // Here you would typically:
      // 1. Update your database
      // 2. Send confirmation emails
      // 3. Update order status

      return NextResponse.json({
        success: true,
        message: "Payment successful",
        txnId: responseData.txnid,
        payuMoneyId: responseData.payuMoneyId,
        amount: responseData.amount,
      });
    } else {
      // Handle failed payment
      console.error("Payment failed:", responseData);

      return NextResponse.json({
        success: false,
        message: responseData.error_Message || "Payment failed",
        txnId: responseData.txnid,
        error: responseData.error,
      });
    }
  } catch (error) {
    console.error("Payment response processing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment response" },
      { status: 500 }
    );
  }
}
