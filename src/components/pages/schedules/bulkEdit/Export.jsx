import React, { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import ExportIcon from "@assets/icons/export.svg";
import * as XLSX from 'xlsx';
import api from '@/lib/api';

export default function Export({ setError }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [countries, setCountries] = useState([]);
    const [ports, setPorts] = useState([]);

    const fetchCountries = async () => {
        try {
          const countries = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/countries`)
          setCountries(countries.data?.data || [])
        } catch (error) {
          console.error("Error fetching countries:", error)
        }
    }

    const fetchPorts = async () => {
        try {
          const ports = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/port`)
          setPorts(ports.data?.data || [])
        } catch (error) {
          console.error("Error fetching ports:", error)
        }
    }

    useEffect(() => {
        fetchCountries();
        fetchPorts();
    }, []);
    
    const exportOptions = [
        { id: "bulk", label: "Bulk Schedule Edit.xls" },
        { id: "single", label: "Single file upload.xls (All Ports)" }
    ];
    
    const handleCheckboxChange = (optionId) => {
        setSelectedOption(optionId);
    };
    
    const handleDownload = () => {
        setError(null);
        
        if (!selectedOption) return;
        
        const selectedItem = exportOptions.find(option => option.id === selectedOption);
        if (!selectedItem) return;
        
        if (selectedOption === "bulk") {
            downloadBulkSchedule();
        } else if (selectedOption === "single") {
            downloadSingleSchedule();
        }
    };
    
    const downloadBulkSchedule = () => {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule`;
        
        api(apiUrl)
            .then(response => {
                const data = response.data?.data || [];
                const formattedData = formatScheduleData(data, false);
                generateAndDownloadExcel(formattedData, "Bulk_upload_", false);
            })
            .catch(error => {
                const errorMessage = error?.response?.data?.message || "Error downloading bulk schedule edit file";
                setError(errorMessage);
                console.error("Error downloading bulk schedule edit file:", error);
            });
    };

    const downloadSingleSchedule = () => {
        ports.forEach(port => {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/admin/schedule/port/${port.id}`;
            api(apiUrl)
                .then(response => {
                    const data = response.data?.data || [];
                    const formattedData = formatScheduleData(data, true);
                    generateAndDownloadExcel(formattedData, `${port.country}_${port.origin}`, true);
                })
                .catch(error => {
                    const errorMessage = error?.response?.data?.message || "Error downloading single schedule edit file";
                    setError(errorMessage);
                    console.error("Error downloading single schedule edit file:", error);
                });
        });
    };
    
    const formatScheduleData = (data, isSingle) => {
        return data.map(item => {
            const formattedItem = {
                Vessel_Name: item?.vessel_name || '',
                Voyage: item?.voyage_no || '',
                cfs_closing: formatDate(item?.cfs_closing) || '',
                fcl_closing: formatDate(item?.fcl_closing) || '',
                Etd_Origin: formatDate(item?.etd) || '',
                ETA_Transit_Hub: formatDate(item?.eta_transit) || '',
                ETA_Europe: item.dst_eta ? formatDate(item.dst_eta) : '',
                Transit_time_Europe: item.transit_time || '',
                ETA_USA_Canada: item.dst_eta ? formatDate(addDaysToDate(item.dst_eta, 2)) : '',
                Transit_time_USA_Canada: item.transit_time ? item.transit_time + 2  : '',
            };

            if (!isSingle) {
                formattedItem.Origin = item?.origin || '';
                formattedItem.Transit = item.transit || '';
            }

            return formattedItem;
        });
    };
    
    const generateAndDownloadExcel = (formattedData, filenamePrefix, isSingle) => {
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
            "Transit_time_USA_Canada"
        ];
        
        if (!isSingle) {
            headers.push("Origin", "Transit");
        }
    
        const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, isSingle ? 'Single_Schedule' : 'Bulk_Schedule');
    
        const excelFile = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });
        const blob = new Blob([s2ab(excelFile)], { type: 'application/octet-stream' });
    
        const timestamp = getCurrentTimestamp();
    
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filenamePrefix}_${timestamp}.xlsx`;
        link.click();
    };
    
    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : '';
    };
    
    const addDaysToDate = (dateString, daysToAdd) => {
        const date = new Date(dateString);
        return new Date(date.setDate(date.getDate() + daysToAdd));
    };
    
    const getCurrentTimestamp = () => {
        const now = new Date();
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    };

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    
    return (
        <div className="bg-gray-100 h-full flex flex-col justify-center p-5">
            <div className="flex items-center gap-4">
                <img src={ExportIcon} alt="Export" className="w-12 h-12" />
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
                    className={`py-2 px-8 mt-4 text-white rounded-md ${selectedOption ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    onClick={handleDownload}
                    disabled={!selectedOption}
                >
                    Download
                </button>
            </div>
        </div>
    )
}