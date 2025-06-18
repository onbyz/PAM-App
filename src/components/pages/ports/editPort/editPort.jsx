import React, { useEffect } from 'react';
import { FaXmark } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';
import { Spinner } from '@/components/ui/spinner';

const formSchema = z.object({
    country_id: z.string().min(1, "Country is required!"),
    origin: z.string().min(1, "Origin Port is required!"),
    transit: z.string().min(1, "Transit Port is required!"),
});

export default function EditPort() {
    const { uuid } = useParams();
    const { isLoading, withLoading } = useLoading()
    const [countries, setCountries] = React.useState([]);
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();

    const fetchCountries = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/countries`);
            const data = response.data?.data || []
            const sortedData = data.sort((a, b) => a.name.localeCompare(b.name))
            setCountries(sortedData)
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            country_id: "",
            origin: "",
            transit: "",
        },
    });

    const fetchPortData = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port/${uuid}`);
            if (response.status === 200) {
                const fetchedData = response.data?.data;
                form.reset({
                    country_id: countries.find((country) => country.id === fetchedData?.country_id)?.uuid,
                    origin: fetchedData?.origin || "",
                    transit: fetchedData?.transit || "",
                });
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error fetching vessel data");
            console.error("Error fetching vessel data:", error);
        }
    }

    useEffect(() => {
        fetchPortData();
    }, [uuid, form, countries]);

    const handleGoBack = () => {
        navigate(-1);
    };

    function toCapitalCase(str) {
        return str?.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    const onSubmit = withLoading(async (data) => {
        try {
            const response = await api.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port/${uuid}/edit`, { ...data, origin: toCapitalCase(data.origin?.trim()), transit: toCapitalCase(data.transit?.trim()) });
            if (response.status === 200) {
                setSuccessMessage("Port updated successfully");
                form.reset();
                setTimeout(() => navigate("/port-management"), 3000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error updating port");
            console.error("Error updating port:", error);
        }
    })

    return (
        <div>
            <div className='md:mr-[2.5%]'>
                <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
                    <h4 className='leading-[56px] text-[26px] font-medium'>Edit Port</h4>
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
                    <div className="w-full bg-red-100 text-red-800 text-start p-3 rounded-md my-6 flex justify-between">
                        {errorMessage}
                        <FaXmark className='mt-[2px] hover:cursor-pointer' onClick={() => setErrorMessage("")} />
                    </div>
                )}

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='my-8'>
                            <div className='flex flex-col md:flex-row gap-12'>
                                <div>
                                    <FormField name="country_id" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px]">Choose Country <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {countries.map((country) => (
                                                            <SelectItem key={country.id} value={country.uuid} className="text-[16px]">
                                                                {country.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className='text-[14px]' />
                                        </FormItem>
                                    )} />
                                </div>

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="origin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[14px]">
                                                    Enter Origin Port <span className="text-red-500">*</span>
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
                                        name="transit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[14px]">
                                                    Enter Transit Port <span className="text-red-500">*</span>
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

                            <div className='flex gap-6 mt-8'>
                                <button
                                    type='submit'
                                    className='w-[80px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2'
                                    disabled={isLoading()}
                                >
                                    {isLoading() ? (
                                        <>
                                            <Spinner size="sm" />
                                        </>
                                    ) : (
                                        "Save"
                                    )}
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
