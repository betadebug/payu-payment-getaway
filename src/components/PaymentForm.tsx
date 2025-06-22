// components/PaymentForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { paymentRequestSchema } from "@/schema/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { PayUFormData } from "@/lib/payu-config";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  status: string;
  error?: string;
}

interface PaymentFormProps {
  onPaymentInitiated?: (txnId: string) => void;
}

export default function PaymentForm({ onPaymentInitiated }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof paymentRequestSchema>>({
    resolver: zodResolver(paymentRequestSchema),
    defaultValues: {
      amount: 5,
      productInfo: "Sample Product",
      firstName: "Raju",
      email: "raju@betadebug.com",
      phone: "8918209402",
    },
  });

  const onSubmit = async (data: z.infer<typeof paymentRequestSchema>) => {
    setLoading(true);
    setError("");

    try {
      // Initialize payment with your API
      const response = await axios.post<ApiResponse<PayUFormData>>(
        "/api/payment/init",
        data
      );
      const result = await response.data;

      console.log("Payment initialization result:", response);

      if (response.status !== 200 || !result.success) {
        throw new Error(result.error || "Payment initialization failed");
      }

      onPaymentInitiated?.(result.data.txnid);

      // Create and submit form to PayU
      const payuForm = document.createElement("form");
      payuForm.method = "POST";
      payuForm.action =
        process.env.NEXT_PUBLIC_PAYU_BASE_URL ||
        "https://test.payu.in/_payment";

      // Add all form fields
      Object.entries(result.data).forEach(([key, value]) => {
        if (value) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value.toString();
          payuForm.appendChild(input);
        }
      });

      document.body.appendChild(payuForm);
      payuForm.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter amount"
                    type="number"
                    inputMode="decimal"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || 0.0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Info</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product info"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter first name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter first name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email"
                    type="text"
                    inputMode="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    type="number"
                    inputMode="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{loading ? "Loading..." : "Pay Now"}</Button>
        </form>
      </Form>
    </div>
  );
}
