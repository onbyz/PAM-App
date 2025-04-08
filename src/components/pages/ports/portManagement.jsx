import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaXmark, FaEllipsis, FaPlus } from "react-icons/fa6";

export default function VesselManangement() {

  const tableData =[
    {id : "1", port_name : "CHITAGONG VIA DUBAI", voyage_ref: "BANGLADESH"},
    {id : "2", port_name : "SIHANOUKVILLE VIA SINGAPORE", voyage_ref: "CAMBODIA"},
    {id : "3", port_name : "DALIAN VIA SINGAPORE", voyage_ref: "CHINA"},
    {id : "4", port_name : "CHENNAI VIA DUBAI", voyage_ref: "INDIA"},
  ]

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div>
      <div>
        <div className='md:mr-[2.5%]'>
          <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
            <h4 className='leading-[56px]'>Vessel Management</h4>
            
            <Link to="/add-port">
              <button className='w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                <FaPlus className='mt-[2px]'/>
                Add Port
              </button>
            </Link>
          </div>

          {/*{successMessage && (
            <div className="w-full bg-green-100 text-green-800 text-start p-3 rounded-md my-6 flex justify-between">
              {successMessage}
              <FaXmark className='mt-[2px] hover:cursor-pointer' onClick={() => setSuccessMessage("")}/>
            </div>
          )}

        {errorMessage && (
            <div className="w-full bg-red-100 text-red-600 text-start p-3 rounded-md my-6 flex justify-between">
              {errorMessage}
              <FaXmark className='mt-[2px] hover:cursor-pointer' onClick={() => setErrorMessage("")}/>
            </div>
          )}
*/}

          <div>

          <div className='overflow-auto'>
                            <table className="border-[#E6EDFF] border-[1px] w-full rounded-lg mt-6">
                                <thead>
                                    <tr className='border-[1px] border-[#E6EDFF]'>
                                    <th>SI No.</th>
                                    <th>Port Name</th>
                                    <th>Voyage Ref</th>
                                    <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, index) => (
                                        <tr key={index} className='border-[1px] border-[#E6EDFF]'>
                                        <td>{(index + 1)}</td>
                                        <td>{row.port_name}</td>
                                        <td>{row.voyage_ref}</td>
                                        <td className="py-3 px-4 cursor-pointer">
                                            <FaEllipsis className='w-[24px] h-[24px]'/>
                                        </td>
                                        </tr>
                                    ))}
                                    
                                </tbody>
                            </table>
                        </div>
          </div>
        </div>
      </div>
    </div>
  );
}