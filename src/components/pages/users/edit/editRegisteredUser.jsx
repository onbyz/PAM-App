import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";

const formSchema = z.object({
    name: z.string().min(2, "Name is required!"),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
});

export default function EditRegisteredUser() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: ""
        },
    });

    // Fetch user details on initial render
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/subscribers/${id}`);
                if (response.status === 200) {
                    const userData = response.data?.data;
                    form.reset({
                        name: userData.name,
                        email: userData.email
                    });
                }
            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Failed to fetch user details. Please try again.");
                console.error("Error fetching user details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUserDetails();
        }
    }, [id, form]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const onSubmit = async (data) => {
        setSuccessMessage("");
        setErrorMessage("");
        try {
            const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/subscribers/${id}/edit`, data);
            if (response.status === 200) {
                setSuccessMessage("User updated successfully");
                setTimeout(() => navigate("/registered-users"), 2000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to update user. Please try again.");
            console.error("Error updating user:", error);
        }
    };

    return (
        <div>
            <div className="md:mr-[2.5%]">
                <div className="mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2">
                    <h4 className="leading-[56px] text-[26px] font-medium">Edit User</h4>
                    <button
                        onClick={handleGoBack}
                        className="w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2"
                    >
                        <FaXmark className="mt-[2px]" />
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
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <p>Loading user details...</p>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="my-8">
                                <div className="mb-6">
                                    <div className="flex flex-col md:flex-row gap-12">
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[14px] text-black">
                                                            Name <span className="text-red-500">*</span>
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
                                                        <FormMessage className="text-[14px]" />
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
                                                            E-mail <span className="text-red-500">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[14px]" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6 mt-8">
                                    <button
                                        type="submit"
                                        className="px-4 h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2"
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={handleGoBack}
                                        type="button"
                                        className="px-4 h-[40px] text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
}