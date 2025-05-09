import React, { useState, useEffect } from 'react';
import { FaXmark } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from '@/lib/api';

const formSchema = z.object({
    first_name: z.string().min(2, "First Name is required!"),
    last_name: z.string().min(1, "Last Name is required!"),
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    role: z.string().min(1, "Role is required!"),
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

export default function EditUser() {
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            role: "",
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`);
                if (response.status === 200) {
                    const userData = response.data.data;    
                    
                    form.reset({
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        role: userData.role,
                    });
                }
            } catch (error) {
                setErrorMessage("Failed to fetch user data. Please try again.");
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [userId, form]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const onSubmit = async (data) => {
        console.log("Form submitted:", data);
        try {
            const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}/edit`, data);
            if (response.status === 200) {
                setSuccessMessage("User updated successfully");
                setTimeout(() => navigate("/user-management"), 3000);
            }
        } catch (error) {
            setErrorMessage("Failed to update user. Please try again.");
            console.error("Error updating user:", error);
        }
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
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                        {errorMessage}
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
                                                    Enter last Name <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
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
                                                        <SelectValue placeholder="Select role">
                                                            {field.value && ROLES[field.value]}
                                                        </SelectValue>
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
                                            <FormMessage className='text-[14px]' />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            <div className='flex gap-6 mt-8'>
                                <button
                                    type='submit'
                                    className='w-[108px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2'>
                                    Update User
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