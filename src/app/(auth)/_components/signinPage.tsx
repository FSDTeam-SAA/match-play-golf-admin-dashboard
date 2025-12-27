"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Password should be 6 character." }),
});

type FormType = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (payload: FormType) => {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Login successful!");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(`login error : ${error}`);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(payload: FormType) {
    await handleSignIn(payload);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-[45px] border border-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-[45px] border border-black pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <div>
              <Link href={"/forgot-password"}>
                <h4 className="underline">Forgot Password?</h4>
              </Link>
            </div>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="h-[45px] w-full bg-black hover:bg-black/85 text-white disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <div>
                  <Spinner />
                </div>

                <div>Log In</div>
              </div>
            ) : (
              `Log In`
            )}
          </Button>
        </form>
      </Form>

      <div>
        <h3 className="text-center mt-5">
          Don’t have an account?{" "}
          <Link href={"/sign-up"}>
            <span className="font-semibold hover:underline">Sign Up</span>
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default LoginForm;