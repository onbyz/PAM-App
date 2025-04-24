import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaXmark, FaPlus, FaRegPenToSquare, FaTrash } from "react-icons/fa6";

export default function VesselManangement() {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel`);
      const data = response.data?.data || [];
      setTableData(data);
      setFilteredData(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch vessel data");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on search query
    const filtered = tableData.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery, tableData]);

  useEffect(() => {
    // Recalculate total pages when items per page changes or filtered data changes
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    // Reset to first page when changing items per page
    if (currentPage > Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredData, itemsPerPage]);

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
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Display a limited number of page buttons
  const getPageRange = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust if we're at the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700">entries</span>
                </div>
                <div className="">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border border-gray-300 px-2 py-1 text-sm w-full focus:outline-none"
                  />
                </div>
              </div>
              
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
                  {currentItems.length > 0 ? (
                    currentItems.map((row, index) => (
                      <tr key={row.uuid} className="border-[1px] border-[#E6EDFF]">
                        <td>{indexOfFirstItem + index + 1}</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        {searchQuery ? "No matching vessels found" : "No vessels available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4 pb-4">
              <div className="text-sm text-gray-700">
                Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black'}`}
                >
                  Prev
                </button>
                
                {getPageRange().map(number => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-3 py-1 rounded ${currentPage === number ? 'text-black border' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-black'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}