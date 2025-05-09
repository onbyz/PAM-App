import React, { useState, useEffect } from 'react';
import { FaXmark, FaCopy } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import api from '@/lib/api';

const formSchema = z.object({
  first_name: z.string().min(2, "First Name is required!"),
  last_name: z.string().min(1, "Last Name is required!"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  role: z.string().min(1, "Role is required!"),
  // password: z.string().min(8, "Password must be at least 8 characters long")
});

const ROLES = {
  "admin": "Administrator",
  "schedule_management": "Schedule Management",
  "ec_management": "EC Management"
};

const roleOptions = Object.entries(ROLES).map(([value, label]) => ({
  value,
  label
}));

export default function AddUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      password: "",
    },
    mode: "onBlur",
  });

  const { watch, formState } = form;
  const formValues = watch();

  useEffect(() => {
    const { first_name, last_name, email, role } = formValues;
    const requiredFieldsFilled = 
      first_name.length >= 2 && 
      last_name.length >= 2 && 
      email.match(/^\S+@\S+\.\S+$/) && 
      role.length >= 1;
    
    if (requiredFieldsFilled && !allFieldsFilled) {
      setAllFieldsFilled(true);
      generatePassword();
    } else if (!requiredFieldsFilled && allFieldsFilled) {
      setAllFieldsFilled(false);
      form.setValue("password", "");
    }
  }, [formValues.first_name, formValues.last_name, formValues.email, formValues.role]);

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    
    password += getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ"); 
    password += getRandomChar("abcdefghijklmnopqrstuvwxyz"); 
    password += getRandomChar("0123456789"); 
    password += getRandomChar("!@#$%^&*()-_=+"); 
    
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    password = shuffleString(password);
    
    form.setValue("password", password);
    return password;
  };

  const getRandomChar = (characters) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  };

  const shuffleString = (str) => {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const copyPasswordToClipboard = () => {
    const password = form.getValues("password");
    if (!password) return;
    
    navigator.clipboard.writeText(password)
      .then(() => {
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy password: ", err);
      });
  };

  const handleRegeneratePassword = () => {
    if (allFieldsFilled) {
      generatePassword();
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/invite`, data);
      if (response.status === 200) {
        setSuccessMessage("User invited successfully");
        form.reset();
        setAllFieldsFilled(false);
        setTimeout(() => navigate("/user-management"), 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to invite user. Please try again.");
      console.error("Error inviting user:", error);
    }
  };

  const handleFieldBlur = (fieldName) => {
		form.trigger(fieldName);
	};

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
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            onBlur={() => handleFieldBlur("first_name")}
                            className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                            {...field}
                            onKeyPress={(e) => {
                              if (!/^[a-zA-Z]$/.test(e.key)) {
                                  e.preventDefault();
                              }
                            }}
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
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            onBlur={() => handleFieldBlur("last_name")}
                            className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                            {...field}
                            onKeyPress={(e) => {
                              if (!/^[a-zA-Z]$/.test(e.key)) {
                                  e.preventDefault();
                              }
                            }}
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
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            onBlur={() => handleFieldBlur("email")}
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
                      <FormLabel className="text-[14px] text-black">Role <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger onBlur={() => handleFieldBlur("role")} className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                            <SelectValue placeholder="Select a role" />
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
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative w-[300px]">
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-20 focus:outline-none appearance-none bg-white"
                              {...field}
                              readOnly
                            />
                            {allFieldsFilled && (
                              <div className="absolute inset-y-0 right-0 flex items-center">
                                <button
                                  type="button"
                                  onClick={copyPasswordToClipboard}
                                  className="h-full px-2 text-gray-500 hover:text-gray-700"
                                  title="Copy password"
                                  disabled={!allFieldsFilled}
                                >
                                  <FaCopy size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleRegeneratePassword}
                                  className="h-full px-2 text-gray-500 hover:text-gray-700"
                                  title="Generate new password"
                                  disabled={!allFieldsFilled}
                                >
                                  <RefreshCw size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="h-full px-2 text-gray-500 hover:text-gray-700"
                                  title={showPassword ? "Hide password" : "Show password"}
                                  disabled={!allFieldsFilled}
                                >
                                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        {passwordCopied && (
                          <p className="text-green-600 text-xs mt-1">Password copied to clipboard!</p>
                        )}
                        {!allFieldsFilled && (
                          <p className="text-gray-500 text-xs mt-1">Fill in all required fields to generate a password</p>
                        )}
                        <FormMessage className="text-[14px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-6 mt-8'>
                <button
                  type='submit'
                  disabled={!allFieldsFilled}
                  className={`w-[108px] h-[40px] rounded-md text-white text-[14px] flex justify-center items-center gap-2 ${
                    allFieldsFilled ? 'bg-[#16A34A]' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
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