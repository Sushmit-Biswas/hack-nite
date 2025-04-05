"use client";

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField"; // Assuming FormField can be reused

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    setMessageSent(false);
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast.success("If an account exists for this email, a password reset link has been sent.");
      setMessageSent(true); // Indicate message was sent
      form.reset(); // Clear the form
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage = "Failed to send password reset email. Please try again.";
       if (error instanceof Error) {
          errorMessage = `Error: ${error.message}`;
      } else if (typeof error === 'object' && error !== null && 'code' in error) {
          // Handle specific Firebase errors if needed
          errorMessage = `Error: ${error.code}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex justify-center items-center min-h-screen">
        <div className="card-border lg:min-w-[500px]">
          <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
              <Image src="/logo.svg" alt="logo" height={32} width={38} />
              <h2 className="text-primary-100">MockMate</h2>
            </div>
            <h3 className="text-center">Reset Your Password</h3>
            <p className="text-center text-sm text-gray-400">
              Enter your email address below and we'll send you a link to reset your password.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-4 form"
              >
                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Your email address"
                  type="email"
                />

                <Button className="btn w-full" type="submit" disabled={isLoading || messageSent}>
                  {isLoading ? "Sending..." : (messageSent ? "Reset Link Sent" : "Send Reset Link")}
                </Button>
              </form>
            </Form>

            <p className="text-center mt-4">
              Remembered your password?
              <Link href="/sign-in" className="font-bold text-user-primary ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
