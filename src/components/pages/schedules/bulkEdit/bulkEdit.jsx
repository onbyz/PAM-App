
import { useEffect, useState } from "react"
import { XCircle } from "lucide-react"
import Export from "./Export"

export default function BulkScheduleUpload() {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [uploadType, setUploadType] = useState("bulk") // 'bulk' or 'bulk_by_origin_port'
  const [deleteOldData, setDeleteOldData] = useState(true)
  const [selectedPort, setSelectedPort] = useState("")
  const [portOptions, setPortOptions] = useState([])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResponse(null)
      setSuccessMessage(`${selectedFile.name} file added successfully!`)

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    }
  }

  const validateFile = (file) => {
    if (!file) {
      setError("Please select a file")
      return false
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only Excel files (.xlsx or .xls)")
      return false
    }

    return true
  }

  useEffect(() => {
    if (uploadType === 'bulk_by_origin_port') {
      fetchPorts();
    }
  }, [uploadType]);

  const fetchPorts = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port`, {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      });
      const { data } = await response.json();
      setPortOptions(data || []);
    } catch (error) {
      console.error('Error fetching ports:', error);
    }

    setSelectedPort('');
  };

  const handlePortChange = (e) => {
    setSelectedPort(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateFile(file)) {
      return
    }

    if (uploadType === "bulk_by_origin_port" && !selectedPort) {
      setError("Please select an origin port")
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    const formData = new FormData()
    if (file) formData.append("scheduleFile", file)
    formData.append("deleteOldData", deleteOldData.toString())
    formData.append("uploadType", uploadType)

    if (uploadType === "bulk_by_origin_port" && selectedPort) {
      formData.append("originPort", selectedPort)
    }

    try {
      // Using import.meta.env for environment variables
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/bulk`
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload schedules")
      }

      setResponse(data)
      setSuccessMessage("File processed successfully!")
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-8 md:mr-[2.5%] flex">
      <div className="w-2/3">
        <div className="flex justify-between border-b-[1px] border-[#B6A9A9] pb-2">
          <h4 className="text-2xl leading-[56px]">Bulk Edit</h4>
        </div>

        {successMessage && (
          <div className="w-full bg-green-100 text-green-800 text-start p-3 rounded-md my-6 flex justify-between">
            {successMessage}
            <XCircle className="w-5 h-5 cursor-pointer" onClick={() => setSuccessMessage(null)} />
          </div>
        )}

        {error && (
          <div className="w-full bg-red-100 text-red-600 text-start p-3 rounded-md my-6 flex justify-between">
            {error}
            <XCircle className="w-5 h-5 cursor-pointer" onClick={() => setError(null)} />
          </div>
        )}

        <div className="my-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-16 mb-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="uploadType"
                checked={uploadType === "bulk"}
                onChange={() => {
                  setUploadType("bulk")
                  setFile(null)
                  setResponse(null)
                  setError(null)
                  setSuccessMessage(null)
                }}
                className="sr-only"
              />
              <span
                className={`h-4 w-4 rounded-full border ${uploadType === "bulk" ? "border-black bg-black" : "border-gray-300"} flex items-center justify-center mr-2`}
              >
                {uploadType === "bulk" && <span className="h-2 w-2 rounded-full bg-white"></span>}
              </span>
              <span>Bulk Schedule Edit</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="uploadType"
                checked={uploadType === "bulk_by_origin_port"}
                onChange={() => {
                  setUploadType("bulk_by_origin_port")
                  setFile(null)
                  setResponse(null)
                  setError(null)
                  setSuccessMessage(null)
                }}
                className="sr-only"
              />
              <span
                className={`h-4 w-4 rounded-full border ${uploadType === "bulk_by_origin_port" ? "border-black bg-black" : "border-gray-300"} flex items-center justify-center mr-2`}
              >
                {uploadType === "bulk_by_origin_port" && <span className="h-2 w-2 rounded-full bg-white"></span>}
              </span>
              <span>Edit by Origin Port</span>
            </label>
          </div>
        </div>

        {uploadType === "bulk_by_origin_port" && (
          <div className="my-8">
            <div>
              <label className="text-[14px] mb-2 block">Select Origin Port*</label>
              <select
                value={selectedPort}
                onChange={handlePortChange}
                className="w-full max-w-[384px] h-[66px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
              >
                <option value="">Select...</option>
                {portOptions.map((port, index) => (
                  <option key={index} value={port.uuid}>
                    {port.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="my-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-16 mb-8">
            <p className="text-[16px] font-normal">Delete Old Data</p>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="deleteOldData"
                checked={deleteOldData === true}
                onChange={() => setDeleteOldData(true)}
                className="sr-only"
              />
              <span
                className={`h-5 w-5 rounded-full border-2 ${deleteOldData ? "border-green-500" : "border-gray-300"} flex items-center justify-center mr-2`}
              >
                {deleteOldData && <span className="h-3 w-3 rounded-full bg-green-500"></span>}
              </span>
              <span>Yes</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="deleteOldData"
                checked={deleteOldData === false}
                onChange={() => setDeleteOldData(false)}
                className="sr-only"
              />
              <span
                className={`h-5 w-5 rounded-full border-2 ${!deleteOldData ? "border-green-500" : "border-gray-300"} flex items-center justify-center mr-2`}
              >
                {!deleteOldData && <span className="h-3 w-3 rounded-full bg-green-500"></span>}
              </span>
              <span>No</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative inline-block">
            <div className="flex gap-6 items-center">
              <input
                type="file"
                id="scheduleFile"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="w-[115px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2"
                onClick={() => document.getElementById("scheduleFile")?.click()}
              >
                Choose File
              </button>
              {file ? (
                <p className="text-[16px] leading-[40px] font-normal">Selected file {file.name}</p>
              ) : (
                <p className="text-[16px] leading-[40px] font-normal">Only Accepts Excel (.xls, .xlsx) format.</p>
              )}
            </div>
          </div>

          <div className="flex gap-6 mt-8">
            <button
              type="submit"
              className={`w-[115px] h-[40px] rounded-md text-white text-[14px] flex justify-center items-center gap-2 ${isLoading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-[#16A34A] hover:bg-green-600"
                }`}
              disabled={isLoading || !file}
            >
              {isLoading ? "Processing..." : "Process File"}
            </button>

            <button
              type="button"
              onClick={() => {
                setFile(null)
                setError(null)
                setResponse(null)
                setSuccessMessage(null)
              }}
              className="w-[80px] h-[40px] text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white"
            >
              Cancel
            </button>
          </div>
        </form>

        {response && (
          <div className="mt-8 p-4 border border-gray-200 rounded-md bg-white">
            <h3 className="font-semibold text-lg mb-2">Processing Results:</h3>
            <p>Total records processed: {response.data.total}</p>
            <p>Created: {response.data.created}</p>
            <p>Updated: {response.data.updated}</p>
            <p>Failed: {response.data.failed}</p>

            {response.data.failed > 0 && (
              <div className="mt-3">
                <h3 className="font-semibold text-lg mb-2">Failed Records:</h3>
                <ul className="list-disc pl-5">
                  {response.data.errors.map((error, index) => (
                    <li key={index} className="mb-2">
                      Error: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-1/3 p-4 mt-auto">
        <Export setError={setError}/>
      </div>
    </div>
  )
}

