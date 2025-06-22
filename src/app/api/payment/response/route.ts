// app/api/payment/response/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyPayUResponse } from "@/lib/payu-utils";
import { PAYU_CONFIG } from "@/lib/payu-config";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello, world!" });
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const formData = Object.fromEntries(form.entries());

  const responseData = {
    key: formData["key"] as string,
    txnid: formData["txnid"] as string,
    amount: formData["amount"] as string,
    productinfo: formData["productinfo"] as string,
    firstname: formData["firstname"] as string,
    email: formData["email"] as string,
    phone: formData["phone"] as string,
    status: formData["status"] as string,
    hash: formData["hash"] as string,
    udf1: (formData["udf1"] as string) || "",
    udf2: (formData["udf2"] as string) || "",
    udf3: (formData["udf3"] as string) || "",
    udf4: (formData["udf4"] as string) || "",
    udf5: (formData["udf5"] as string) || "",
    payuMoneyId: formData["payuMoneyId"] as string,
    error: formData["error"] as string,
    error_Message: formData["error_Message"] as string,
  };

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

  console.log("Received form data: ", responseData);
  return NextResponse.json(
    { data: responseData, isValidHash: isValidHash },
    { status: 200 }
  );
}

/**
 * Received form data: {
  mihpayid: '403993715534162838',
  mode: 'NB',
  status: 'success',
  unmappedstatus: 'captured',
  key: '4yMPDF',
  txnid: 'TXN1750617576263698',
  amount: '10.00',
  discount: '0.00',
  net_amount_debit: '10',
  addedon: '2025-06-23 00:09:36',
  productinfo: 'Sample Product',
  firstname: 'Raju',
  lastname: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  country: '',
  zipcode: '',
  email: 'raju@betadebug.com',
  phone: '8918209402',
  udf1: '',
  udf2: '',
  udf3: '',
  udf4: '',
  udf5: '',
  udf6: '',
  udf7: '',
  udf8: '',
  udf9: '',
  udf10: '',
  hash: 'ef10066253e2fb18102497c8789e56cb8337ff9c1d43e4b5556ddec5431b00a0c35939c38743420ff78a2342e7e978ea97def09f920cb3b507c6a8e3bc0f15d0',
  field1: '',
  field2: '',
  field3: '',
  field4: '',
  field5: '',
  field6: '',
  field7: '',
  field8: '',
  field9: 'Transaction Completed Successfully',
  payment_source: 'payu',
  pa_name: 'PayU',
  PG_TYPE: 'NB-PG',
  bank_ref_num: 'c201dbe8-83b7-4bc1-8d3a-1408ec30171b',
  bankcode: 'TESTPGNB',
  error: 'E000',
  error_Message: 'No Error'
}
 */

export async function PUT(request: NextRequest) {
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

    // Here you would typically:
    // 1. Update your database
    // 2. Send confirmation emails
    // 3. Update order status

    if (responseData.status === "success") {
      // Redirect to frontend page with query params
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/status?txnid=${responseData.txnid}&status=success`
      );
    } else {
      // Redirect to frontend page with query params
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/status?txnid=${responseData.txnid}&status=failure&error=${responseData.error}`
      );
    }
  } catch (error) {
    console.error("Payment response processing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment response" },
      { status: 500 }
    );
  }
}
