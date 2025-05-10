import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import account from "../assets/account.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form.jsx";

import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

export function Login() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (values) => {
    try {
      values.email = values.email.trim();
      values.password = values.password.trim();
      
      const response = await axios.post("http://localhost:5000/auth/login", values, {
        withCredentials: true
      });

      if (response.status === 200) {
        setErrorMessage("Login successful");
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setErrorMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
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
        <DropdownMenuContent className="bg-[#2F3338] outline-none border-[1px] text-white w-40">
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
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {errorMessage && (
          <p className={`text-sm text-center ${errorMessage === "Login successful" ? "text-green-400" : "text-red-400"}`}>
            {errorMessage}
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
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

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/sign-login" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
