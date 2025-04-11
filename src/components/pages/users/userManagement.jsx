import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaXmark, FaEllipsis, FaPlus } from "react-icons/fa6";

export default function UserManangement() {

  const tableData =[
    {id : "1", name: "Joel Sebastian", email: "joel@pamcargo.com", role: "Data Management", added_on: "04-03-2025", status: "Active"},
    {id : "2", name: "Yadhu Lal", email: "yadhu@pamcargo.com", role: "Data Management", added_on: "05-03-2025", status: "Invited"},
    {id : "3", name: "Vivek Gopal", email: "vivek@pamcargo.com", role: "Administrator", added_on: "11-03-2025", status: "Active"},
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
            <h4 className='leading-[56px]'>User Management</h4>
            
            <Link to="/user-management/invite-user">
              <button className='w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                <FaPlus className='mt-[2px]'/>
                Invite User
              </button>
            </Link>
          </div>

        {/*
          {successMessage && (
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Added On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className='border-[1px] border-[#E6EDFF]'>
                      <td>{(index + 1)}</td>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.role}</td>
                      <td>{row.added_on}</td>
                      <td className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            row.status === "Active" ? "bg-green-500" : row.status === "Invited" ? "bg-yellow-400" : "bg-gray-400"
                          }`}
                        ></span>
                        <span>{row.status}</span>
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