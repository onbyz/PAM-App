"use client"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import ExportIcon from "@assets/icons/export.svg"
import * as XLSX from "xlsx"
import api from "@/lib/api"

export default function Export({ setError }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [countries, setCountries] = useState([])

  const fetchCountries = async () => {
    try {
      const countries = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/countries`)
      setCountries(countries.data?.data || [])
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  const exportOptions = [
    { id: "bulk", label: "Bulk Schedule Edit.xlsx" },
    { id: "single", label: "Single file upload.xlsx (All Ports)" },
  ]

  const handleCheckboxChange = (optionId) => {
    setSelectedOption(optionId)
  }

  const handleDownload = () => {
    setError(null)
    if (selectedOption) {
      const selectedLabel = exportOptions.find((option) => option.id === selectedOption).label

      if (selectedOption === "bulk") {
        api
          .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule`)
          .then((response) => {
            const data = response.data?.data || []

            const headers = [
              "Vessel_Name",
              "Voyage",
              "cfs_closing",
              "fcl_closing",
              "Etd_Origin",
              "ETA_Transit_Hub",
              "ETA_Europe",
              "Transit_time_Europe",
              "Origin",
              "Transit",
            ]

            const rows = data.map((item) => {
              const parseDate = (dateStr) => {
                if (!dateStr) return null

                try {
                  const date = new Date(dateStr)

                  if (isNaN(date.getTime())) return null

                  return date
                } catch (e) {
                  console.error("Error parsing date:", dateStr, e)
                  return null
                }
              }

              return [
                item.vessel_name || "",
                item.voyage_no || "",
                parseDate(item.cfs_closing),
                parseDate(item.fcl_closing),
                parseDate(item.etd),
                parseDate(item.eta_transit),
                parseDate(item.dst_eta),
                item.transit_time || "",
                item.origin || "",
                item.transit || "",
              ]
            })

            const wsData = [headers, ...rows]

            const worksheet = XLSX.utils.aoa_to_sheet(wsData)

            worksheet["!cols"] = [
              { wch: 15 }, // Vessel_Name
              { wch: 10 }, // Voyage
              { wch: 12 }, // cfs_closing
              { wch: 12 }, // fcl_closing
              { wch: 12 }, // Etd_Origin
              { wch: 15 }, // ETA_Transit_Hub
              { wch: 12 }, // ETA_Europe
              { wch: 18 }, // Transit_time_Europe
              { wch: 15 }, // Origin
              { wch: 15 }, // Transit
            ]

            for (let i = 0; i < data.length; i++) {
              const rowIndex = i + 1 // +1 because of header row

              for (let j = 2; j <= 6; j++) {
                const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: j })
                const cell = worksheet[cellRef]

                if (cell && cell.v instanceof Date) {
                  cell.t = "d" // Set type to date
                  cell.z = "yyyy-mm-dd" // Set format
                }
              }
            }

            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk_Schedule")

            XLSX.writeFile(workbook, selectedLabel)
          })
          .catch((error) => {
            setError(error?.response?.data?.message || "Error downloading bulk schedule edit file")
            console.error("Error downloading bulk schedule edit file:", error)
          })
      }
    }
  }

  return (
    <div className="bg-gray-100 h-full flex flex-col justify-center p-5">
      <div className="flex items-center gap-4">
        <img src={ExportIcon || "/placeholder.svg"} alt="Export" className="w-12 h-12" />
        <h6 className="text-2xl font-bold">Export Data</h6>
      </div>

      {exportOptions.map((option) => (
        <div key={option.id} className="flex gap-2 items-center mt-4">
          <Checkbox
            id={option.id}
            className="rounded-none"
            checked={selectedOption === option.id}
            onCheckedChange={() => handleCheckboxChange(option.id)}
          />
          <span className="text-base leading-10 font-normal">{option.label}</span>
        </div>
      ))}

      <div>
        <button
          className={`py-2 px-8 mt-4 text-white rounded-md ${selectedOption ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={handleDownload}
          disabled={!selectedOption}
        >
          Download
        </button>
      </div>
    </div>
  )
}
