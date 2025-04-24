"use client"

import { useState, useEffect } from "react"
import { FaXmark, FaPlus, FaRegPenToSquare, FaTrash } from "react-icons/fa6"
import { Link } from "react-router-dom"
import styles from "./scheduleList.module.css"
import axios from "axios"
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState(null)

  // Initial fetch for vessel names or countries based on filter type
  useEffect(() => {
    if (filterBy === "vessel") {
      fetchVesselNames()
    } else {
      fetchCountries()
    }
  }, [filterBy])

  // Fetch vessel names
  const fetchVesselNames = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vessel`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      const { data } = await response.json()
      setVesselOptions(data || [])
    } catch (error) {
      console.error("Error fetching vessel names:", error)
    }
  }

  // Fetch countries for origin port filter
  const fetchCountries = async () => {
    try {
      const countries = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/countries`)
      setCountryOptions(countries.data?.data || [])
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  // Fetch ports based on selected country
  const fetchPorts = async (country) => {
    if (!country) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port?countryID=${country}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      const { data } = await response.json()
      setPortOptions(data || [])
    } catch (error) {
      console.error("Error fetching ports:", error)
      // Fallback data if API is not available
      setPortOptions([{ uuid: "CGP-DXB", name: "BANGLADESH - CHITTAGONG VIA DUBAI" }])
    }

    setSelectedPort("")
    setSelectedOriginDestination("")
    setOriginDestinationOptions([])
    setTableData([]) // Clear table data when country changes
  }

  // Fetch destinations for origin port
  const fetchOriginDestinations = async (port) => {
    if (!port) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/destinations?transitHub=${port}&counrty=${selectedCountry}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      )
      const { data } = await response.json()
      setOriginDestinationOptions(data || [])
    } catch (error) {
      console.error("Error fetching origin destinations:", error)
    }

    setSelectedOriginDestination("")
    setTableData([]) // Clear table data when port changes
  }

  // Fetch voyage references based on selected vessel
  const fetchVoyageRefs = async (vessel) => {
    if (!vessel) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/voyages/${vessel}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      const { data } = await response.json()
      setVoyageOptions(data || [])
    } catch (error) {
      console.error("Error fetching voyage refs:", error)
    }

    setSelectedVoyage("")
    setSelectedTransit("")
    setSelectedDestination("")
    setTransitOptions([])
    setDestinationOptions([])
    setTableData([]) // Clear table data when vessel changes
  }

  // Fetch transit hubs based on selected vessel and voyage
  const fetchTransitHubs = async (vessel, voyage) => {
    if (!vessel || !voyage) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/ports?voyageRef=${voyage}&vesselID=${selectedVessel}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      )
      const { data } = await response.json()
      setTransitOptions(data || [])
    } catch (error) {
      console.error("Error fetching transit hubs:", error)
    }

    setSelectedTransit("")
    setSelectedDestination("")
    setDestinationOptions([])
    setTableData([]) // Clear table data when voyage changes
  }

  // Fetch destinations based on selected vessel, voyage, and transit
  const fetchDestinations = async (vessel, voyage, transit) => {
    if (!vessel || !voyage || !transit) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/destinations?vesselID=${vessel}&voyageRef=${voyage}&transitHub=${transit}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      )
      const { data } = await response.json()
      setDestinationOptions(data || [])
    } catch (error) {
      console.error("Error fetching destinations:", error)
    }

    setSelectedDestination("")
    setTableData([]) // Clear table data when transit changes
  }

  // Fetch table data based on vessel filter
  const fetchVesselTableData = async () => {
    if (!selectedVessel || !selectedVoyage || !selectedTransit || !selectedDestination) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule?vesselID=${selectedVessel}&voyageRef=${selectedVoyage}&transitHub=${selectedTransit}&destination=${selectedDestination}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      )
      const { data } = await response.json()
      setTableData(data || [])
    } catch (error) {
      console.error("Error fetching vessel table data:", error)
    }
  }

  // Fetch table data based on origin port filter
  const fetchOriginTableData = async () => {
    if (!selectedCountry || !selectedPort || !selectedOriginDestination) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule?country=${selectedCountry}&transitID=${selectedPort}&destination=${selectedOriginDestination}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      )
      const { data } = await response.json()
      setTableData(data || [])
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
    // Table data will be fetched via useEffect when all selections are made
  }

  // Handle country selection for origin port filter
  const handleCountryChange = (e) => {
    const country = e.target.value
    setSelectedCountry(country)
    setSelectedPort(null)
    setOriginDestinationOptions(null)
    fetchPorts(country)
  }

  // Handle port selection for origin port filter
  const handlePortChange = (e) => {
    const port = e.target.value
    const selectedPort = portOptions.find((option) => option.uuid === port)
    setSelectedPort(port)
    setOriginDestinationOptions(null)
    fetchOriginDestinations(selectedPort?.transit)
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

  const sortedData = [...tableData].sort((a, b) => {
    const dateA = new Date(a.etd.split("/").reverse().join("-"))
    const dateB = new Date(b.etd.split("/").reverse().join("-"))
    return dateA - dateB
  })

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleDelete = async (uuid) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/${uuid}/delete`)
      if (response.status === 200) {
        setSuccessMessage("Schedule deleted successfully")
        if (filterBy === "vessel") {
          fetchVesselTableData()
        } else {
          fetchOriginTableData()
        }
      } else {
        setErrorMessage(response?.data?.message || "Error deleting schedule data")
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error deleting schedule data")
      console.error("Error deleting schedule data:", error)
    }

    // Close the dialog after deletion
    setIsDeleteDialogOpen(false)
    setScheduleToDelete(null)
  }

  const openDeleteDialog = (uuid) => {
    setScheduleToDelete(uuid)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div>
      <div>
        <div className="md:mr-[2.5%]">
          <div className="mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2">
            <h4 className="leading-[56px]">Schedule</h4>

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
            {/* Table */}
            <div className="overflow-auto">
              <table className="border-[#E6EDFF] border-[1px] w-full rounded-lg">
                <thead>
                  <tr className="border-[1px] border-[#E6EDFF]">
                    <th>No</th>
                    <th>Mother Vessel</th>
                    <th>Voyage Ref</th>
                    <th>CFS Closing</th>
                    <th>FCL Closing</th>
                    <th>ETD</th>
                    <th>ETA {selectedTransit || portOptions.find((val) => val.uuid === selectedPort)?.transit}</th>
                    <th>ETA {selectedOriginDestination || selectedDestination}</th>
                    <th>Transit Time</th>
                    <th>Origin</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    sortedData.map((row, index) => (
                      <tr key={index} className="border-[1px] border-[#E6EDFF]">
                        <td>{index + 1}</td>
                        <td>{row.vessel_name}</td>
                        <td>{row.voyage_no}</td>
                        <td>{new Date(row.cfs_closing).toLocaleDateString("en-GB")}</td>
                        <td>{new Date(row.fcl_closing).toLocaleDateString("en-GB")}</td>
                        <td>{new Date(row.etd).toLocaleDateString("en-GB") || "N/A"}</td>
                        <td>{new Date(row.eta_transit).toLocaleDateString("en-GB")}</td>
                        <td>{new Date(row.dst_eta).toLocaleDateString("en-GB")}</td>
                        <td>{row.transit_time} Days</td>
                        <td>{row.origin}</td>
                        {/* <td><Link to={`/edit/${row.uuid}`}> Edit</Link></td> */}
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
                      <td colSpan="11" className={styles.noDataFound}>
                        {filterBy === "origin"
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
    </div>
  )
}
