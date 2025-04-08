import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaXmark, FaEllipsis, FaPlus } from "react-icons/fa6";

export default function VesselManangement() {

  const tableData =[
    {id : "1", mother_vessel: "COSCO SHIPPING PLANET", added_on: "04-03-2025"},
    {id : "2", mother_vessel: "CMA CGM NEVADA", added_on: "05-03-2025"},
    {id : "3", mother_vessel: "CSCL URANUS", added_on: "08-03-2025"}
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
            
            <Link to="/add-vessel">
              <button className='w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                <FaPlus className='mt-[2px]'/>
                Add Vessel
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
                                    <th>No</th>
                                    <th>Mother Vessel</th>
                                    <th>Added On</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, index) => (
                                        <tr key={index} className='border-[1px] border-[#E6EDFF]'>
                                        <td>{(index + 1)}</td>
                                        <td>{row.mother_vessel}</td>
                                        <td>{row.added_on}</td>
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