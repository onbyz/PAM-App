import React, { useState, useEffect } from 'react';
import axios from "axios";
import Sidebar from "@components/layouts/sidebar/sidebar";
import Header from '@components/layouts/header/header';
import { FaXmark, FaEllipsis } from "react-icons/fa6";

export default function ScheduleList() {

    const [schedules, setSchedules] = useState([]);
    const [vessels, setVessels] = useState([]);
    const [ports, setPorts] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [byVessel, setByVessel] = useState(true);
    const [byPort, setByPort] = useState(false);
  
    const fetchSchedules = async () => {
        try {
            const response = await axios.get("/api/admin/schedule/");
            const scheduleArray = Array.isArray(response.data.data) ? response.data.data : [];
            setSchedules(scheduleArray);
            
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

    const countries = ['Dubai', 'United States', 'Canada', 'United Kingdom', 'Australia', 'India'];

    const voyage = ['All', 'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']

    console.log("schedules list : ", schedules)

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB');
    };
    
    const handleVessel = () => {
        setByVessel(true);
        setByPort(false);
    };

    const handlePort = () => {
        setByPort(true);
        setByVessel(false);
    };

    return (
        <div>
            <div className='flex'>
            
                <Sidebar />

                <div className='w-[90%] md:w-[80%] h-full my-10 mx-6 flex flex-col gap-10'>
                    <Header />

                    <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
                        <h3 className='text-[26px] leading-[56px] font-medium'>Schedule</h3>
                                
                        <a href="/">
                            <button className='w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white font-medium text-[14px] flex justify-center items-center gap-2 '> 
                                <FaXmark className='mt-[2px]'/>
                                Close
                            </button>
                        </a>
                    </div>

                    <div className='flex flex-col md:flex-row gap-6 md:gap-16'>
                        <label>
                            <input 
                                type="radio" 
                                name="radio1" 
                                value="vessel"  
                                className='mr-2' 
                                onClick={handleVessel}
                                checked={byVessel}
                            />
                            List by Vessel Name
                        </label>

                        <label>
                            <input 
                                type="radio" 
                                name="radio2" 
                                value="orginPort" 
                                className='mr-2' 
                                onClick={handlePort}
                                checked={byPort}
                            />
                            List by Origin Port
                        </label>
                    </div>
                    
                    {byVessel && (
                        <>
                            <div className='flex flex-col md:flex-row gap-12'>
                                <div className='flex flex-col'>
                                    <label className="text-[14px] mb-2">
                                        Select Vessel*
                                    </label>

                                    <select
                                        className="w-[300px] md:w-[200px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                        name="vessels"
                                        // value={formData.vessel_id}
                                        // onChange={handleChange}
                                        required
                                    >
                                        {vessels?.map((item) => (
                                            <option key={item.uuid} value={item.uuid} className='text-[16px]'>{item.name}</option>
                                        ))}

                                    </select>
                                </div>


                                <div className='flex flex-col'>
                                    <label className="text-[14px] mb-2">
                                        Voyage Ref*
                                    </label>

                                    <select
                                        className="w-[300px] md:w-[200px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                        name="voyageRef"
                                        // value={formData.vessel_id}
                                        // onChange={handleChange}
                                        required
                                    >
                                        {voyage?.map((item) => (
                                            <option className='text-[16px]'>{item}</option>
                                        ))}

                                    </select>
                                </div>

                                <div className='flex flex-col'>
                                    <label className="text-[14px] mb-2">
                                        Transit Hub*
                                    </label>

                                    <select
                                        className="w-[300px] md:w-[200px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                        required
                                        name="transitHub"
                                        // value={formData.destination}
                                        // onChange={handleChange}

                                    >
                                        {/* {destinations.map((item) => (
                                            <option key={item.destination} value={item.destination} className='text-[16px]'>{item.destination}</option>
                                        ))} */}
                                        {countries.map((country, index) => (
                                            <option key={index} value={country}>{country}</option>
                                        ))}
                                        
                                    </select>
                                </div>


                                <div className='flex flex-col'>
                                    <label className="text-[14px] mb-2">
                                        Destination*
                                    </label>

                                    <select
                                        className="w-[300px] md:w-[200px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                        required
                                        name="destination"
                                        // value={formData.destination}
                                        // onChange={handleChange}

                                    >
                                        {destinations.map((item) => (
                                            <option key={item.destination} value={item.destination} className='text-[16px]'>{item.destination}</option>
                                        ))}
                                        
                                        
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-sm">
                                            <th className="py-2 px-4">No</th>
                                            <th className="py-2 px-4">Mother Vessel</th>
                                            <th className="py-2 px-4">Voyage Ref</th>
                                            <th className="py-2 px-4">CFS Closing</th>
                                            <th className="py-2 px-4">FCL Closing</th>
                                            <th className="py-2 px-4">Origin</th>
                                            <th className="py-2 px-4">ETD</th>
                                            <th className="py-2 px-4">ETA Dubai</th>
                                            <th className="py-2 px-4">ETA Europe</th>
                                            <th className="py-2 px-4">Transit Time</th>
                                            <th className="py-2 px-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules?.map((schedule, index) => (
                                            <tr key={schedule.id} className="border-t text-sm">
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4">{schedule.vessel_name}</td>
                                                <td className="py-3 px-4">{schedule.voyage_no}</td>
                                                <td className="py-3 px-4">{formatDate(schedule.cfs_closing)}</td>
                                                <td className="py-3 px-4">{formatDate(schedule.fcl_closing)}</td>
                                                <td className="py-3 px-4">{schedule.origin}</td>
                                                <td className="py-3 px-4 font-semibold">{formatDate(schedule.etd)}</td>
                                                <td className="py-3 px-4 font-semibold">{schedule.eta_dubai}</td>
                                                <td className="py-3 px-4">{schedule.eta_europe}</td>
                                                <td className="py-3 px-4">{schedule.transit_time} Days</td>
                                                <td className="py-3 px-4">
                                                    <FaEllipsis className='w-[24px] h-[24px]'/>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}


                    {byPort && (
                        <>
                            <div className='flex flex-col md:flex-row gap-12'>
                                <div className='flex flex-col'>
                                    <label className="text-[14px] mb-2">
                                        Select Country*
                                    </label>

                                    <select
                                        className="w-full md:w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                        name="country"
                                        // value={formData.vessel_id}
                                        // onChange={handleChange}
                                        required
                                    >
                                        {countries.map((country, index) => (
                                            <option key={index} value={country}>{country}</option>
                                        ))}

                                    </select>
                                </div>


                                <div className='flex flex-col'>
                                    <label className="text-[14px] mb-2">
                                        Select Port*
                                    </label>

                                    <select
                                        name='port_id'
                                        className="w-full md:w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                        required
                                        // value={formData.port_id}
                                        // onChange={handleChange}
                                    >
                                        {ports?.map((item) => (
                                            <option key={item.uuid} value={item.uuid} className='text-[16px]'>{item.origin}</option>
                                        ))}

                                    </select>
                                </div>

                                <div className='flex flex-col'>
                                    <label className="text-[14px] mb-2">
                                        Destination*
                                    </label>

                                    <select
                                        className="w-full md:w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                        required
                                        name="destination"
                                        // value={formData.destination}
                                        // onChange={handleChange}

                                    >
                                        {destinations.map((item) => (
                                            <option key={item.destination} value={item.destination} className='text-[16px]'>{item.destination}</option>
                                        ))}
                                        
                                        
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 text-left text-sm">
                                            <th className="py-2 px-4">No</th>
                                            <th className="py-2 px-4">Mother Vessel</th>
                                            <th className="py-2 px-4">Voyage Ref</th>
                                            <th className="py-2 px-4">CFS Closing</th>
                                            <th className="py-2 px-4">FCL Closing</th>
                                            <th className="py-2 px-4">Origin</th>
                                            <th className="py-2 px-4">ETD</th>
                                            <th className="py-2 px-4">ETA Dubai</th>
                                            <th className="py-2 px-4">ETA Europe</th>
                                            <th className="py-2 px-4">Transit Time</th>
                                            <th className="py-2 px-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules?.map((schedule, index) => (
                                            <tr key={schedule.id} className="border-t text-sm">
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4">{schedule.vessel_name}</td>
                                                <td className="py-3 px-4">{schedule.voyage_no}</td>
                                                <td className="py-3 px-4">{formatDate(schedule.cfs_closing)}</td>
                                                <td className="py-3 px-4">{formatDate(schedule.fcl_closing)}</td>
                                                <td className="py-3 px-4">{schedule.origin}</td>
                                                <td className="py-3 px-4 font-semibold">{formatDate(schedule.etd)}</td>
                                                <td className="py-3 px-4 font-semibold">{schedule.eta_dubai}</td>
                                                <td className="py-3 px-4">{schedule.eta_europe}</td>
                                                <td className="py-3 px-4">{schedule.transit_time} Days</td>
                                                <td className="py-3 px-4">
                                                    <FaEllipsis className='w-[24px] h-[24px]'/>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
