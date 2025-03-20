import React, { useState, useEffect } from 'react';
import { FaXmark } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import axios from "axios";
import Sidebar from "@components/layouts/sidebar/sidebar";
import Header from '@components/layouts/header/header';

export default function CreateSchedule() {

  const [schedules, setSchedules] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("/api/admin/schedule/");
      setSchedules(response.data);
      
      const vesselData = await axios.get("/api/admin/vessel");
      const vesselArray = Array.isArray(vesselData.data.data) ? vesselData.data.data : [];
      setVessels(vesselArray);

      const portsData = await axios.get("/api/admin/schedule/ports");
      const portsArray = Array.isArray(portsData.data.data) ? portsData.data.data : [];
      setPorts(portsArray);

      const destinationData = await axios.get("/api/admin/schedule/destinations");
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

  // form submition handling
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Data:", formData);

    try {
      const response = await axios.post("/api/admin/schedule", formData)
      console.log("Form data : ", response.data);
    } catch (error) {
      console.log("Error Creating Schedule : ", error)
    }
  };


  return (
    <div>
      <div className='flex'>
        
        <Sidebar />

        <div className='w-[80%] h-full my-10 mx-6'>
          
          <Header />

          <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
            <h3 className='text-[26px] leading-[56px] font-medium'>Create Schedule</h3>
            
            <a href="/">
              <button className='w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white font-medium text-[14px] flex justify-center items-center gap-2 '> 
                <FaXmark className='mt-[2px]'/>
                Close
              </button>
            </a>
          </div>

          <div className='mt-4'>
            <p className='text-[16px] text-[#16A34A] border-b-[1px] font-medium border-[#0000001A] pb-4'>
              Origin Port
            </p>
          </div>

          <div>
            <Form {...form}>
              <form className='my-8' onSubmit={handleSubmit}>
                <div className='flex flex-col md:flex-row gap-12'>
                  <div className='flex flex-col'>
                    <label htmlFor="country" className="text-[14px] mb-2">
                      Choose Country
                    </label>

                    <select
                      name="country"
                      className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                    >
                      <option value="" className='text-[16px]'>Select a country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>


                  <div className='flex flex-col'>
                    <label className="text-[14px] mb-2">
                      Choose Name of Origin Port
                    </label>

                    <select
                      name='port_id'
                      className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                      required
                      value={formData.port_id}
                      onChange={handleChange}
                    >
                      <option value="" className='text-[16px]'>Select Port</option>
                      {ports?.map((item) => (
                        <option key={item.uuid} value={item.uuid} className='text-[16px]'>{item.origin}</option>
                      ))}

                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="etd" className="text-[14px] mb-2">
                      Enter ETD
                    </label>

                    <div className="relative w-[300px]">
                      <input
                        type="date"
                        name="etd"
                        className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                        required
                        value={formData.etd}
                        onChange={handleChange}
                      />  
                    </div>
                  </div>
                </div>

                <div className='my-8'>
                  <p className='text-[16px] text-[#16A34A] border-b-[1px] font-medium border-[#0000001A] pb-4'>
                    Vessel, Voyage, CFS & FCL
                  </p>
                </div>

                <div className='flex flex-col md:flex-row gap-8'>
                  <div className='flex flex-col'>
                    <label className="text-[14px] mb-2">
                      Choose Vessel
                    </label>

                    <select
                      className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                      name="vessel_id"
                      value={formData.vessel_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="" className='text-[16px]'>Select vessel</option>
                      {vessels?.map((item) => (
                        <option key={item.uuid} value={item.uuid} className='text-[16px]'>{item.name}</option>
                      ))}

                    </select>
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor="country" className="text-[14px] mb-2">
                      Voyage No
                    </label>

                    <input 
                      className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                      required
                      name="voyage_no"
                      value={formData.voyage_no}
                      onChange={handleChange}
                    >
                    </input>
                    
                  </div>
                </div>

                <div className='flex flex-col md:flex-row gap-8 my-8'>
                  <div className="flex flex-col">
                    <label htmlFor="etd" className="text-[14px] mb-2">
                      CFS Closing
                    </label>

                    <div className="relative w-[300px]">
                      <input
                        type="date"
                        className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                        required
                        name="cfs_closing"
                        value={formData.cfs_closing}
                        onChange={handleChange}
                      />  
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="etd" className="text-[14px] mb-2">
                      FCL Closing
                    </label>

                    <div className="relative w-[300px]">
                      <input
                        type="date"
                        className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                        name="fcl_closing"
                        required
                        value={formData.fcl_closing}
                        onChange={handleChange}
                      />  
                    </div>
                  </div>
                </div>

                <div className='my-8'>
                  <p className='text-[16px] text-[#16A34A] border-b-[1px] font-medium border-[#0000001A] pb-4'>
                    Transit Hub
                  </p>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="etd" className="text-[14px] mb-2">
                      Enter ETA Dubai
                    </label>

                    <div className="relative w-[300px]">
                      <input
                        type="date"
                        className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                        required
                        name="eta_transit"
                        value={formData.eta_transit}
                        onChange={handleChange}
                      />  
                    </div>
                  </div>

                <div className='my-8'>
                  <p className='text-[16px] text-[#16A34A] border-b-[1px] font-medium border-[#0000001A] pb-4'>
                    Destination
                  </p>
                </div>

                <div className='flex flex-col md:flex-row gap-12'>
                  <div className='flex flex-col'>
                    <label htmlFor="country" className="text-[14px] mb-2">
                      Choose Name of Destination
                    </label>

                    <select
                      className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                      required
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}

                    >
                      <option value="" className='text-[16px]'>Select Destination</option>
                      {destinations.map((item) => (
                        <option key={item.destination} value={item.destination} className='text-[16px]'>{item.destination}</option>
                      ))}
                        
                      
                    </select>
                  </div>


                  <div className="flex flex-col">
                    <label htmlFor="etd" className="text-[14px] mb-2">
                      Enter ETA
                    </label>

                    <div className="relative w-[300px]">
                      <input
                        type="date"
                        className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                        name='dst_eta'
                        required
                        value={formData.dst_eta}
                        onChange={handleChange}
                      />  
                    </div>
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor="country" className="text-[14px] mb-2">
                      Transit Time
                    </label>

                    <input 
                      className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                      name="transit_time"
                      required
                      value={formData.transit_time}
                      onChange={handleChange}
                    >
                    </input>
                    
                  </div>
                </div>
                
                <div className='flex gap-6 mt-8'>
                  <button type='submit' className='w-[80px] h-[40px] bg-[#16A34A] rounded-md text-white font-medium text-[14px] flex justify-center items-center gap-2 '> 
                    Save
                  </button>

                  <button className='w-[80px] h-[40px] font-medium text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white'> 
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