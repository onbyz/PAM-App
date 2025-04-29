import React, { useState } from 'react';
import { FaXmark } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from '@/lib/api';

const formSchema = z.object({
  first_name: z.string().min(2, "First Name is required!"),
  last_name: z.string().min(2, "Last Name is required!"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  role: z.string().min(1, "Role is required!"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

const ROLES = {
  "admin": "Administrator",
  "data_management": "Data Management",
  "logistics_management": "Logistics management"
};

const roleOptions = Object.entries(ROLES).map(([value, label]) => ({
  value,
  label
}));

export default function AddUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      password: "", //
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/invite`, data);
      if (response.status === 200) {
        setSuccessMessage("User created successfully");
        form.reset();
        setTimeout(() => navigate("/user-management"), 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to invite user. Please try again.");
      console.error("Error adding user:", error);
    }
  };

  const roles = ['Data Management', 'Administrator', 'Logistics management'];

  return (
    <div>
      <div className='md:mr-[2.5%]'>
        <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
          <h4 className='leading-[56px]'>User Management</h4>
          <button
            onClick={handleGoBack}
            className='w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2'> 
            <FaXmark className='mt-[2px]' />
            Close
          </button>
        </div>

        {successMessage && (
          <div className="w-full bg-green-100 text-green-800 text-start p-3 rounded-md my-6 flex justify-between">
            {successMessage}
            <FaXmark className="mt-[2px] hover:cursor-pointer" onClick={() => setSuccessMessage("")} />
          </div>
        )}

        {errorMessage && (
          <div className="w-full bg-red-100 text-red-600 text-start p-3 rounded-md my-6 flex justify-between">
            {errorMessage}
            <FaXmark className="mt-[2px] hover:cursor-pointer" onClick={() => setErrorMessage("")} />
          </div>
        )}

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='my-8'>
              <div className='flex flex-col md:flex-row gap-12'>
                <div>
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] text-black">
                          Enter first Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[14px]' />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] text-black">
                          Enter last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[14px]' />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] text-black">
                          Enter E-mail ID <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-[14px]' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-12 my-8">
                <div className="">
                  <FormField name="role" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[14px] text-black">Select Role<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                            <SelectValue/>
                          </SelectTrigger>
                          
                          <SelectContent>
                              {roleOptions.map((role) => (
                                  <SelectItem key={role.value} value={role.value} className="text-[16px]">
                                      {role.label}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className='text-[14px]'/>
                    </FormItem>
                  )} />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px] text-black">
                          Enter Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative w-[300px]">
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                              {...field}
                            />
                            <span
                              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeOff size={20} className="text-gray-500" />
                              ) : (
                                <Eye size={20} className="text-gray-500" />
                              )}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[14px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-6 mt-8'>
                <button
                  type='submit'
                  className='w-[108px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2'>
                  Invite User
                </button>

                <button
                  onClick={handleGoBack}
                  type='button'
                  className='w-[80px] h-[40px] text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white'>
                  Cancel
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
