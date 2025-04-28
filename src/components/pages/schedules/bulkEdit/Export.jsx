import React, { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import ExportIcon from "@assets/icons/export.svg";
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function Export({ setError }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [countries, setCountries] = useState([]);

    const fetchCountries = async () => {
        try {
          const countries = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/countries`)
          setCountries(countries.data?.data || [])
        } catch (error) {
          console.error("Error fetching countries:", error)
        }
    }

    useEffect(() => {
        fetchCountries();
    }, []);
    console.log(countries)
    
    const exportOptions = [
        { id: "bulk", label: "Bulk Schedule Edit.xls" },
        { id: "single", label: "Single file upload.xls (All Ports)" }
    ];
    
    const handleCheckboxChange = (optionId) => {
        setSelectedOption(optionId);
    };
    
    const handleDownload = () => {
        setError(null);
        if (selectedOption) {
            const selectedLabel = exportOptions.find(option => option.id === selectedOption).label;

            if (selectedOption === "bulk") {
                axios.get('/api/admin/schedule')
                    .then(response => {
                        const data = response.data?.data || [];

                        const formattedData = data.map(item => ({
                            Vessel_Name: item.vessel_name,
                            Voyage: item.voyage_no,
                            cfs_closing: new Date(item.cfs_closing).toLocaleDateString(),
                            fcl_closing: new Date(item.fcl_closing).toLocaleDateString(),
                            Etd_Origin: new Date(item.etd).toLocaleDateString(),
                            ETA_Transit_Hub: new Date(item.eta_transit).toLocaleDateString(),
                            ETA_Europe: item.dst_eta ? new Date(item.dst_eta).toLocaleDateString() : '',
                            Transit_time_Europe: item.transit_time || '',
                            Origin: item.origin,
                            Destination: item.destination
                        }));

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
                            "Destination"
                        ];

                        const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
                        
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bulk_Schedule');

                        const excelFile = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });
                        const blob = new Blob([s2ab(excelFile)], { type: 'application/octet-stream' });

                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = selectedLabel;
                        link.click();
                    })
                    .catch(error => {
                        setError(error?.response?.data?.message || "Error downloading bulk schedule edit file");
                        console.error("Error downloading bulk schedule edit file:", error);
                    });
            }
        }
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