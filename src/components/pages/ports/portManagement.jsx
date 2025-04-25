import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaXmark, FaPlus, FaRegPenToSquare, FaTrash } from "react-icons/fa6";

export default function PortManagement() {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port`);
      const data = response.data?.data || [];
      setTableData(data);
      setFilteredData(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch port data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on search query
    const filtered = tableData.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    
    // Reset to first page when search changes
    setCurrentPage(1);
    // Clear selections when filtering
    setSelectedItems([]);
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
    if (confirm("Are you sure you want to delete this port?")) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port/${uuid}/delete`);
        if (response.status === 200) {
          setSuccessMessage("Port deleted successfully");
          setTableData((prevData) => prevData.filter((item) => item.uuid !== uuid));
          // Clear the deleted item from selection if it was selected
          setSelectedItems(prev => prev.filter(id => id !== uuid));
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Error deleting port");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
        console.error("Error deleting port:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedItems.length} selected port(s)?`)) {
      // Track successful deletions to update the table
      const successfulDeletions = [];
      const failedDeletions = [];
      
      // Delete each selected item
      for (const uuid of selectedItems) {
        try {
          const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port/${uuid}/delete`);
          if (response.status === 200) {
            successfulDeletions.push(uuid);
          }
        } catch (error) {
          failedDeletions.push(uuid);
          console.error(`Error deleting port ${uuid}:`, error);
        }
      }
      
      if (successfulDeletions.length > 0) {
        // Update table data by removing successfully deleted items
        setTableData(prevData => prevData.filter(item => !successfulDeletions.includes(item.uuid)));
        
        // Clear selected items
        setSelectedItems([]);
        
        setSuccessMessage(`Successfully deleted ${successfulDeletions.length} port(s)`);
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
      
      if (failedDeletions.length > 0) {
        setErrorMessage(`Failed to delete ${failedDeletions.length} port(s)`);
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
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

  const toggleSelectItem = (uuid) => {
    setSelectedItems(prev => {
      if (prev.includes(uuid)) {
        return prev.filter(id => id !== uuid);
      } else {
        return [...prev, uuid];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      const currentItemIds = currentItems.map(item => item.uuid);
      setSelectedItems(currentItemIds);
    }
  };

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Check if all current items are selected
  const allCurrentItemsSelected = 
    currentItems.length > 0 && 
    currentItems.every(item => selectedItems.includes(item.uuid));

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
            <h4 className="leading-[56px]">Port Management</h4>

            <Link to="/port-management/add-port">
              <button className="w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2">
                <FaPlus className="mt-[2px]" />
                Add Port
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

                <div className="flex items-center space-x-2">
                  {selectedItems.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="px-4 py-1 border border-red-600 text-red-600 rounded-md text-sm flex items-center gap-2 whitespace-nowrap"
                    >
                      <FaTrash className="w-[12px] h-[12px]" />
                      <span>Delete Selected</span>
                    </button>
                  )}
                  
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
                    <th className="w-12">
                      <input
                        type="checkbox"
                        checked={allCurrentItemsSelected && currentItems.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th>SI No.</th>
                    <th>Port Name</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((row, index) => (
                      <tr key={row.uuid} className="border-[1px] border-[#E6EDFF]">
                        <td className="">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(row.uuid)}
                            onChange={() => toggleSelectItem(row.uuid)}
                            className="w-4 h-4" 
                          />
                        </td>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{row.name}</td>
                        <td>{row.country}</td>
                        <td className="py-3 px-4 cursor-pointer flex gap-6">
                          <div className="relative group inline-block">
                            <Link to={`/port-management/edit-port/${row.uuid}`}>
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
                      <td colSpan="5" className="text-center py-4">
                        {searchQuery ? "No matching ports found" : "No ports available"}
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
                    className={`px-3 py-1 rounded ${currentPage === number ? ' text-black border' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
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