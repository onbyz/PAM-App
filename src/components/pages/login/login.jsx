import React, { useState, useEffect } from 'react';
import Logo from "@assets/login/PAM Logo.png";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import LoginFormImg from "@/assets/login/login-img.png";

export default function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const formSchema = z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z.string().nonempty("Password is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      if (result.success) {
        navigate('/schedule-list');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.log('An unexpected error occurred', err);
    }

  };


  return (
    <div className="flex h-full w-[90%] md:w-[70%] my-[25%] md:my-[10%] mx-[5%] md:mx-[15%] bg-[#F1F5F6]">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 p-8">
        <Link to='/'>
          <img src={Logo} alt="Pam Cargo Logo" className="w-full md:w-40 mb-8" />
        </Link>

        <h2 className="mb-12 md:ml-[10%] xl:ml-[13%]">Hello, Welcome</h2>

        <div className='flex flex-col justify-center items-center md:ml-[10%] xl:ml-0'>
          {error && (
            <div className="w-full bg-red-100 text-red-600 text-start p-3 -mt-10 rounded-md my-6 flex justify-between">
              {error}
              <FaXmark className="mt-[2px] hover:cursor-pointer" onClick={() => setError("")} />
            </div>
          )}
          <Form {...form}>
            <form className="w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
              <div className='mb-6'>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px]">Email</FormLabel>
                    <FormControl>
                      <Input type="email" className="w-full h-[49px] p-3 border-[#328533] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" {...field} />
                    </FormControl>
                    <FormMessage className='text-[14px]' />
                  </FormItem>
                )} />
              </div>

              <div className='mb-8'>
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px]">Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input type={showPassword ? 'text' : 'password'} className="w-full h-[49px] p-3 border-[#328533] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" {...field} />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className='text-[14px]' />
                  </FormItem>
                )} />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Login →
              </button>

              <p className="mt-4 text-center">
                <Link to="/forgot-password" className="hover:underline">
                  Forgot Password?
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100">
        <img
          src={LoginFormImg}
          alt="Form Img"
          className="max-w-md"
        />
      </div>
    </div>
  );
} 
