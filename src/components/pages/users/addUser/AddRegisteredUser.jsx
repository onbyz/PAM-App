import React, { useState } from "react";
import { FaXmark, FaTrash } from "react-icons/fa6";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Plus from "@assets/icons/plus.svg";
import api from "@/lib/api";

const formSchema = z.object({
    users: z.array(z.object({
        name: z.string().min(2, "Name is required!"),
        email: z.string().email("Invalid email address").nonempty("Email is required"),
    })).min(1, "At least one user is required")
});

export default function AddRegisteredUser() {
    const [users, setUsers] = useState([{ id: 1 }]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            users: [{ name: "", email: "" }]
        },
    });

    const handleGoBack = () => {
        navigate(-1);
    };

    const addUserRow = () => {
        if (users.length < 5) {
            const newId = Math.max(...users.map(user => user.id), 0) + 1;
            setUsers([...users, { id: newId }]);
            
            // Update form values
            const currentUsers = form.getValues().users || [];
            form.setValue("users", [...currentUsers, { name: "", email: "" }]);
        }
    };

    const removeUserRow = (id, index) => {
        if (users.length > 1) {
            setUsers(users.filter(user => user.id !== id));
            
            // Update form values
            const currentUsers = form.getValues().users;
            const newUsers = [...currentUsers];
            newUsers.splice(index, 1);
            form.setValue("users", newUsers);
        }
    };

    const onSubmit = async (data) => {
        setSuccessMessage("");
        setErrorMessage("");
        try {
          const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/subscribers`, data);
          if (response.status === 200) {
            setSuccessMessage("Users invited successfully");
            form.reset();
            setUsers([{ id: 1 }]);
            setTimeout(() => navigate("/registered-users"), 3000);
          }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to invite users. Please try again.");
          console.error("Error inviting users:", error);
        }
    };

    return (
        <div>
            <div className="md:mr-[2.5%]">
                <div className="mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2">
                    <h4 className="leading-[56px]">User Management</h4>
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
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="my-8">
                            {users.map((user, index) => (
                                <div key={user.id} className="mb-6">
                                    <div className="flex flex-col md:flex-row md:items-end gap-12">
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name={`users.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[14px] text-black">
                                                            Name <span className="text-red-500">*</span>
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

                                        <div>
                                            <FormField
                                                control={form.control}
                                                name={`users.${index}.email`}
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
                                        
                                        {/* Action button section */}
                                        <div>
                                            {/* Show "Add more" button only on the last row when under the limit */}
                                            {index === users.length - 1 && users.length < 5 ? (
                                                <button 
                                                    type="button" 
                                                    className="flex gap-2 items-center mb-2" 
                                                    onClick={addUserRow}
                                                >
                                                    <img src={Plus} alt="plus" className="w-[24px] h-[24px]" />
                                                    <h5 className="text-[14px] text-black">Add more</h5>
                                                </button>
                                            ) : (
                                                /* Show "Remove" button for all rows except the last row when it's the only row */
                                                !(index === users.length - 1 && users.length === 1) && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeUserRow(user.id, index)}
                                                        className="flex gap-2 items-center mb-2 text-red-500"
                                                    >
                                                        <FaTrash className="w-[16px] h-[16px]" />
                                                        <h5 className="text-[14px] text-red-500">Remove</h5>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

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
                </div>
            </div>
        </div>
    );
}