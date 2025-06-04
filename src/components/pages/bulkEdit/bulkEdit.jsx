
import api from "@/lib/api"
import { useState } from "react"

const BulkScheduleUpload = () => {
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)
    const [uploadType, setUploadType] = useState("bulk") // 'bulk' or 'origin'
    const [deleteOldData, setDeleteOldData] = useState(true)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setError(null)
        setResponse(null)
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateFile(file)) {
            return
        }

        setIsLoading(true)
        setError(null)
        setResponse(null)

        const formData = new FormData()
        formData.append("scheduleFile", file)
        formData.append("deleteOldData", deleteOldData)
        formData.append("uploadType", uploadType)

        try {
            const response = await api(`${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/bulk`, {
                method: "POST",
                body: formData,
            })

            const {data} = await response.data;

            if (!response.ok) {
                throw new Error(data.message || "Failed to upload schedules")
            }

            setResponse(data)
        } catch (err) {
            setError(err.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="pt-20">
            <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
                <h4 className='leading-[56px] text-[26px] font-medium'>Bulk Edit</h4>
            </div>
            <div className="flex gap-5 my-10">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="radio"
                        className="sr-only"
                        checked={uploadType === "bulk"}
                        onChange={() => setUploadType("bulk")}
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
                        className="sr-only"
                        checked={uploadType === "origin"}
                        onChange={() => setUploadType("origin")}
                    />
                    <span
                        className={`h-4 w-4 rounded-full border ${uploadType === "origin" ? "border-black bg-black" : "border-gray-300"} flex items-center justify-center mr-2`}
                    >
                        {uploadType === "origin" && <span className="h-2 w-2 rounded-full bg-white"></span>}
                    </span>
                    <span>Edit by Origin Port</span>
                </label>
            </div>

            <div className="mb-6">
                <div className="font-medium mb-2">Delete Old Data</div>
                <div className="flex gap-5">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            className="sr-only"
                            checked={deleteOldData === true}
                            onChange={() => setDeleteOldData(true)}
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
                            className="sr-only"
                            checked={deleteOldData === false}
                            onChange={() => setDeleteOldData(false)}
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
                <div className="flex items-center mb-6">
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded font-medium"
                        onClick={() => document.getElementById("scheduleFile").click()}
                    >
                        Choose File
                    </button>
                    <span className="ml-3 text-gray-600">{file ? file.name : "Bulk upload excel sheet.xls"}</span>
                    <input type="file" id="scheduleFile" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
                </div>

                <button
                    type="submit"
                    className={`px-5 py-2 rounded font-medium ${isLoading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                    disabled={isLoading || !file}
                >
                    {isLoading ? "Processing..." : "Process File"}
                </button>
            </form>

            {error && <div className="text-red-500 mt-4">Error: {error}</div>}

            {response && (
                <div className="mt-5 p-4 border border-gray-200 rounded">
                    <h3 className="font-semibold text-lg mb-2">Processing Results:</h3>
                    <p>Total records processed: {response.data.total}</p>
                    <p>Created: {response.data.created}</p>
                    <p>Updated: {response.data.updated}</p>
                    <p>Failed: {response.data.failed}</p>

                    {response.data.failed > 0 && (
                        <div className="mt-3">
                            <h4 className="font-semibold mb-2">Failed Records:</h4>
                            <ul className="list-disc pl-5">
                                {response.data.errors.map((error, index) => (
                                    <li key={index} className="mb-2">
                                        Row data: {JSON.stringify(error.row)}
                                        <br />
                                        Error: {error.error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default BulkScheduleUpload

