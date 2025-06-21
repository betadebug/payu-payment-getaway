// lib/payu-config.ts
export const PAYU_CONFIG = {
  merchantKey: process.env.PAYU_MERCHANT_KEY!,
  merchantSalt: process.env.PAYU_MERCHANT_SALT!,
  baseUrl: process.env.PAYU_BASE_URL!,
  successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/response`,
  failureUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/response`,
};

export interface PayUFormData {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface PaymentRequest {
  amount: number;
  productInfo: string;
  firstName: string;
  email: string;
  phone: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}
