import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaXmark, FaPlus, FaRegPenToSquare, FaTrash } from "react-icons/fa6";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import api from '@/lib/api';

export default function RegisteredUsers() {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/subscribers`);
      const data = response.data?.data || [];
      setTableData(data);
      setFilteredData(data);
      if (!showAll) {
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to fetch user data");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on search query across name and email fields
    const filtered = tableData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);

    if (!showAll) {
      setCurrentPage(1);
    }
    setSelectedItems([]);
  }, [searchQuery, tableData]);

  useEffect(() => {
    if (!showAll) {
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      if (currentPage > Math.ceil(filteredData.length / itemsPerPage)) {
        setCurrentPage(1);
      }
    }
  }, [filteredData, itemsPerPage, showAll]);

  const handleDelete = async (id) => {
    try {
      // In a real implementation, replace with API call
      const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/subscribers/${id}/delete`);
      if (response.status === 200) {
        setSuccessMessage("User deleted successfully");
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
        // Clear the deleted item from selection if it was selected
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error deleting user");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      console.error("Error deleting user:", error);
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const openDeleteDialog = (id) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const openBulkDeleteDialog = () => {
    if (selectedItems.length > 0) {
      setIsBulkDeleteDialogOpen(true);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    // Track successful deletions to update the table
    const successfulDeletions = [];
    const failedDeletions = [];

    // In a real implementation, use API calls for each deletion
    for (const id of selectedItems) {
      try {
        const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/subscribers/${id}/delete`);
        if (response.status === 200) {
          successfulDeletions.push(id);
        }
      } catch (error) {
        failedDeletions.push(id);
        console.error(`Error deleting user ${id}:`, error);
      }
    }

    if (successfulDeletions.length > 0) {
      // Update table data by removing successfully deleted items
      setTableData(prevData => prevData.filter(item => !successfulDeletions.includes(item.id)));

      // Clear selected items
      setSelectedItems([]);

      setSuccessMessage(`Successfully deleted ${successfulDeletions.length} user(s)`);
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }

    if (failedDeletions.length > 0) {
      setErrorMessage(`Failed to delete ${failedDeletions.length} user(s)`);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
    setIsBulkDeleteDialogOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    
    if (value === "all") {
      setShowAll(true);
      setItemsPerPage(filteredData.length || 1); // Set to total items or 1 to avoid division by zero
    } else {
      setShowAll(false);
      setItemsPerPage(Number(value));
      setCurrentPage(1); // Reset to first page when changing items per page
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const formattedDate = (date) => date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      const currentItemIds = currentItems.map(item => item.id);
      setSelectedItems(currentItemIds);
    }
  };

  // Get current items  - show all if showAll is true, otherwise paginate
  const getCurrentItems = () => {
    if (showAll) {
      return filteredData;
    } else {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    }
  };

  const currentItems = getCurrentItems();

  // Check if all current items are selected
  const allCurrentItemsSelected =
    currentItems.length > 0 &&
    currentItems.every(item => selectedItems.includes(item.id));

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

  // Calculate display info for pagination summary
  const getDisplayInfo = () => {
    if (showAll) {
      return {
        start: filteredData.length > 0 ? 1 : 0,
        end: filteredData.length,
        total: filteredData.length
      };
    } else {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      return {
        start: filteredData.length > 0 ? indexOfFirstItem + 1 : 0,
        end: Math.min(indexOfLastItem, filteredData.length),
        total: filteredData.length
      };
    }
  };

  const displayInfo = getDisplayInfo();

  return (
    <div>
      <div>
        <div className="md:mr-[2.5%]">
          <div className="mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2">
            <h4 className="leading-[56px] text-[26px] font-medium">Registered Users</h4>

            <Link to="/registered-users/add">
              <button className="w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2">
                <FaPlus className="mt-[2px]" />
                Add Users
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
                    value={showAll ? "all" : itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value="all">All</option>
                  </select>
                  <span className="text-sm text-gray-700">entries</span>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedItems.length > 0 && (
                    <button
                      onClick={openBulkDeleteDialog}
                      className="px-4 py-1 border border-red-600 text-red-600 rounded-md text-sm flex items-center gap-2 whitespace-nowrap"
                    >
                      <FaTrash className="w-[12px] h-[12px]" />
                      <span>Delete Selected ({selectedItems.length})</span>
                    </button>
                  )}

                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border border-gray-300 px-2 py-1 text-sm w-full focus:outline-none rounded"
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
                    <th>No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date Added</th>
                    <th>Last accessed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((row, index) => {
                      // Calculate the correct serial number based on whether we're showing all or paginated
                      const serialNumber = showAll 
                        ? index + 1 
                        : ((currentPage - 1) * itemsPerPage) + index + 1;
                      
                      return (
                        <tr key={row.id} className="border-[1px] border-[#E6EDFF]">
                          <td className="">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(row.id)}
                              onChange={() => toggleSelectItem(row.id)}
                              className="w-4 h-4"
                            />
                          </td>
                          <td>{serialNumber}</td>
                          <td>{row.name}</td>
                          <td>{row.email}</td>
                          <td>{new Date(row.created_at)?.toLocaleDateString()}</td>
                          <td>{formattedDate(new Date(row.last_access))}</td>
                          <td className="py-3 px-4 cursor-pointer flex gap-6">
                            <div className="relative group inline-block">
                              <Link to={`/registered-users/edit/${row.id}`}>
                                <FaRegPenToSquare className="text-black hover:text-gray-600 cursor-pointer w-[20px] h-[20px]" />
                                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">Edit</div>
                              </Link>
                            </div>

                            <div className="relative group inline-block">
                              <FaTrash className="text-black hover:text-red-600 cursor-pointer w-[20px] h-[20px]" onClick={() => openDeleteDialog(row.id)} />
                              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">Delete</div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        {searchQuery ? "No matching users found" : "No users available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls - Only show when not displaying all items */}
            {!showAll && (
              <div className="flex items-center justify-between mt-4 pb-4">
                <div className="text-sm text-gray-700">
                  Showing {displayInfo.start} to {displayInfo.end} of {displayInfo.total} entries
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
            )}

            {/* Show total count when displaying all items */}
            {showAll && (
              <div className="flex items-center justify-between mt-4 pb-4">
                <div className="text-sm text-gray-700">
                  Showing all {displayInfo.total} entries
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDelete(userToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedItems.length === 1 ? 'Delete User' : 'Delete Multiple Users'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.length} selected user(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700">
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}