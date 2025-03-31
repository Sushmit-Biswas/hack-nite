"use client"

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import FormField from "@/components/FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { toast, Toaster } from "sonner";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

type FormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
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
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
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
        toast.success("Account created successfully. Please sign in.");
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
          
      } else {
        const {email, password} = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredentials.user.getIdToken();

        if(!idToken) {
          toast.error("Sign in failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Sign in successful.");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(`Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

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

          <h3>AI mock interviews and resume check</h3>

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

              <Button className="btn" type="submit">
                {isSignIn ? "Sign In" : "Create an Account"}
              </Button>
            </form>
          </Form>

          <p className="text-center">
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
