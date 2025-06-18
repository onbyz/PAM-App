import React, { useState } from 'react';
import Logo from "@assets/PAM Cargo Logo.svg";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import LoginFormImg from "@/assets/login/forgot-password.png";
import { useLoading } from '@/hooks/useLoading';
import { Spinner } from '@/components/ui/spinner';

export default function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoading, withLoading } = useLoading()

  const emailFormSchema = z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
  });

  const form = useForm({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = withLoading(async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/auth/forgot-password`, { email: data.email });
      const result = response.data;

      if (!result.error) {
        setSuccessMessage("A verification link has been sent to your email address.");
        setErrorMessage("");
        form.reset();
      }

    } catch (error) {
      console.error("Error occurred while verifying email: ", error);
    }
  })


  return (
    <div className="flex h-full w-[90%] md:w-[70%] my-[25%] md:my-[10%] mx-[5%] md:mx-[15%] bg-[#F1F5F6]">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 p-8">
        <Link to='/'>
          <img src={Logo} alt="Pam Cargo Logo" className="w-full md:w-40 mb-8" />
        </Link>

        {successMessage ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <p>
              <strong className="font-bold">Success!</strong>
            </p>
            <span className="block sm:inline">{successMessage}</span>
          </div>
        ) : (
          <>
            <h2 className="mb-12 md:ml-[10%] xl:ml-[13%]">Hello, Welcome</h2>

            <div className='flex flex-col justify-center items-center md:ml-[10%] xl:ml-0'>
              <Form {...form}>
                <form className="w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className='mb-6'>
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[16px]">Enter Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" className="w-full h-[49px] p-3 border-[#328533] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" {...field} />
                        </FormControl>
                        <FormMessage className='text-[14px]' />
                      </FormItem>
                    )} />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:cursor-not-allowed"
                    disabled={isLoading()}
                  >
                    {isLoading() ? (
                      <>
                        <Spinner size="sm" />
                      </>
                    ) : (
                      "Next"
                    )}
                  </button>
                </form>
              </Form>
            </div>
          </>
        )}
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
