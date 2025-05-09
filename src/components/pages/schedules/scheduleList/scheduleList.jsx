import { useState, useEffect } from "react"
import { FaXmark, FaPlus, FaRegPenToSquare, FaTrash } from "react-icons/fa6"
import { Link } from "react-router-dom"
import styles from "./scheduleList.module.css"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import api from "@/lib/api"

export default function ScheduleList() {
  const [filterBy, setFilterBy] = useState("origin") // 'vessel' or 'origin'

  // For vessel filter
  const [selectedVessel, setSelectedVessel] = useState("")
  const [selectedVoyage, setSelectedVoyage] = useState("")
  const [selectedTransit, setSelectedTransit] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")

  // For origin port filter
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedPort, setSelectedPort] = useState("")
  const [selectedOriginDestination, setSelectedOriginDestination] = useState("")

  // Options for dropdowns
  const [vesselOptions, setVesselOptions] = useState([])
  const [voyageOptions, setVoyageOptions] = useState([])
  const [transitOptions, setTransitOptions] = useState([])
  const [destinationOptions, setDestinationOptions] = useState([])
  const [countryOptions, setCountryOptions] = useState([])
  const [portOptions, setPortOptions] = useState([])
  const [originDestinationOptions, setOriginDestinationOptions] = useState([])

  // Table data
  const [tableData, setTableData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredData, setFilteredData] = useState([])

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Selection state
  const [selectedItems, setSelectedItems] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState(null)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  // Initial api for vessel names or countries based on filter type
  useEffect(() => {
    if (filterBy === "vessel") {
      fetchVesselNames()
      fetchInitialTable()
    } else {
      fetchCountries()
      fetchInitialTable()
    }
  }, [filterBy])

  // Update filtered data when table data or search query changes
  useEffect(() => {
    let filtered = [...tableData]

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          (item.vessel_name && item.vessel_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.voyage_no && item.voyage_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.origin && item.origin.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredData(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))

    // Reset to first page when filtering
    setCurrentPage(1)
    // Clear selections when filtering
    setSelectedItems([])
  }, [tableData, searchQuery, itemsPerPage])

  // Fetch vessel names
  const fetchVesselNames = async () => {
    try {
      const response = await api(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel`)
      const { data } = response.data
      setVesselOptions(data || [])
    } catch (error) {
      console.error("Error fetching vessel names:", error)
    }
  }

  // Fetch countries for origin port filter
  const fetchCountries = async () => {
    try {
      const countries = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/countries`)
      const data = countries.data?.data || []
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name))
      setCountryOptions(sortedData)
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  // Fetch ports based on selected country
  const fetchPorts = async (country) => {
    if (!country) return

    try {
      const response = await api(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port?countryID=${country}`)
      const { data } = response.data
      setPortOptions(data || [])
    } catch (error) {
      console.error("Error fetching ports:", error)
      // Fallback data if API is not available
      setPortOptions([{ uuid: "CGP-DXB", name: "BANGLADESH - CHITTAGONG VIA DUBAI" }])
    }

    setSelectedPort("")
    setSelectedOriginDestination("")
    setOriginDestinationOptions([])
  }

  // Fetch destinations for origin port
  const fetchOriginDestinations = async (port) => {
    if (!port) return

    try {
      const response = await api(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/destinations?transitHub=${port}&counrty=${selectedCountry}`,
      )
      const { data } = response.data
      setOriginDestinationOptions(data || [])
    } catch (error) {
      console.error("Error fetching origin destinations:", error)
    }

    setSelectedOriginDestination("")
  }

  // Fetch voyage references based on selected vessel
  const fetchVoyageRefs = async (vessel) => {
    if (!vessel) return

    try {
      const response = await api(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/voyages/${vessel}`)
      const { data } = response.data
      setVoyageOptions(data || [])

      const vesselResponse = await api(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule?vesselID=${vessel}`)
      const vesselData = vesselResponse.data?.data || []
      setTableData(vesselData)
      setFilteredData(vesselData)
    } catch (error) {
      console.error("Error fetching voyage refs:", error)
    }

    setSelectedVoyage("")
    setSelectedTransit("")
    setSelectedDestination("")
    setTransitOptions([])
    setDestinationOptions([])
  }

  // Fetch transit hubs based on selected vessel and voyage
  const fetchTransitHubs = async (vessel, voyage) => {
    if (!vessel || !voyage) return

    try {
      const response = await api(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/ports?voyageRef=${voyage}&vesselID=${selectedVessel}`,
      )
      const { data } = response.data
      setTransitOptions(data || [])

      const voyageResponse = await api(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule?vesselID=${vessel}&voyageRef=${voyage}`
      )
      const voyageData = voyageResponse.data?.data || []
      setTableData(voyageData)
      setFilteredData(voyageData)
    } catch (error) {
      console.error("Error fetching transit hubs:", error)
    }

    setSelectedTransit("")
    setSelectedDestination("")
    setDestinationOptions([])
  }

  // Fetch destinations based on selected vessel, voyage, and transit
  const fetchDestinations = async (vessel, voyage, transit) => {
    if (!vessel || !voyage || !transit) return

    try {
      const response = await api(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/destinations?vesselID=${vessel}&voyageRef=${voyage}&transitHub=${transit}`,
      )
      const { data } = response.data
      setDestinationOptions(data || [])

      const transitResponse = await api(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule?vesselID=${vessel}&voyageRef=${voyage}&transitHub=${transit}`
      )
      const transitData = transitResponse.data?.data || []
      // setTableData(transitData)
      setFilteredData(transitData)
    } catch (error) {
      console.error("Error fetching destinations:", error)
    }

    setSelectedDestination("")
  }

  //Fetch Initial Table Data
  const fetchInitialTable = async () => {
    try {
      const response = await api(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule`)
      const { data } = response.data
      setTableData(data || [])
      setFilteredData(data || [])
      setTotalPages(Math.ceil((data || []).length / itemsPerPage))
    } catch (error) {
      console.error("Error fetching origin table data:", error)
    }
  }

  // Fetch table data based on vessel filter
  const fetchVesselTableData = async () => {
    if (!selectedVessel || !selectedVoyage || !selectedTransit || !selectedDestination) return

    try {
      const response = await api(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule?vesselID=${selectedVessel}&voyageRef=${selectedVoyage}&transitHub=${selectedTransit}&destination=${selectedDestination}`,
      )
      const { data } = response.data
      setTableData(data || [])
      setFilteredData(data || [])
      setTotalPages(Math.ceil((data || []).length / itemsPerPage))
      setCurrentPage(1)
      setSelectedItems([])
    } catch (error) {
      console.error("Error fetching vessel table data:", error)
    }
  }

  // Fetch table data based on origin port filter
  const fetchOriginTableData = async () => {
    if (!selectedCountry || !selectedPort || !selectedOriginDestination) return

    try {
      const response = await api(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule?country=${selectedCountry}&transitID=${selectedPort}&destination=${selectedOriginDestination}`,
      )
      const { data } = response.data
      // setTableData(data || [])
      setFilteredData(data || [])
      setTotalPages(Math.ceil((data || []).length / itemsPerPage))
      setCurrentPage(1)
      setSelectedItems([])
    } catch (error) {
      console.error("Error fetching origin table data:", error)
    }
  }

  // Handle vessel selection
  const handleVesselChange = (e) => {
    const vessel = e.target.value
    setSelectedVessel(vessel)
    fetchVoyageRefs(vessel)
    setSelectedDestination(null)
    setSelectedTransit(null)
    setSelectedVoyage(null)
  }

  // Handle voyage selection
  const handleVoyageChange = (e) => {
    const voyage = e.target.value
    setSelectedVoyage(voyage)
    fetchTransitHubs(selectedVessel, voyage)
    setSelectedDestination(null)
    setSelectedTransit(null)
  }

  // Handle transit selection
  const handleTransitChange = (e) => {
    const transit = e.target.value
    setSelectedTransit(transit)
    setSelectedDestination(null)
    fetchDestinations(selectedVessel, selectedVoyage, transit)
  }

  // Handle destination selection
  const handleDestinationChange = (e) => {
    const destination = e.target.value
    setSelectedDestination(destination)

    if (selectedVessel && selectedVoyage && selectedTransit) {
      const filteredByDestination = filteredData.filter(item => item.destination === destination)
      setFilteredData(filteredByDestination)
    }
  }

  // Handle country selection for origin port filter
  const handleCountryChange = (e) => {
    const country = e.target.value
    setSelectedCountry(country)
    setSelectedPort(null)
    setOriginDestinationOptions(null)
    fetchPorts(country)
    const countryName = countryOptions.find((item) => item.uuid === country)?.name
    setFilteredData(tableData.filter((item) => item.country_name === countryName))
  }

  // Handle port selection for origin port filter
  const handlePortChange = (e) => {
    const port = e.target.value
    const selectedPort = portOptions.find((option) => option.uuid === port)
    setSelectedPort(port)
    setOriginDestinationOptions(null)
    fetchOriginDestinations(selectedPort?.transit)
    const { origin, transit } = selectedPort
    setFilteredData(tableData.filter((item) => item.origin === origin && item.transit === transit))
  }

  // Handle destination selection for origin port filter
  const handleOriginDestinationChange = (e) => {
    const destination = e.target.value
    setSelectedOriginDestination(destination)
    // Table data will be fetched via useEffect when all selections are made
  }

  // Handle filter type change
  const handleFilterByChange = (method) => {
    setFilterBy(method)

    // Reset all selections
    setSelectedVessel("")
    setSelectedVoyage("")
    setSelectedTransit("")
    setSelectedDestination("")
    setSelectedCountry("")
    setSelectedPort("")
    setSelectedOriginDestination("")
    setTableData([])
    setFilteredData([])
    setSelectedItems([])

    // Clear all options except the ones needed for the selected filter
    if (method === "vessel") {
      setPortOptions([])
      setOriginDestinationOptions([])
    } else {
      setVoyageOptions([])
      setTransitOptions([])
      setDestinationOptions([])
    }
  }

  // Fetch table data when all required selections are made
  useEffect(() => {
    if (filterBy === "vessel" && selectedVessel && selectedVoyage && selectedTransit && selectedDestination) {
      fetchVesselTableData()
    }
  }, [filterBy, selectedVessel, selectedVoyage, selectedTransit, selectedDestination])

  // Separate useEffect for origin filter to ensure it only runs when all selections are made
  useEffect(() => {
    if (filterBy === "origin" && selectedCountry && selectedPort && selectedOriginDestination) {
      fetchOriginTableData()
    }
  }, [filterBy, selectedCountry, selectedPort, selectedOriginDestination])

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Selection handlers
  const toggleSelectItem = (uuid) => {
    setSelectedItems((prev) => {
      if (prev.includes(uuid)) {
        return prev.filter((id) => id !== uuid)
      } else {
        return [...prev, uuid]
      }
    })
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([])
    } else {
      const currentItemIds = currentItems.map((item) => item.uuid)
      setSelectedItems(currentItemIds)
    }
  }

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  // Check if all current items are selected
  const allCurrentItemsSelected =
    currentItems.length > 0 && currentItems.every((item) => selectedItems.includes(item.uuid))

  // Sort data by ETD
  const sortedData = [...currentItems].sort((a, b) => {
    const getDate = (dateStr) => {
      if (!dateStr) return new Date(0)

      if (typeof dateStr === "string" && dateStr.includes("/")) {
        return new Date(dateStr.split("/").reverse().join("-"))
      }

      return new Date(dateStr)
    }

    const dateA = getDate(a.etd)
    const dateB = getDate(b.etd)
    return dateA - dateB
  })

  // Display a limited number of page buttons
  const getPageRange = () => {
    let startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)

    // Adjust if we're at the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleDelete = async (uuid) => {
    try {
      const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/${uuid}/delete`)
      if (response.status === 200) {
        setSuccessMessage("Schedule deleted successfully")
        setTableData((prevData) => prevData.filter((item) => item.uuid !== uuid))
        setSelectedItems((prev) => prev.filter((id) => id !== uuid))
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setErrorMessage(response?.data?.message || "Error deleting schedule data")
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error deleting schedule data")
      console.error("Error deleting schedule data:", error)
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    // Close the dialog after deletion
    setIsDeleteDialogOpen(false)
    setScheduleToDelete(null)
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return

    try {
      // Track successful deletions to update the table
      const successfulDeletions = []
      const failedDeletions = []

      // Delete each selected item
      for (const uuid of selectedItems) {
        try {
          const response = await api.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/${uuid}/delete`)
          if (response.status === 200) {
            successfulDeletions.push(uuid)
          }
        } catch (error) {
          failedDeletions.push(uuid)
          console.error(`Error deleting schedule ${uuid}:`, error)
        }
      }

      if (successfulDeletions.length > 0) {
        // Update table data by removing successfully deleted items
        setTableData((prevData) => prevData.filter((item) => !successfulDeletions.includes(item.uuid)))

        // Clear selected items
        setSelectedItems([])

        setSuccessMessage(`Successfully deleted ${successfulDeletions.length} schedule(s)`)

        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }

      if (failedDeletions.length > 0) {
        setErrorMessage(`Failed to delete ${failedDeletions.length} schedule(s)`)
      }
    } catch (error) {
      setErrorMessage("Error performing bulk delete operation")
      console.error("Error in bulk delete:", error)
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
    // Close the dialog
    setIsBulkDeleteDialogOpen(false)
  }

  const openDeleteDialog = (uuid) => {
    setScheduleToDelete(uuid)
    setIsDeleteDialogOpen(true)
  }

  const openBulkDeleteDialog = () => {
    if (selectedItems.length > 0) {
      setIsBulkDeleteDialogOpen(true)
    }
  }

  return (
    <div>
      <div>
        <div className="md:mr-[2.5%]">
          <div className="mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2">
            <h4 className="leading-[56px]">Schedule Management</h4>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <Link to="/schedule-list/bulk-edit">
                <button className="w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 ">
                  Bulk Edit
                </button>
              </Link>

              <Link to="/schedule-list/create-schedule">
                <button className="w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 ">
                  <FaPlus className="mt-[2px]" />
                  Create Schedule
                </button>
              </Link>
            </div>
          </div>

          <div className="my-8">
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
            {/* Filter options */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-16 mb-8">
              <label>
                <input
                  type="radio"
                  name="filterBy"
                  checked={filterBy === "origin"}
                  onChange={() => handleFilterByChange("origin")}
                />{" "}
                List by Origin Port
              </label>
              <label>
                <input
                  type="radio"
                  name="filterBy"
                  checked={filterBy === "vessel"}
                  onChange={() => handleFilterByChange("vessel")}
                />{" "}
                List by Vessel Name
              </label>
            </div>

            {/* Filter dropdowns */}
            {filterBy === "vessel" ? (
              // Vessel Name Filter
              <div className="flex flex-col md:flex-row gap-[20px] mb-8">
                <div>
                  <label className="text-[14px] mb-2 block">Select Vessel*</label>
                  <select
                    value={selectedVessel}
                    onChange={handleVesselChange}
                    className="w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                  >
                    <option value="">Select...</option>
                    {vesselOptions.map((vessel, index) => (
                      <option key={index} value={vessel.uuid}>
                        {vessel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[14px] mb-2 block">Voyage Ref*</label>

                  <select
                    value={selectedVoyage}
                    onChange={handleVoyageChange}
                    className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${!selectedVessel ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    disabled={!selectedVessel}
                  >
                    <option value="">Select...</option>
                    <option value="ALL">All</option>
                    {voyageOptions.map((voyage, index) => (
                      <option key={index} value={voyage.voyage_no}>
                        {voyage.voyage_no}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[14px] mb-2 block">Transit Hub*</label>

                  <select
                    value={selectedTransit}
                    onChange={handleTransitChange}
                    className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${!selectedVoyage ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    disabled={!selectedVoyage}
                  >
                    <option value="">Select...</option>
                    {transitOptions.length > 0 ? (
                      transitOptions.map((transit, index) => (
                        <option key={index} value={transit.transit}>
                          {transit.transit}
                        </option>
                      ))
                    ) : (
                      <option value="Dubai">Dubai</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[14px] mb-2 block">Destination*</label>

                  <select
                    value={selectedDestination}
                    onChange={handleDestinationChange}
                    className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${!selectedTransit ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    disabled={!selectedTransit}
                  >
                    <option value="">Select...</option>
                    <option value={"Europe"}>Europe</option>
                    <option value={"USA/Canada"}>USA/Canada</option>
                  </select>
                </div>
              </div>
            ) : (
              // Origin Port Filter
              <div className="flex flex-col md:flex-row gap-[20px] mb-8">
                <div>
                  <label className="text-[14px] mb-2 block">Select Country*</label>

                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                  >
                    <option value="">Select...</option>
                    {countryOptions.map((country, index) => (
                      <option key={index} value={country.uuid}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[14px] mb-2 block">Select Port*</label>

                  <select
                    value={selectedPort}
                    onChange={handlePortChange}
                    className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${!selectedCountry ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    disabled={!selectedCountry}
                  >
                    <option value="">Select...</option>
                    {portOptions.map((port, index) => (
                      <option key={index} value={port.uuid}>
                        {port.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[14px] mb-2 block">Destination*</label>
                  <select
                    value={selectedOriginDestination}
                    onChange={handleOriginDestinationChange}
                    className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${!selectedPort ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    disabled={!selectedPort}
                  >
                    <option value="">Select...</option>
                    <option value={"Europe"}>Europe</option>
                    <option value={"USA/Canada"}>USA/Canada</option>
                  </select>
                </div>
              </div>
            )}

            {/* Pagination and Search Controls */}
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

            {/* Table */}
            <div className="overflow-auto mt-4">
              <table className="border-[#E6EDFF] border-[1px] w-full rounded-lg">
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
                    <th>Mother Vessel</th>
                    <th>Voyage Ref</th>
                    <th>CFS Closing</th>
                    <th>FCL Closing</th>
                    <th>ETD</th>
                    <th>
                      ETA {selectedTransit || portOptions.find((val) => val.uuid === selectedPort)?.transit || "Origin"}
                    </th>
                    <th>ETA {selectedOriginDestination || selectedDestination || "Destination"}</th>
                    <th>Transit Time</th>
                    <th>Origin</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.length > 0 ? (
                    sortedData.map((row, index) => (
                      <tr key={row.uuid} className="border-[1px] border-[#E6EDFF]">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(row.uuid)}
                            onChange={() => toggleSelectItem(row.uuid)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{row.vessel_name}</td>
                        <td className="w-24">{row.voyage_no}</td>
                        <td>{new Date(row.cfs_closing).toLocaleDateString("en-GB")}</td>
                        <td>{new Date(row.fcl_closing).toLocaleDateString("en-GB")}</td>
                        <td>{new Date(row.etd).toLocaleDateString("en-GB") || "N/A"}</td>
                        <td>{new Date(row.eta_transit).toLocaleDateString("en-GB")}</td>
                        <td>{new Date(row.dst_eta).toLocaleDateString("en-GB")}</td>
                        <td>{row.transit_time} Days</td>
                        <td>{row.origin}</td>
                        <td className="py-3 px-4 cursor-pointer flex gap-6">
                          <div className="relative group inline-block">
                            <Link to={`/schedule-list/edit-schedule/${row.uuid}`}>
                              <FaRegPenToSquare className="text-black hover:text-gray-600 cursor-pointer w-[20px] h-[20px]" />
                              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                Edit
                              </div>
                            </Link>
                          </div>

                          <div className="relative group inline-block">
                            <FaTrash
                              className="text-black hover:text-red-600 cursor-pointer w-[20px] h-[20px]"
                              onClick={() => openDeleteDialog(row.uuid)}
                            />
                            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                              Delete
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className={styles.noDataFound}>
                        {searchQuery
                          ? "No matching schedules found"
                          : filterBy === "origin"
                            ? selectedCountry && selectedPort && selectedOriginDestination
                              ? "Available On Request"
                              : "No data available. Please select all filters."
                            : selectedVessel && selectedVoyage && selectedTransit && selectedDestination
                              ? "Available On Request"
                              : "No data available. Please select all filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4 pb-4">
              <div className="text-sm text-gray-700">
                Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
                {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-black"}`}
                >
                  Prev
                </button>

                {getPageRange().map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-3 py-1 rounded ${currentPage === number ? "text-black border" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0 ? "text-gray-400 cursor-not-allowed" : "text-black"}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the schedule entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => scheduleToDelete && handleDelete(scheduleToDelete)}
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
            <AlertDialogTitle>Delete Multiple Schedules</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.length} selected schedule(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}