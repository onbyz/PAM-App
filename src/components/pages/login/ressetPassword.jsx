import React,{ useState, useEffect } from 'react';
import Logo from "@assets/login/PAM Logo.png";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function RessetPassword() {

  const [ showPassword, setShowPassword ] = useState(false);

  const formSchema = z.object({
    password: z.string().nonempty("Password is required"),
    confirm_password : z.string().nonempty("Confirm Password is required")
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
        <Link to='/'>
          <img src={Logo} alt="Pam Cargo Logo" className="w-full md:w-40 mb-8" />
        </Link>

        <h2 className="mb-12 md:ml-[10%] xl:ml-[13%]">Hello, Welcome</h2>

        <div className='flex flex-col justify-center items-center md:ml-[10%] xl:ml-0'>
          <Form {...form}>
            <form className="w-full max-w-md" onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-8'>
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[16px]">Create Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input placeholder="********************" type={ showPassword ? 'text' : 'password' } className="w-full h-[49px] p-3 border-[#328533] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" {...field} />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className='text-[14px]'/>
                        </FormItem>
                    )}/>
                </div>

                <div className='mb-8'>
                    <FormField control={form.control} name="confirm_password" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[16px]">Confirm Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input placeholder="********************" type={ showPassword ? 'text' : 'password' } className="w-full h-[49px] p-3 border-[#328533] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" {...field} />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className='text-[14px]'/>
                        </FormItem>
                    )}/>
                </div>
        
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Next
              </button>
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
