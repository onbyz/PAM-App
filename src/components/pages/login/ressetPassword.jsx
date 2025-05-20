import React, { useState } from 'react';
import Logo from "@assets/PAM Cargo Logo.svg";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LoginFormImg from "@/assets/login/resset-password.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams(); 
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!token) {
    setTimeout(() => navigate('/login'));
  }

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const formSchema = z.object({
    password: z
      .string()
      .nonempty("Password is required")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string()
  })
  .refine(data => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"]
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data) => {

    setIsSubmitting(true);

    try {
      const payload = {
        token: token,
        password: data.password
      };
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/auth/reset-password`, payload);
      const result = response.data;
      form.reset();
      
      if (!result.error) {
        setSuccessMessage("Password reset successfully");
        // setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error occurred while resetting password";
      setErrorMessage(errorMessage);
      console.error("Error resetting password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <div className="flex h-full w-[90%] md:w-[70%] my-[25%] md:my-[10%] mx-[5%] md:mx-[15%] bg-[#F1F5F6]">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 p-8">
        <Link to='/'>
          <img src={Logo} alt="Pam Cargo Logo" className="w-full md:w-40 mb-8" />
        </Link>

        <h2 className="mb-12 md:ml-[10%] xl:ml-[13%] text-2xl font-semibold">Reset Password</h2>

        <div className="md:ml-[10%] xl:ml-[13%]">
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        </div>

        {successMessage ? (
          <div className="md:ml-[10%] xl:ml-[13%]">
            <p className="text-green-500 mb-4">{successMessage}</p>
            <Link to='/login'>
              <p className="text-blue-500 hover:underline cursor-pointer">Go to Login</p>
            </Link>
          </div>
        ) : (  
          <div className='flex flex-col justify-center items-center md:ml-[10%] xl:ml-0'>
            <Form {...form}>
              <form className="w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-6'>
                  <FormField 
                    control={form.control} 
                    name="password" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[16px] font-medium">Create Password</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input 
                              type={showPassword ? 'text' : 'password'} 
                              className="w-full h-[49px] p-3 border-[#328533] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className='text-[14px] text-red-500'/>
                          <div className="mt-2 text-xs text-gray-500">
                            Password must contain at least 8 characters, one uppercase letter, 
                            one lowercase letter, one number, and one special character.
                          </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-8'>
                  <FormField 
                    control={form.control} 
                    name="confirm_password" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[16px] font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input 
                              type={showPassword ? 'text' : 'password'} 
                              className="w-full h-[49px] p-3 border-[#328533] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className='text-[14px] text-red-500'/>
                      </FormItem>
                    )}
                  />
                </div>
        
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-green-600 text-white py-3 rounded-lg transition ${
                    isSubmitting 
                      ? "opacity-70 cursor-not-allowed" 
                      : "hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Reset Password"}
                </button>
                
                <div className="mt-4 text-center">
                  <Link to="/login" className="text-green-600 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>

      {/* Right Section - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100">
        <img
          src={LoginFormImg}
          alt="Cargo Container"
          className="max-w-full max-h-full object-contain p-4"
        />
      </div>
    </div>
  );
}