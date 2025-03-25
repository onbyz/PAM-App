import React,{ useState, useEffect } from 'react';
import Logo from "@assets/login/PAM Logo.png";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import ScheduleList from '../schedules/scheduleList/scheduleList';

export default function forgotPassowrd() {

  const formSchema = z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email : "",
      password : "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Submitting Data:", data);

    try {
      // const response = await axios.post("/api/admin/schedule", data);
      console.log("Form data : ", response.data);
      // alert("Login successfully!");
      form.reset();
    } catch (error) {
      // if (error.response && error.response.data && error.response.data.message) {
      //   alert(error.response.data.data);
      // } else {
      //   alert("Error occurred while login.");
      // }
      console.error("Error occurred while login : ", error);
    }
  };


  return (
    <div className="flex h-full w-[90%] md:w-[70%] my-[25%] md:my-[10%] mx-[5%] md:mx-[15%] bg-[#F1F5F6]">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 p-8">
        <a href='/'>
          <img src={Logo} alt="Pam Cargo Logo" className="w-full md:w-40 mb-8" />
        </a>

        <h2 className="mb-12 md:ml-[10%] xl:ml-[13%]">Hello, Welcome</h2>

        <div className='flex flex-col justify-center items-center md:ml-[10%] xl:ml-0'>
          <Form {...form}>
            <form className="w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
              <div className='mb-6'>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px]">Enter Email Address</FormLabel>
                      <FormControl>
                          <Input placeholder="force@adresseemail.com" type="email" className="w-full h-[49px] p-3 border-[#328533] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" {...field} />
                      </FormControl>
                      <FormMessage className='text-[14px]'/>
                  </FormItem>
                )}/>
              </div>
              
              <a href='/resset-password'>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Next
                </button>
              </a>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100">
        <img
          src="/cargo-container.png"
          alt="Form Img"
          className="max-w-md"
        />
      </div>
    </div>
  );
} 
