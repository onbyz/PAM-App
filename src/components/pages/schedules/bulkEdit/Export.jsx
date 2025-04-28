import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import ExportIcon from "@assets/icons/export.svg";

export default function Export() {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const exportOptions = [
        { id: "bulk", label: "Bulk Schedule Edit.xls" },
        { id: "single", label: "Single file upload.xls (All Ports)" }
    ];
    
    const handleCheckboxChange = (optionId) => {
        setSelectedOption(optionId);
    };
    
    const handleDownload = () => {
        if (selectedOption) {
            console.log(`Downloading: ${exportOptions.find(option => option.id === selectedOption).label}`);
        }
    };
    
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