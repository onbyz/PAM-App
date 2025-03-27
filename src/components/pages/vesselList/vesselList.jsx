import React, { useState } from 'react';

import Sidebar from '../../layouts/Sidebar';

import Header from '../../layouts/Header';
import ClockIcon from "../../../assets/icons/clock.svg";
import VesselIcon from "../../../assets/icons/box.svg";
import PortIcon from "../../../assets/icons/AnchorSimple.svg";
import UserIcon from "../../../assets/icons/user-octagon.svg";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
// import { useForm } from "react-hook-form";

export default function VesselList() {
  
    
  const sidebarTitles = [
    {id : "1", icon: ClockIcon, title : "Schedule Management", path: "/edit-schedule",active:1 },
    {id : "2", icon: VesselIcon, title : "Vessel Management",path: "/vessel-list",active:0  },
    {id : "3", icon: PortIcon, title : "Port Management",path: "/schedule",active:1 },
    {id : "4", icon: UserIcon, title : "User Management",path: "/schedule",active:1 },
  ] 
  const [selectedCountry, setSelectedCountry] = useState('United Kingdom');

  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India'];
const pageTitle = "Vessel List";
  return (
    <div> 
     
      <div className='flex'>
        {/* <div className='w-[20%] h-[screen] bg-[#FCFCFC] mx-6'>
          <img src={Logo} alt='Logo' className='h-[65px] w-[170px]'/>

          <div className='mt-24'>
            {sidebarTitles.map((item, index) => (
              <div className='flex gap-2 mt-4' key={index}>
                <img src={item.icon} alt="icon" className='w-[24px] h-[24px] mt-[3px]'  />
                <h6 className={`text-[16px] leading-[24px] font-normal ${index === 0 ? "text-[#16A34A]" : "text-black"}`}>{item.title}</h6>
              </div>
            ))}
          </div>
          
          <div className='flex gap-2 mt-4'>
            <img src={SettingsIcon} alt='Logo' className='w-[24px] h-[24px]' />
            <h6 className='text-[16px] leading-[24px] font-normal'>Settings</h6>
          </div>

          <div className='flex gap-2 mt-4'>
            <img src={LogoutIcon} alt='Logo' className='w-[24px] h-[24px]' />
            <h6 className='text-[16px] leading-[24px] font-normal text-[#FF3B30]'>Logout</h6>
          </div>
        </div> */}

<Sidebar 
        sidebarTitles={sidebarTitles}
        />

        {/* <div className='w-[20%] h-[1100px] bg-[#FCFCFC] px-6 flex flex-col justify-between'>
          <div>
            <img src={Logo} alt='Logo' className='w-[170px] mt-6' />

            <div className='mt-24'>
              {sidebarTitles.map((item, index) => (
                <div className='flex gap-2 mt-4' key={index}>
                  <img src={item.icon} alt='icon' className='w-[24px] h-[24px] mt-[3px]' />
                  <h6 className={`text-[16px] leading-[24px] font-normal ${index === 0 ? 'text-[#16A34A]' : 'text-black'}`}>
                    {item.title}
                  </h6>
                </div>
              ))}
            </div>
          </div>

          <div className='pb-24'>
            <div className='flex gap-2 mt-4'>
              <img src={SettingsIcon} alt='Settings' className='w-[24px] h-[24px]' />
              <h6 className='text-[16px] leading-[24px] font-normal'>Settings</h6>
            </div>

            <div className='flex gap-2 mt-4'>
              <img src={LogoutIcon} alt='Logout' className='w-[24px] h-[24px]' />
              <h6 className='text-[16px] leading-[24px] font-normal text-[#FF3B30]'>Logout</h6>
            </div>
          </div>
        </div> */}

        <div className='w-[80%] h-full my-10 mx-6'>
          <Header pageTitle={pageTitle} />
          
          {/* <div className='flex justify-between'>
            <h3 className='text-[28px] leading-[150%] font-medium'>Welcome, Joel</h3>

            <div className='flex gap-6'>
              <img src={SearchIcon} alt="Icon" className='w-[24px] h-[24px]' />
              <img src={BellIcon} alt="Icon" className='w-[24px] h-[24px]' />

              <div className='flex gap-2'>
                <img src={Avatar} alt="Icon" className='w-[24px] h-[24px]' />
              
                <p className='text-[16px] leading-[24px] font-normal flex gap-3'>
                  Joel Sebastian
                  <FaChevronDown className='w-[12px] h-[24px]' />
                </p>
              </div>
            </div>
          </div> */}

         {/*  <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
            <h4 className='text-[26px] leading-[56px] font-medium'>{pageTitle}</h4>

            <button className='w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white font-medium text-[14px] flex justify-center items-center gap-2 '> 
              <FaXmark className='mt-[2px]'/>
              Close
            </button>
          </div> */}

          <div className='mt-4'>
            <p className='text-[16px] text-[#16A34A] border-b-[1px] font-medium border-[#0000001A] pb-4'>
              Origin Port
            </p>
          </div>

          <div>
            <form className='my-8'>
              <div className='flex gap-12'>
                <div className='flex flex-col'>
                  <label htmlFor="country" className="text-[14px] font-medium mb-2">
                    Choose Country
                  </label>

                  <select
                    id="country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                  >
                    <option value="" disabled className='text-[16px]'>Select a country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>{country}</option>
                    ))}
                  </select>
                  {/* <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-red-600" /> */}
                </div>


                <div className='flex flex-col'>
                  <label htmlFor="country" className="text-[14px] font-medium mb-2">
                    Choose Name of Origin Port
                  </label>

                  <select
                    id="originPort"
                    className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                  >
                    <option value="" disabled className='text-[16px]'></option>
                    <option value="port 1" className='text-[16px]'>Port 1</option>
                    <option value="port 2" className='text-[16px]'>Port 2</option>
                    <option value="port 3" className='text-[16px]'>Port 3</option>
                    <option value="port 4" className='text-[16px]'>Port 4</option>
                    <option value="port 5" className='text-[16px]'>Port 5</option>
                  </select>
                  {/* <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-red-600" /> */}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="etd" className="text-[14px] font-medium mb-2">
                    Enter ETD
                  </label>

                  <div className="relative w-[300px]">
                    <input
                      id="etd"
                      type="date"
                      className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                      placeholder=''
                       value='2025-03-18'
                    />  
                  </div>
                </div>
              </div>

              <div className='my-8'>
                <p className='text-[16px] text-[#16A34A] border-b-[1px] font-medium border-[#0000001A] pb-4'>
                  Vessel, Voyage, CFS & FCL
                </p>
              </div>

              <div className='flex gap-8'>
                <div className='flex flex-col'>
                  <label htmlFor="country" className="text-[14px] font-medium mb-2">
                    Choose Vessel
                  </label>

                  <select
                    id="vessel"
                    className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                  >
                    <option value="" disabled className='text-[16px]'></option>
                    <option value="Vessel 1" className='text-[14px]'>Vessel 1</option>
                    <option value="Vessel 2" className='text-[14px]'>Vessel 2</option>
                    <option value="Vessel 3" className='text-[14px]'>Vessel 3</option>
                    <option value="Vessel 4" className='text-[14px]'>Vessel 4</option>
                    <option value="Vessel 5" className='text-[14px]'>Vessel 5</option>
                  </select>
                  {/* <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-red-600" /> */}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="country" className="text-[14px] font-medium mb-2">
                    Voyage No
                  </label>

                  <input className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" value="037W">
                  </input>
                  
                </div>
              </div>

              <div className='flex gap-8 my-8'>
                <div className="flex flex-col">
                  <label htmlFor="etd" className="text-[14px] font-medium mb-2">
                    CFS Closing
                  </label>

                  <div className="relative w-[300px]">
                    <input
                      id="etd"
                      type="date"
                      className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                      placeholder=''
                      value='2025-03-18'
                    />  
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="etd" className="text-[14px] font-medium mb-2">
                    FCL Closing
                  </label>

                  <div className="relative w-[300px]">
                    <input
                      id="etd"
                      type="date"
                      className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                      placeholder=''
                      value='2025-03-18'
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
                  <label htmlFor="etd" className="text-[14px] font-medium mb-2">
                    Enter ETA Dubai
                  </label>

                  <div className="relative w-[300px]">
                    <input
                      id="etd"
                      type="date"
                      className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                      placeholder=''
                       value='2025-03-18'
                    />  
                  </div>
                </div>

              <div className='my-8'>
                <p className='text-[16px] text-[#16A34A] border-b-[1px] font-medium border-[#0000001A] pb-4'>
                  Destination
                </p>
              </div>

              <div className='flex gap-12'>
                <div className='flex flex-col'>
                  <label htmlFor="country" className="text-[14px] font-medium mb-2">
                    Choose Name of Destination
                  </label>

                  <select
                    id="country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                  >
                    <option value="" disabled className='text-[16px]'></option>
                    <option value="Destination 1" className='text-[16px]'>Destination 1</option>
                    <option value="Destination 2" className='text-[16px]'>Destination 2</option>
                    <option value="Destination 3" className='text-[16px]'>Destination 3</option>
                    <option value="Destination 4" className='text-[16px]'>Destination 4</option>
                    <option value="Destination 5" className='text-[16px]'>Destination 5</option>
                  </select>
                  {/* <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-red-600" /> */}
                </div>


                <div className="flex flex-col">
                  <label htmlFor="etd" className="text-[14px] font-medium mb-2">
                    Enter ETA
                  </label>

                  <div className="relative w-[300px]">
                    <input
                      id="etd"
                      type="date"
                      className="w-full h-[40px] border border-[#E2E8F0] rounded-md px-3 pr-10 focus:outline-none appearance-none bg-white"
                      placeholder=''
                       value='2025-03-18'
                    />  
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="country" className="text-[14px] font-medium mb-2">
                    Transit Time
                  </label>

                  <input className="w-[300px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white" value="10 Days">
                  </input>
                  
                </div>
              </div>
              
              <div className='flex gap-6 mt-8'>
                <button className='w-[80px] h-[40px] bg-[#16A34A] rounded-md text-white font-medium text-[14px] flex justify-center items-center gap-2 '> 
                  Save
                </button>

                <button className='w-[80px] h-[40px] font-medium text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white'> 
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> 
    </div>
  );
}
