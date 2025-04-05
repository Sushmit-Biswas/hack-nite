"use client"

import React from 'react'; // Add React import
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc"; // Import Google icon

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"

import FormField from "@/components/FormField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp, signInWithProvider } from "@/lib/actions/auth.action"; // Add signInWithProvider
import { toast, Toaster } from "sonner";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

type FormType = "sign-in" | "sign-up";
// Removed duplicate type definition

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter(); // Keep only one router initialization
  const [isLoading, setIsLoading] = React.useState(false); // Add loading state
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        // Send email verification
        await sendEmailVerification(userCredentials.user);

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if(!result?.success) {
          toast.error(result?.message);
          return;
        }
        toast.success("Account created. Please check your email to verify your address before signing in.");
        // Don't auto-redirect, let user sign in after verification
        // setTimeout(() => {
        //   router.push("/sign-in");
        // }, 1500);
          
      } else {
        const {email, password} = values;

        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        
        const idToken = await userCredentials.user.getIdToken();

        if(!idToken) {
          toast.error("Sign in failed. Please try again.");
          return;
        }

        const result = await signIn({ // Capture result
          email,
          idToken,
        });

        if (!result?.success) { // Check result for success/message
          toast.error(result?.message || "Sign in failed. Please try again.");
          return;
        }

        toast.success("Sign in successful.");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      let errorMessage = "Authentication failed. Please try again.";
      if (error instanceof Error) {
          errorMessage = `Authentication failed: ${error.message}`;
      } else if (typeof error === 'object' && error !== null && 'code' in error) {
          // Handle Firebase specific error codes if needed
          // Example: if (error.code === 'auth/wrong-password') { ... }
          errorMessage = `Authentication failed: ${error.code}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // End loading state
    }
  }

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredentials = await signInWithPopup(auth, provider);
      const idToken = await userCredentials.user.getIdToken();

      const result = await signInWithProvider({
        idToken,
        name: userCredentials.user.displayName,
        email: userCredentials.user.email,
        photoURL: userCredentials.user.photoURL,
      });

      if (!result?.success) {
        toast.error(result?.message || "Google Sign-In failed.");
        return;
      }

      toast.success("Signed in with Google successfully.");
      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (error) {
      console.error("Google Sign-In error:", error);
      toast.error("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const isSignIn = type === "sign-in";

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
          <div className="flex flex-row gap-2 justify-center">
            <Image src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-primary-100">MockMate</h2>
          </div>
            <h3 className="text-center">AI mock interviews and resume check</h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 mt-4 form"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Your Name"
                  type="text"
                />
              )}

              <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Your email address"
                type="email"
              />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />

              {isSignIn && (
                 <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm text-user-primary hover:underline">
                        Forgot Password?
                    </Link>
                 </div>
              )}

              <Button className="btn text-lg" type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : (isSignIn ? "Sign In" : "Create an Account")}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-100 px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button variant="outline" className="btn-secondary gap-2 w-full justify-center text-lg" onClick={handleGoogleSignIn} disabled={isLoading}>
            <FcGoogle size={30} /> Google
          </Button>


          <p className="text-center mt-4">
            {isSignIn ? "No account yet?" : "Have an account already?"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className="font-bold text-user-primary ml-1"
            >
              {!isSignIn ? "Sign In" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthForm
