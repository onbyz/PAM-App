import React from 'react';
import { FaXmark } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  vessel_name: z.string().min(1, "Vessel Name is required!"),
});

export default function AddVessel() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vessel_name: "",
    },
  });

  const handleGoBack = () => {
    navigate(-1); 
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // You can send this data to backend using axios.post(...)
  };

  return (
    <div>
      <div className='md:mr-[2.5%]'>
        <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
          <h4 className='leading-[56px]'>Add New Vessel</h4>
          <button
            onClick={handleGoBack}
            className='w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2'> 
            <FaXmark className='mt-[2px]' />
            Close
          </button>
        </div>

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
