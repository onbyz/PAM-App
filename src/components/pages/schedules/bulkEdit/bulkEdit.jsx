import React, {useState, useEffect} from 'react';
import { useNavigate  } from "react-router-dom";
import { FaXmark, FaEllipsis } from "react-icons/fa6";

export default function BulkEdit() {

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); 
    };

    const [filterBy, setFilterBy] = useState('bulkEdit');
    const [oldDataRadioButton, setOldDataRadioButton] = useState('yes');
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPort, setSelectedPort] = useState('');
    const [portOptions, setPortOptions] = useState([]);

    const handleSelectedFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file.name);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => setSuccessMessage(""), 5000);
            setSuccessMessage(`${file.name} file added successfully!`);
        }
    }

    const sortedData = [
        {id: 1, vessel_name: "COSCO SHIPPING PLANET", voyage_no: "037W", cfs_closing:"04-11-2024", fcl_closing: "05-11-2024", origin: "Chittagong via Dubai", etd: "02-02-2025", eta_transit: "21-02-2025", dst_eta : "25-02-2025", transit_time: "25 Days"},
        {id: 2, vessel_name: "COSCO SHIPPING PLANET", voyage_no: "037W", cfs_closing:"04-11-2024", fcl_closing: "05-11-2024", origin: "Chittagong via Dubai", etd: "02-02-2025", eta_transit: "21-02-2025", dst_eta : "25-02-2025", transit_time: "25 Days"},
        {id: 3, vessel_name: "COSCO SHIPPING PLANET", voyage_no: "037W", cfs_closing:"04-11-2024", fcl_closing: "05-11-2024", origin: "Chittagong via Dubai", etd: "02-02-2025", eta_transit: "21-02-2025", dst_eta : "25-02-2025", transit_time: "25 Days"},
        {id: 4, vessel_name: "COSCO SHIPPING PLANET", voyage_no: "037W", cfs_closing:"04-11-2024", fcl_closing: "05-11-2024", origin: "Chittagong via Dubai", etd: "02-02-2025", eta_transit: "21-02-2025", dst_eta : "25-02-2025", transit_time: "25 Days"},
    ];

    const sortedPortData = [
        {id: 1, vessel_name: "COSCO SHIPPING PLANET", voyage_no: "037W", cfs_closing:"04-11-2024", fcl_closing: "05-11-2024", origin: "Chittagong via Dubai", etd: "02-02-2025", eta_transit: "21-02-2025", dst_eta : "25-02-2025", transit_time: "25 Days"},
        {id: 2, vessel_name: "CMA CGM NEVADA", voyage_no: "037W", cfs_closing:"04-11-2024", fcl_closing: "05-11-2024", origin: "Chittagong via Dubai", etd: "02-02-2025", eta_transit: "21-02-2025", dst_eta : "25-02-2025", transit_time: "25 Days"},
    ];

    const fetchPorts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/ports`, {
                headers: {
                "ngrok-skip-browser-warning": "true"
                }
            });
            const { data } = await response.json();
            setPortOptions(data || []);
        } catch (error) {
            console.error('Error fetching ports:', error);
            setPortOptions([{ uuid: 'CGP-DXB', name: 'BANGLADESH - CHITTAGONG VIA DUBAI' }]);
        }
    };

    useEffect(() => {
        fetchPorts();
    }, []); 

    const handlePortChange = (e) => {
        const port = e.target.value;

        const selectedPort = portOptions.find(option => option.uuid === port);

        setSelectedPort(port);
    };

    return (
        <div className='md:mr-[2.5%]'>
            <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
                <h4 className='leading-[56px]'>Bulk Edit</h4>
                        
                {/* <button onClick={handleGoBack} className='w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                    <FaXmark className='mt-[2px]'/>
                        Close
                </button> */}
            </div>

            {successMessage && (
                <div className="w-full bg-green-100 text-green-800 text-start p-3 rounded-md my-6 flex justify-between">
                    {successMessage}
                    <FaXmark className='mt-[2px] hover:cursor-pointer' onClick={() => setSuccessMessage("")}/>
                </div>
            )}
            
            {errorMessage && (
                <div className="w-full bg-red-100 text-red-600 text-start p-3 rounded-md my-6 flex justify-between">
                    {errorMessage}
                    <FaXmark className='mt-[2px] hover:cursor-pointer' onClick={() => setErrorMessage("")}/>
                </div>
            )}

            <div className='my-8'>
                <div className='flex flex-col md:flex-row gap-6 md:gap-16 mb-8'>
                    <label>
                        <input
                            type="radio"
                            name="filterBy"
                            checked={filterBy === 'bulkEdit'}
                            // onChange={() => handleFilterByChange('vessel')}
                            onClick={() => {
                                setFilterBy('bulkEdit');
                                setSelectedFile(null);
                            }}
                            className='mr-1'
                        />
                        {' '}Bulk Schedule Edit
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="filterBy"
                            checked={filterBy === 'editOriginPort'}
                            // onChange={() => handleFilterByChange('origin')}
                            onClick={() => {
                                setFilterBy('editOriginPort');
                                setSelectedFile(null);
                            }}
                            className='mr-1'
                        />
                        {' '}Edit by Origin Port
                    </label>
                </div>
            </div>
            
            {filterBy === "bulkEdit" && (
                <>
                    <div className='my-16'>
                        <div className='flex flex-col md:flex-row gap-6 md:gap-16 mb-8'>
                            <p className='text-[16px] font-normal'>Delete Old Data</p>

                            <label>
                                <input
                                    type="radio"
                                    name="oldDataRadioButton"
                                    checked={oldDataRadioButton === 'yes'}
                                    // onChange={() => handleFilterByChange('vessel')}
                                    onClick={() => setOldDataRadioButton('yes')}
                                    className='mr-1'
                                />
                                {' '}Yes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="oldDataRadioButton"
                                    checked={oldDataRadioButton === 'no'}
                                    // onChange={() => handleFilterByChange('origin')}
                                    onClick={() => setOldDataRadioButton('no')}
                                    className='mr-1'
                                />
                                {' '}No
                            </label>
                        </div>
                    </div>

                    <div className="relative inline-block">
                        <div className='flex gap-6'>
                            <input
                                type="file"
                                accept=".xls, .xlsx"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleSelectedFileChange}
                            />
                            <button
                                type="button"
                                className="w-[115px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2"
                            >
                                Choose File
                            </button>

                            {selectedFile && (
                                <p className='text-[16px] leading-[40px] font-normal'>Selected file {selectedFile}</p>
                            )}

                            {!selectedFile && (
                                <p className='text-[16px] leading-[40px] font-normal'>Only Accepts Excel (.xls, .xlsx) format.</p>
                            )}
                        </div>
                    </div>
                    
                    {selectedFile && (
                        <div>
                            <div className='my-16'>
                                <div className='flex flex-col md:flex-row gap-6 md:gap-16 mb-8'>
                                    <p className='text-[16px] font-normal'>Delete Old Data</p>

                                    <label>
                                        <input
                                            type="radio"
                                            name="oldDataRadioButton"
                                            checked={oldDataRadioButton === 'yes'}
                                            // onChange={() => handleFilterByChange('vessel')}
                                            onClick={() => setOldDataRadioButton('yes')}
                                            className='mr-1'
                                        />
                                        {' '}Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="oldDataRadioButton"
                                            checked={oldDataRadioButton === 'no'}
                                            // onChange={() => handleFilterByChange('origin')}
                                            onClick={() => setOldDataRadioButton('no')}
                                            className='mr-1'
                                        />
                                        {' '}No
                                    </label>
                                </div>
                            </div>

                            <div className='overflow-auto'>
                                <table className="border-[#E6EDFF] border-[1px] w-full rounded-lg">
                                    <thead>
                                        <tr className='border-[1px] border-[#E6EDFF]'>
                                        <th>No</th>
                                        <th>Mother Vessel</th>
                                        <th>Voyage Ref</th>
                                        <th>CFS Closing</th>
                                        <th>FCL Closing</th>
                                        <th>Origin</th>
                                        <th>ETD</th>
                                        <th>ETA Dubai</th>
                                        <th>ETA Europe</th>
                                        <th>Transit Time</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {sortedData.map((row, index) => (
                                            <tr key={index} className='border-[1px] border-[#E6EDFF]'>
                                                <td>{(index + 1)}</td>
                                                <td>{row.vessel_name}</td>
                                                <td>{row.voyage_no}</td>
                                                <td>{new Date(row.cfs_closing).toLocaleDateString("en-GB")}</td>
                                                <td>{new Date(row.fcl_closing).toLocaleDateString("en-GB")}</td>
                                                <td>{row.origin}</td>
                                                <td>{new Date(row.etd).toLocaleDateString("en-GB") || "N/A"}</td>
                                                <td>{new Date(row.eta_transit).toLocaleDateString("en-GB")}</td>
                                                <td>{new Date(row.dst_eta).toLocaleDateString("en-GB")}</td>
                                                <td>{row.transit_time}</td>
                                                {/* <td><Link to={`/edit/${row.uuid}`}> Edit</Link></td> */}
                                                <td className="py-3 px-4 cursor-pointer">
                                                    <FaEllipsis className='w-[24px] h-[24px]'/>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='flex gap-6 mt-8'>
                                <button type='submit' className='w-[80px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                                    Save
                                </button>
                                
                                
                                <button 
                                    onClick={handleGoBack}
                                    type='button'
                                    className='w-[80px] h-[40px] text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white'
                                > 
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {filterBy === "editOriginPort" && (
                <>
                    <div className='my-16'>
                        <div>
                            <label className="text-[14px] mb-2 block">
                                Select Origin Port*
                            </label>

                            <select
                                value={selectedPort}
                                onChange={handlePortChange}
                                className="w-[340px] md:w-[384px] h-[66px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                            >
                                <option value="">Select...</option>
                                {portOptions.map((port, index) => (
                                    <option key={index} value={port.uuid}>{port.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="relative inline-block">
                        <div className='flex gap-6'>
                            <input
                                type="file"
                                accept=".xls, .xlsx"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleSelectedFileChange}
                            />
                            <button
                                type="button"
                                className="w-[115px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2"
                            >
                                Choose File
                            </button>

                            {selectedFile && (
                                <p className='text-[16px] leading-[40px] font-normal'>Selected file {selectedFile}</p>
                            )}

                            {!selectedFile && (
                                <p className='text-[16px] leading-[40px] font-normal'>Only Accepts Excel (.xls, .xlsx) format.</p>
                            )}
                        </div>
                    </div>
                    
                    {selectedFile && (
                        <div>
                            <div className='my-16'>
                                <div className='flex flex-col md:flex-row gap-6 md:gap-16 mb-8'>
                                    <p className='text-[16px] font-normal'>Delete Old Data</p>

                                    <label>
                                        <input
                                            type="radio"
                                            name="oldDataRadioButton"
                                            checked={oldDataRadioButton === 'yes'}
                                            // onChange={() => handleFilterByChange('vessel')}
                                            onClick={() => setOldDataRadioButton('yes')}
                                            className='mr-1'
                                        />
                                        {' '}Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="oldDataRadioButton"
                                            checked={oldDataRadioButton === 'no'}
                                            // onChange={() => handleFilterByChange('origin')}
                                            onClick={() => setOldDataRadioButton('no')}
                                            className='mr-1'
                                        />
                                        {' '}No
                                    </label>
                                </div>
                            </div>

                            <div className='overflow-auto'>
                                <table className="border-[#E6EDFF] border-[1px] w-full rounded-lg">
                                    <thead>
                                        <tr className='border-[1px] border-[#E6EDFF]'>
                                        <th>No</th>
                                        <th>Mother Vessel</th>
                                        <th>Voyage Ref</th>
                                        <th>CFS Closing</th>
                                        <th>FCL Closing</th>
                                        <th>Origin</th>
                                        <th>ETD</th>
                                        <th>ETA Dubai</th>
                                        <th>ETA Europe</th>
                                        <th>Transit Time</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {sortedPortData.map((row, index) => (
                                            <tr key={index} className='border-[1px] border-[#E6EDFF]'>
                                                <td>{(index + 1)}</td>
                                                <td>{row.vessel_name}</td>
                                                <td>{row.voyage_no}</td>
                                                <td>{new Date(row.cfs_closing).toLocaleDateString("en-GB")}</td>
                                                <td>{new Date(row.fcl_closing).toLocaleDateString("en-GB")}</td>
                                                <td>{row.origin}</td>
                                                <td>{new Date(row.etd).toLocaleDateString("en-GB") || "N/A"}</td>
                                                <td>{new Date(row.eta_transit).toLocaleDateString("en-GB")}</td>
                                                <td>{new Date(row.dst_eta).toLocaleDateString("en-GB")}</td>
                                                <td>{row.transit_time}</td>
                                                {/* <td><Link to={`/edit/${row.uuid}`}> Edit</Link></td> */}
                                                <td className="py-3 px-4 cursor-pointer">
                                                    <FaEllipsis className='w-[24px] h-[24px]'/>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='flex gap-6 mt-8'>
                                <button type='submit' className='w-[80px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                                    Save
                                </button>
                                
                                
                                <button 
                                    onClick={handleGoBack}
                                    type='button'
                                    className='w-[80px] h-[40px] text-[14px] flex justify-center items-center border border-[#E2E8F0] rounded-md focus:outline-none appearance-none bg-white'
                                > 
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}
