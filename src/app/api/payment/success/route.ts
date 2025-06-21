// app/api/payment/success/route.ts
import { PAYU_CONFIG } from "@/lib/payu-config";
import { verifyPayUResponse } from "@/lib/payu-utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

  if (!isValidHash) return new Response("Invalid hash", { status: 400 });

  // Redirect to frontend page with query params
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?txnid=${responseData.txnid}&status=success`
  );
}
