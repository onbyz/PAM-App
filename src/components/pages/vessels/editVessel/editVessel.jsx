import React, { useEffect } from 'react';
import { FaXmark } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from '@/lib/api';

const formSchema = z.object({
    vessel_name: z.string().nonempty("Vessel Name is required!").min(3, "Vessel Name must be at least 3 characters"),
});

export default function EditVessel(props) {
    const { uuid } = useParams();
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vessel_name: "",
        },
    });

    const fetchVesselData = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel/${uuid}`);
            if (response.status === 200) {
                const fetchedData = response.data?.data;
                form.reset({
                    vessel_name: fetchedData?.name || "",
                }); 
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error fetching vessel data");
            console.error("Error fetching vessel data:", error);
        }
    }

    useEffect(() => {
        fetchVesselData();
    }, [uuid, form]);

    

    const handleGoBack = () => {
        navigate(-1);
    };

    const onSubmit = async (data) => {
        try {
            const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel/${uuid}/edit`, {
                name: data.vessel_name,
            });
            if (response.status === 200) {
                setSuccessMessage("Vessel updated successfully");
                setTimeout(() => navigate("/vessel-management"), 3000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error updating vessel");
            console.error("Error updating vessel:", error);
        }
    };

    return (
        <div>
            <div className='md:mr-[2.5%]'>
                <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
                    <h4 className='leading-[56px] text-[26px] font-medium'>Edit Vessel</h4>
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
                        <FaXmark className='mt-[2px] hover:cursor-pointer' onClick={() => setSuccessMessage("")} />
                    </div>
                )}

                {errorMessage && (
                    <div className="w-full bg-red-100 text-red-600 text-start p-3 rounded-md my-6 flex justify-between">
                        {errorMessage}
                        <FaXmark className='mt-[2px] hover:cursor-pointer' onClick={() => setErrorMessage("")} />
                    </div>
                )}

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='my-8'>
                            <div className='flex flex-col'>
                                <FormField
                                    control={form.control}
                                    name="vessel_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px]">
                                                Vessel Name <span className="text-red-500">*</span>
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

                            <div className='flex gap-6 mt-8'>
                                <button
                                    type='submit'
                                    className='w-[80px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2'>
                                    Save
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
