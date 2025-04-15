import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaXmark, FaPlus, FaRegPenToSquare, FaTrash } from "react-icons/fa6";

export default function VesselManangement() {
  const [tableData, setTableData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel`);
      setTableData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (uuid) => {
    if (confirm("Are you sure you want to delete this vessel?")) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel/${uuid}/delete`);
        if (response.status === 200) {
          setSuccessMessage("Vessel deleted successfully");
          setTableData((prevData) => prevData.filter((item) => item.uuid !== uuid));
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Error deleting vessel");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        console.error("Error deleting vessel:", error);
      }
    }
  };

  return (
    <div>
      <div>
        <div className="md:mr-[2.5%]">
          <div className="mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2">
            <h4 className="leading-[56px]">Vessel Management</h4>

            <Link to="/vessel-management/add-vessel">
              <button className="w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 ">
                <FaPlus className="mt-[2px]" />
                Add Vessel
              </button>
            </Link>
          </div>

          {successMessage && (
            <div className="w-full bg-green-100 text-green-800 text-start p-3 rounded-md my-6 flex justify-between">
              {successMessage}
              <FaXmark className="mt-[2px] hover:cursor-pointer" onClick={() => setSuccessMessage("")} />
            </div>
          )}

          {errorMessage && (
            <div className="w-full bg-red-100 text-red-600 text-start p-3 rounded-md my-6 flex justify-between">
              {errorMessage}
              <FaXmark className="mt-[2px] hover:cursor-pointer" onClick={() => setErrorMessage("")} />
            </div>
          )}

          <div>
            <div className="overflow-auto">
              <table className="border-[#E6EDFF] border-[1px] w-full rounded-lg mt-6">
                <thead>
                  <tr className="border-[1px] border-[#E6EDFF]">
                    <th>No</th>
                    <th>Mother Vessel</th>
                    <th>Added On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className="border-[1px] border-[#E6EDFF]">
                      <td>{index + 1}</td>
                      <td>{row.name}</td>
                      <td>{new Date(row.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 cursor-pointer flex gap-6">
                        <div className="relative group inline-block">
                          <Link to={`/vessel-management/edit-vessel/${row.uuid}`}>
                            <FaRegPenToSquare className="text-black hover:text-gray-600 cursor-pointer w-[20px] h-[20px]" />
                            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">Edit</div>
                          </Link>
                        </div>

                        <div className="relative group inline-block">
                          <FaTrash className="text-black hover:text-red-600 cursor-pointer w-[20px] h-[20px]" onClick={() => handleDelete(row.uuid)} />
                          <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">Delete</div>
                        </div>
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
