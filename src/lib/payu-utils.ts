// lib/payu-utils.ts
import crypto from "crypto";
import { PAYU_CONFIG, PayUFormData, PaymentRequest } from "./payu-config";

export function generateTransactionId(): string {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function generateHash(data: string, salt: string): string {
  return crypto
    .createHash("sha512")
    .update(data + salt)
    .digest("hex");
}

export function createPayUHash(
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  udf1: string = "",
  udf2: string = "",
  udf3: string = "",
  udf4: string = "",
  udf5: string = "",
  salt: string
): string {
  // PayU hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

  // Generate SHA512 hash
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  return hash;
}

export function verifyPayUResponse(
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  status: string,
  udf1: string = "",
  udf2: string = "",
  udf3: string = "",
  udf4: string = "",
  udf5: string = "",
  salt: string,
  receivedHash: string
): boolean {
  // PayU response hash format: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  // Handle both JSON format and plain hash format
  let hashToCompare = receivedHash;

  try {
    // Try to parse as JSON first (newer PayU format)
    const parsedHash = JSON.parse(receivedHash);
    if (parsedHash.v1) {
      hashToCompare = parsedHash.v1;
    }
  } catch {
    // If not JSON, use the hash as is (older format)
    hashToCompare = receivedHash;
  }

  return calculatedHash === hashToCompare;
}

export function preparePayUFormData(
  paymentRequest: PaymentRequest
): PayUFormData {
  const txnid = generateTransactionId();
  const amount = paymentRequest.amount.toString();

  const hash = createPayUHash(
    PAYU_CONFIG.merchantKey,
    txnid,
    amount,
    paymentRequest.productInfo,
    paymentRequest.firstName,
    paymentRequest.email,
    paymentRequest.udf1 || "",
    paymentRequest.udf2 || "",
    paymentRequest.udf3 || "",
    paymentRequest.udf4 || "",
    paymentRequest.udf5 || "",
    PAYU_CONFIG.merchantSalt
  );

  return {
    key: PAYU_CONFIG.merchantKey,
    txnid,
    amount,
    productinfo: paymentRequest.productInfo,
    firstname: paymentRequest.firstName,
    email: paymentRequest.email,
    phone: paymentRequest.phone,
    surl: PAYU_CONFIG.successUrl,
    furl: PAYU_CONFIG.failureUrl,
    hash,
    udf1: paymentRequest.udf1,
    udf2: paymentRequest.udf2,
    udf3: paymentRequest.udf3,
    udf4: paymentRequest.udf4,
    udf5: paymentRequest.udf5,
  };
}
