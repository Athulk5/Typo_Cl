import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema } from "../Schemas/formSchema"
import { Link, useNavigate } from "react-router-dom" 
import account from '../assets/account.png';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form.jsx"

import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function SignupForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("") // State for success message

  const togglePassword = () => setShowPassword((prev) => !prev)
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev)

  const navigate = useNavigate(); // Hook for navigation

  const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      console.log("📦 Sending form values:", values)
      const response = await fetch("https://typo-se.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      console.log("📨 Backend response:", data);

      if (!response.ok) {
        form.setError("email", {
          type: "manual",
          message: data.message || "Registration failed",
        });
      } else {
        setSuccessMessage("Sign up successful! ");
        setTimeout(() => {
          navigate("/"); 
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Error during registration:", error);
      form.setError("root", {
        type: "manual",
        message: "Server error",
      });
    }
  };

  return (
    <div className="bg-[#2F3338] h-screen w-screen text-stone-50">
      <span className="font-sec ml-[30px] pt-[10px] text-white text-[50px]" onClick={() => navigate('/')}>Typo</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img
            src={account}
            alt="Account"
            className="absolute top-[30px] right-[40px] w-10 h-10 cursor-pointer rounded-full"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" bg-[#2F3338] outline-none border-[1px] white text-white w-40">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/leaderboard')}>
            Leaderboard
          </DropdownMenuItem>
          <DropdownMenuItem  onClick={() => navigate('/account-details')}>
            Account Details
          </DropdownMenuItem>
      
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="pt-[120px] max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>

        {successMessage && (
          <div className="text-center text-green-400 font-semibold">{successMessage}</div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john_doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password with toggle */}
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
                        placeholder="********"
                        {...field}
                      />
                      <span
                        className="absolute right-3 top-2.5 cursor-pointer text-stone-400 hover:text-white"
                        onClick={togglePassword}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password with toggle */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        {...field}
                      />
                      <span
                        className="absolute right-3 top-2.5 cursor-pointer text-stone-400 hover:text-white"
                        onClick={toggleConfirmPassword}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupForm
