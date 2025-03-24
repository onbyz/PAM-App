import React, { useState, useEffect } from 'react';
import { FaXmark } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import axios from "axios";
import Sidebar from "@components/layouts/sidebar/sidebar";
import Header from '@components/layouts/header/header';
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateSchedule() {

  const [schedules, setSchedules] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/`);
      setSchedules(response.data);
      
      const vesselData = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel`);
      const vesselArray = Array.isArray(vesselData.data.data) ? vesselData.data.data : [];
      setVessels(vesselArray);

      const portsData = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/ports`);
      const portsArray = Array.isArray(portsData.data.data) ? portsData.data.data : [];
      setPorts(portsArray);

      const destinationData = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/destinations`);
      const destinationsArray = Array.isArray(destinationData.data.data) ? destinationData.data.data : [];
      setDestinations(destinationsArray);

    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India'];

  const handleCancel = () => {
    setFormData({
      port_id: "",
      etd: "",
      vessel_id: "",
      voyage_no: "",
      cfs_closing: "",
      fcl_closing: "",
      eta_transit: "",
      destination: "",
      dst_eta: "",
      transit_time: "",
    })
  };

  const formSchema = z.object({
    country: z.string().optional(),
    port_id: z.string().nonempty("Port is required"),
    etd: z.string().nonempty("ETD is required"),
    vessel_id: z.string().nonempty("Vessel is required"),
    voyage_no: z.string().nonempty("Voyage No is required"),
    cfs_closing: z.string().nonempty("CFS Closing is required"),
    fcl_closing: z.string().nonempty("FCL Closing is required"),
    eta_transit: z.string().nonempty("ETA Transit is required"),
    destination: z.string().nonempty("Destination is required"),
    dst_eta: z.string().nonempty("Destination ETA is required"),
    transit_time: z.string().nonempty("Transit Time is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      port_id : "",
      etd: "",
      vessel_id : "",
      voyage_no : "",
      cfs_closing : "",
      fcl_closing : "",
      eta_transit : "",
      destination : "",
      dst_eta : "",
      transit_time : "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Submitting Data:", data);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule`, data);
      console.log("Form data : ", response.data);
      alert("Schedule created successfully!");
      form.reset();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.data);
      } else {
        alert("Error occurred while creating the schedule.");
      }
      console.error("Error Creating Schedule : ", error);
    }
  };

  return (
    <div>
      <div className='flex'>
        
        <Sidebar />

        <div className='w-[80%] h-full my-10 mx-6'>
          
          <Header />

          <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
            <h4 className='leading-[56px]'>Create Schedule</h4>
            
            <a href="/">
              <button className='w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                <FaXmark className='mt-[2px]'/>
                Close
              </button>
            </a>
          </div>

          <div className='mt-4'>
            <h6 className='text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4'>
              Origin Port
            </h6>
          </div>

          <div>
            <Form {...form}>
              <form className='my-8' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col md:flex-row gap-12'>
                  <div className='flex flex-col'>
                    <FormField name="country" control={form.control} render={({ field }) => (
                      <FormItem>
                          <FormLabel className="text-[14px]">Choose Country</FormLabel>
                          <FormControl>
                              <Select onValueChange={field.onChange}>
                                  <SelectTrigger className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                      <SelectValue/>
                                  </SelectTrigger>
                                  <SelectContent>
                                      {countries.map((country) => (
                                          <SelectItem key={country} value={country} className="text-[16px]">
                                              {country}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )} />
                  </div>


                  <div className='flex flex-col'>
                    <FormField name="port_id" control={form.control} render={({ field }) => (
                      <FormItem>
                          <FormLabel className="text-[14px]">Choose Name of Origin Port</FormLabel>
                          <FormControl>
                              <Select onValueChange={field.onChange}>
                                  <SelectTrigger className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {ports.map((item) => (
                                          <SelectItem key={item.uuid} value={item.uuid} className="text-[16px]">
                                              {item.origin}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex flex-col">
                    <FormField control={form.control} name="etd" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px]">Enter ETD</FormLabel>
                          <FormControl>
                              <Input type="date" className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" {...field} />
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )}/>
                  </div>
                </div>

                <div className='my-8'>
                  <h6 className='text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4'>
                    Vessel, Voyage, CFS & FCL
                  </h6>
                </div>

                <div className='flex flex-col md:flex-row gap-8'>
                  <div className='flex flex-col'>
                    <FormField name="vessel_id" control={form.control} render={({ field }) => (
                      <FormItem>
                          <FormLabel className="text-[14px]">Choose Vessel</FormLabel>
                          <FormControl>
                              <Select onValueChange={field.onChange}>
                                  <SelectTrigger className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {vessels.map((item) => (
                                          <SelectItem key={item.uuid} value={item.uuid} className="text-[16px]">
                                              {item.name}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )} />
                  </div>

                  <div className='flex flex-col'>
                    <FormField control={form.control} name="voyage_no" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px]">Voyage No</FormLabel>
                          <FormControl>
                              <Input className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" {...field} />
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )}/>

                  </div>
                </div>

                <div className='flex flex-col md:flex-row gap-8 my-8'>
                  <div className="flex flex-col">
                    <FormField control={form.control} name="cfs_closing" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px]">CFS Closing</FormLabel>
                          <FormControl>
                              <Input type="date" className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" {...field} />
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )}/>
                  </div>

                  <div className="flex flex-col">
                    <FormField control={form.control} name="fcl_closing" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px]">FCL Closing</FormLabel>
                          <FormControl>
                              <Input type="date" className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" {...field} />
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )}/>

                  </div>
                </div>

                <div className='my-8'>
                  <h6 className='text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4'>
                    Transit Hub
                  </h6>
                </div>

                <div className="flex flex-col">
                  <FormField control={form.control} name="eta_transit" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[14px]">Enter ETA Dubai</FormLabel>
                        <FormControl>
                            <Input type="date" className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" {...field} />
                        </FormControl>
                        <FormMessage className='text-[14px]'/>
                    </FormItem>
                  )}/>
                </div>

                <div className='my-8'>
                  <h6 className='text-[#16A34A] border-b-[1px] border-[#0000001A] pb-4'>
                    Destination
                  </h6>
                </div>

                <div className='flex flex-col md:flex-row gap-12'>
                  <div className='flex flex-col'>
                    <FormField name="destination" control={form.control} render={({ field }) => (
                      <FormItem>
                          <FormLabel className="text-[14px]">Choose Destination</FormLabel>
                          <FormControl>
                              <Select onValueChange={field.onChange}>
                                  <SelectTrigger className="text-[16px] flex-end w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white">
                                      <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {destinations.map((item) => (
                                          <SelectItem key={item.destination} value={item.destination} className="text-[16px]">
                                              {item.destination}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )} />
                  </div>


                  <div className="flex flex-col">
                    <FormField control={form.control} name="dst_eta" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px]">Enter ETA</FormLabel>
                          <FormControl>
                              <Input type="date" className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" {...field} />
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )}/>
                  </div>

                  <div className='flex flex-col'>
                    <FormField control={form.control} name="transit_time" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[14px]">Transit Time</FormLabel>
                          <FormControl>
                              <Input className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" {...field} />
                          </FormControl>
                          <FormMessage className='text-[14px]'/>
                      </FormItem>
                    )}/>
                  </div> 
                </div>
                
                <div className='flex gap-6 mt-8'>
                  <button type='submit' className='w-[80px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                    Save
                  </button>

                  <button 
                    className='w-[80px] h-[40px] text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white'
                    onClick={handleCancel}
                  > 
                    Cancel
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}