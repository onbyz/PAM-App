import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import ExportIcon from "@assets/icons/export.svg"
import DownloadIcon from "@assets/icons/download.svg"
import * as XLSX from "xlsx"
import api from "@/lib/api"

export default function Export({ setError }) {
  const [selectedExportOption, setSelectedExportOption] = useState(null)
  const [selectedTemplateOption, setSelectedTemplateOption] = useState(null)
  const [ports, setPorts] = useState([])

  const fetchPorts = async () => {
    try {
      const ports = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port`)
      setPorts(ports.data?.data || [])
    } catch (error) {
      console.error("Error fetching ports:", error)
    }
  }

  useEffect(() => {
    fetchPorts()
  }, [])

  const exportOptions = [
    { id: "bulk", label: "Bulk Schedule Edit.xlsx" },
    { id: "single", label: "Single File Upload.xlsx (All Ports)" },
  ]
  
  const templateOptions = [
    { id: "bulk_template", label: "Blank Bulk Schedule Template.xlsx" },
    { id: "single_template", label: "Blank Single File Template.xlsx (All Ports)" },
  ]

  const handleExportCheckboxChange = (optionId) => {
    setSelectedExportOption(prev => prev === optionId ? null : optionId)
    // Clear template selection when export option is selected
    setSelectedTemplateOption(null)
  }

  const handleTemplateCheckboxChange = (optionId) => {
    setSelectedTemplateOption(prev => prev === optionId ? null : optionId)
    // Clear export selection when template option is selected
    setSelectedExportOption(null)
  }

  const handleExportDownload = () => {
    setError(null)

    if (!selectedExportOption) return

    if (selectedExportOption === "bulk") {
      downloadBulkSchedule()
    } else if (selectedExportOption === "single") {
      downloadSingleSchedule()
    }
    
    setSelectedExportOption(null)
  }

  const handleTemplateDownload = () => {
    setError(null)

    if (!selectedTemplateOption) return

    if (selectedTemplateOption === "bulk_template") {
      downloadTemplate(false)
    } else if (selectedTemplateOption === "single_template") {
      downloadTemplate(true)
    }
    
    setSelectedTemplateOption(null)
  }

  const downloadBulkSchedule = () => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule`

    api
      .get(apiUrl)
      .then((response) => {
        const data = response.data?.data || []
        const groupedData = groupDataByCountry(data)
        generateAndDownloadBulkExcel(groupedData)
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message || "Error downloading bulk schedule edit file"
        setError(errorMessage)
        console.error("Error downloading bulk schedule edit file:", error)
      })
  }

  const groupDataByCountry = (data) => {
    const groupedByCountry = {}
    
    data.forEach((item) => {
      const countryName = item.country_name || "Unknown"
      if (!groupedByCountry[countryName]) {
        groupedByCountry[countryName] = []
      }
      groupedByCountry[countryName].push(item)
    })
    
    const sortedCountries = Object.keys(groupedByCountry).sort()
    
    const result = {}
    sortedCountries.forEach(country => {
      result[country] = groupedByCountry[country]
    })
    
    return result
  }

  const downloadSingleSchedule = async () => {
    try {
      for (const [i, port] of ports.entries()) {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/port/${port.id}`;
        const response = await api.get(apiUrl);
        const data = response.data?.data || [];
        if (data.length === 0) continue;
        const formattedData = formatScheduleData(data, true);
        
        prepareExcelDownload(
          formattedData, 
          `${port.country}_${port.origin} via ${port.transit}`, 
          true
        );
        
        // Add delay between downloads to prevent browser blocking
        if (i < ports.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Error downloading single schedule edit file";
      setError(errorMessage);
      console.error("Error downloading single schedule files:", error);
    }
  };

  const prepareExcelDownload = (formattedData, filenamePrefix, isSingle) => {
    const headers = [
      "Vessel_Name",
      "Voyage",
      "cfs_closing",
      "fcl_closing",
      "Etd_Origin",
      "ETA_Transit_Hub",
      "ETA_Europe",
      "Transit_time_Europe",
      "ETA_USA_Canada",
      "Transit_time_USA_Canada",
    ];

    if (!isSingle) {
      headers.push("Origin", "Transit");
    }

    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    const rows = formattedData.map((item) => {
      const row = [];
      for (const header of headers) {
        row.push(item[header]);
      }
      return row;
    });

    XLSX.utils.sheet_add_aoa(worksheet, rows, { origin: "A2" });

    worksheet["!cols"] = [
      { wch: 15 }, // Vessel_Name
      { wch: 10 }, // Voyage
      { wch: 12 }, // cfs_closing
      { wch: 12 }, // fcl_closing
      { wch: 12 }, // Etd_Origin
      { wch: 15 }, // ETA_Transit_Hub
      { wch: 12 }, // ETA_Europe
      { wch: 18 }, // Transit_time_Europe
      { wch: 15 }, // ETA_USA_Canada
      { wch: 18 }, // Transit_time_USA_Canada
    ];

    if (!isSingle) {
      worksheet["!cols"].push({ wch: 15 }, { wch: 15 }); // Origin, Transit
    }

    const dateColumns = [2, 3, 4, 5, 6, 8]; // Indexes of date columns (0-based)

    for (let i = 0; i < formattedData.length; i++) {
      const rowIndex = i + 1; // +1 because of header row

      for (const colIndex of dateColumns) {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
        const cell = worksheet[cellRef];

        if (cell && cell.v !== null && cell.v !== undefined) {
          cell.t = "n"; // Set type to number
          cell.z = "dd-mm-yyyy"; // Set format to date only
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, isSingle ? "Single_Schedule" : "Bulk_Schedule");

    const excelFile = XLSX.write(workbook, { type: "binary", bookType: "xlsx" });
    const blob = new Blob([s2ab(excelFile)], { type: "application/octet-stream" });

    const filename = `${filenamePrefix}.xlsx`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(link.href), 100);

    return { workbook, filename };
  };

  // Convert date string to Excel serial number (date only, no time)
  const dateToExcelSerial = (dateStr) => {
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

  const formatScheduleData = (data, isSingle) => {
    return data.map((item) => {
      // Convert dates to Excel serial numbers
      const cfsClosing = dateToExcelSerial(item?.cfs_closing)
      const fclClosing = dateToExcelSerial(item?.fcl_closing)
      const etdOrigin = dateToExcelSerial(item?.etd)
      const etaTransit = dateToExcelSerial(item?.eta_transit)
      const etaEurope = dateToExcelSerial(item?.dst_eta)

      // Calculate USA/Canada ETA by adding 2 days to Europe ETA
      let etaUsaCanada = null
      if (etaEurope !== null) {
        etaUsaCanada = etaEurope ? new Date(etaEurope.getTime() + 2 * 24 * 60 * 60 * 1000) : null
      }

      const formattedItem = {
        Vessel_Name: item?.vessel_name || "",
        Voyage: item?.voyage_no || "",
        cfs_closing: cfsClosing,
        fcl_closing: fclClosing,
        Etd_Origin: etdOrigin,
        ETA_Transit_Hub: etaTransit,
        ETA_Europe: etaEurope,
        Transit_time_Europe: item.transit_time || "",
        ETA_USA_Canada: etaUsaCanada,
        Transit_time_USA_Canada: item.transit_time ? Number.parseInt(item.transit_time) + 2 : "",
      }

      if (!isSingle) {
        formattedItem.Origin = item?.origin || ""
        formattedItem.Transit = item.transit || ""
      }

      return formattedItem
    })
  }

  const generateAndDownloadBulkExcel = (groupedData) => {
    const headers = [
      "Vessel_Name",
      "Voyage",
      "cfs_closing",
      "fcl_closing",
      "Etd_Origin",
      "ETA_Transit_Hub",
      "ETA_Europe",
      "Transit_time_Europe",
      "ETA_USA_Canada",
      "Transit_time_USA_Canada",
      "Origin",
      "Transit"
    ]

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([headers])

    // Track the current row index
    let rowIndex = 1 // Start from row 1 (after header)
    
    // Process each country's data
    const countries = Object.keys(groupedData)
    
    countries.forEach((country, countryIndex) => {
      const countryData = groupedData[country]
      
      // Group by origin within each country
      const originGroups = {}
      countryData.forEach(item => {
        const origin = item.origin || "Unknown"
        if (!originGroups[origin]) {
          originGroups[origin] = []
        }
        originGroups[origin].push(item)
      })
      
      // Sort origins
      const sortedOrigins = Object.keys(originGroups).sort()
      
      // Process each origin's data
      sortedOrigins.forEach((origin, originIndex) => {
        const originData = originGroups[origin]
        const formattedData = formatScheduleData(originData, false)
        
        // Add this origin's data
        const rows = formattedData.map(item => {
          return headers.map(header => item[header])
        })
        
        XLSX.utils.sheet_add_aoa(worksheet, rows, { origin: `A${rowIndex + 1}` })
        rowIndex += rows.length
        
        // Add three empty rows after each origin (except the last origin in the last country)
        if (!(countryIndex === countries.length - 1 && originIndex === sortedOrigins.length - 1)) {
          XLSX.utils.sheet_add_aoa(worksheet, [[], [], []], { origin: `A${rowIndex + 1}` })
          rowIndex += 3
        }
      })
    })

    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Vessel_Name
      { wch: 10 }, // Voyage
      { wch: 12 }, // cfs_closing
      { wch: 12 }, // fcl_closing
      { wch: 12 }, // Etd_Origin
      { wch: 15 }, // ETA_Transit_Hub
      { wch: 12 }, // ETA_Europe
      { wch: 18 }, // Transit_time_Europe
      { wch: 15 }, // ETA_USA_Canada
      { wch: 18 }, // Transit_time_USA_Canada
      { wch: 15 }, // Origin
      { wch: 15 }, // Transit
    ]

    // Set date format for date columns
    const dateColumns = [2, 3, 4, 5, 6, 8] // Indexes of date columns (0-based)
    
    // Find all cell references that contain data
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    
    for (let r = range.s.r + 1; r <= range.e.r; r++) { // Start from row 1 (after header)
      for (const colIndex of dateColumns) {
        const cellRef = XLSX.utils.encode_cell({ r, c: colIndex })
        const cell = worksheet[cellRef]

        if (cell && cell.v !== null && cell.v !== undefined) {
          cell.t = "n" // Set type to number
          cell.z = "dd-mm-yyyy" // Set format to date only
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk_Schedule")

    const excelFile = XLSX.write(workbook, { type: "binary", bookType: "xlsx" })
    const blob = new Blob([s2ab(excelFile)], { type: "application/octet-stream" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Sea-Air Schedule.xlsx`
    link.click()

    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }

  // Helper function to convert string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff
    }
    return buf
  }

  const downloadTemplate = (isSingle = false) => {
    const headers = [
      "Vessel_Name",
      "Voyage",
      "cfs_closing",
      "fcl_closing",
      "Etd_Origin",
      "ETA_Transit_Hub",
      "ETA_Europe",
      "Transit_time_Europe",
      "ETA_USA_Canada",
      "Transit_time_USA_Canada",
    ]

    if (!isSingle) {
      headers.push("Origin", "Transit");
    }

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([headers])

    // Apply bold formatting to the header row
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      if (!worksheet[cellAddress]) continue
      
      worksheet[cellAddress].s = {
        font: { bold: true }
      }
    }

    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Vessel_Name
      { wch: 10 }, // Voyage
      { wch: 12 }, // cfs_closing
      { wch: 12 }, // fcl_closing
      { wch: 12 }, // Etd_Origin
      { wch: 15 }, // ETA_Transit_Hub
      { wch: 12 }, // ETA_Europe
      { wch: 18 }, // Transit_time_Europe
      { wch: 15 }, // ETA_USA_Canada
      { wch: 18 }, // Transit_time_USA_Canada
    ]

    if (!isSingle) {
      worksheet["!cols"].push({ wch: 15 }, { wch: 15 }); // Origin, Transit
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, isSingle ? "Single_File_Upload" : "Bulk_Schedule")

    const excelFile = XLSX.write(workbook, { type: "binary", bookType: "xlsx" })
    const blob = new Blob([s2ab(excelFile)], { type: "application/octet-stream" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = isSingle ? `Single File Template.xlsx` : `Bulk Schedule Template.xlsx`
    link.click()

    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }

  return (
    <>
      <div className="bg-[#F2F2F2] h-full flex flex-col justify-center p-5">
        <div className="flex items-center gap-4">
          <img src={ExportIcon || "/placeholder.svg"} alt="Export" className="w-12 h-12" />
          <h6 className="text-lg font-medium">Export Current Data</h6>
        </div>
        <p className="text-[11px] text-[#4D4444] leading-0 my-2">Download Excel files with real-time data from your system. Get fully populated spreadsheets that reflect the latest data available in the application.</p>

        {exportOptions.map((option) => (
          <div key={option.id} className="flex gap-2 items-center my-2">
            <Checkbox
              id={option.id}
              className="rounded-none"
              checked={selectedExportOption === option.id}
              onCheckedChange={() => handleExportCheckboxChange(option.id)}
            />
            <span className="text-xs font-bold">{option.label}</span>
          </div>
        ))}

        <div>
          <button
            className={`py-2 px-8 mt-4 text-white rounded-md ${selectedExportOption ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
            onClick={handleExportDownload}
            disabled={!selectedExportOption}
          >
            Download
          </button>
        </div>
      </div>

      <div className="bg-[#F2F2F2] h-full flex flex-col justify-center p-5 mt-4">
        <div className="flex items-center gap-4">
          <img src={DownloadIcon || "/placeholder.svg"} alt="Download" className="w-8" />
          <h6 className="text-lg font-medium">Download Blank Templates</h6>
        </div>
        <p className="text-[11px] text-[#4D4444] leading-0 my-2">Get empty Excel formats. Use pre-formatted Excel sheets with headers and structure, ready for manual data entry or offline preparation — no pre-filled values.</p>

        {templateOptions.map((option) => (
          <div key={option.id} className="flex gap-2 items-center my-2">
            <Checkbox
              id={option.id}
              className="rounded-none"
              checked={selectedTemplateOption === option.id}
              onCheckedChange={() => handleTemplateCheckboxChange(option.id)}
            />
            <span className="text-xs font-bold">{option.label}</span>
          </div>
        ))}

        <div>
          <button
            className={`py-2 px-8 mt-4 text-white rounded-md ${selectedTemplateOption ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
            onClick={handleTemplateDownload}
            disabled={!selectedTemplateOption}
          >
            Download
          </button>
        </div>
      </div>
    </>
  )
}