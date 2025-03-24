import React, { useState, useEffect } from 'react';
import { FaXmark, FaEllipsis, FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import styles from "./scheduleList.module.css";

export default function ScheduleList() {

    const [filterBy, setFilterBy] = useState('vessel'); // 'vessel' or 'origin'

    // For vessel filter
    const [selectedVessel, setSelectedVessel] = useState('');
    const [selectedVoyage, setSelectedVoyage] = useState('');
    const [selectedTransit, setSelectedTransit] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');

    // For origin port filter
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedPort, setSelectedPort] = useState('');
    const [selectedOriginDestination, setSelectedOriginDestination] = useState('');

    // Options for dropdowns
    const [vesselOptions, setVesselOptions] = useState([]);
    const [voyageOptions, setVoyageOptions] = useState([]);
    const [transitOptions, setTransitOptions] = useState([]);
    const [destinationOptions, setDestinationOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [portOptions, setPortOptions] = useState([]);
    const [originDestinationOptions, setOriginDestinationOptions] = useState([]);

    // Table data
    const [tableData, setTableData] = useState([]);

    // Initial fetch for vessel names or countries based on filter type
    useEffect(() => {
        if (filterBy === 'vessel') {
        fetchVesselNames();
        } else {
        fetchCountries();
        }
    }, [filterBy]);

    // Fetch vessel names
    const fetchVesselNames = async () => {
        try {
        const response = await fetch('/api/admin/vessel', {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        });
        const { data } = await response.json();
        setVesselOptions(data || []);
        } catch (error) {
        console.error('Error fetching vessel names:', error);
        }
    };

    // Fetch countries for origin port filter
    const fetchCountries = async () => {
        try {
        const response = await fetch('/api/admin/location/countries', {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        });
        const { data } = await response.json();
        setCountryOptions(data || []);
        } catch (error) {
        console.error('Error fetching countries:', error);
        }
    };

    // Fetch ports based on selected country
    const fetchPorts = async (country) => {
        if (!country) return;

        try {
        const response = await fetch(`/api/admin/port?countryID=${country}`, {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        });
        const { data } = await response.json();
        setPortOptions(data || []);
        } catch (error) {
        console.error('Error fetching ports:', error);
        // Fallback data if API is not available
        setPortOptions([{ uuid: 'CGP-DXB', name: 'BANGLADESH - CHITTAGONG VIA DUBAI' }]);
        }

        setSelectedPort('');
        setSelectedOriginDestination('');
        setOriginDestinationOptions([]);
        setTableData([]); // Clear table data when country changes
    };

    // Fetch destinations for origin port
    const fetchOriginDestinations = async (port) => {
        if (!port) return;

        try {
        const response = await fetch(`/api/admin/schedule/destinations?transitHub=${port}&counrty=${selectedCountry}`, {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        });
        const { data } = await response.json();
        setOriginDestinationOptions(data || []);
        } catch (error) {
        console.error('Error fetching origin destinations:', error);
        }

        setSelectedOriginDestination('');
        setTableData([]); // Clear table data when port changes
    };

    // Fetch voyage references based on selected vessel
    const fetchVoyageRefs = async (vessel) => {
        if (!vessel) return;

        try {
        const response = await fetch(`/api/admin/schedule/voyages/${vessel}`, {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        });
        const { data } = await response.json();
        setVoyageOptions(data || []);
        } catch (error) {
        console.error('Error fetching voyage refs:', error);
        }

        setSelectedVoyage('');
        setSelectedTransit('');
        setSelectedDestination('');
        setTransitOptions([]);
        setDestinationOptions([]);
        setTableData([]); // Clear table data when vessel changes
    };

    // Fetch transit hubs based on selected vessel and voyage
    const fetchTransitHubs = async (vessel, voyage) => {
        if (!vessel || !voyage) return;

        try {
        const response = await fetch(`/api/admin/schedule/ports?voyageRef=${voyage}&vesselID=${selectedVessel}`, {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        });
        const { data } = await response.json();
        setTransitOptions(data || []);
        } catch (error) {
        console.error('Error fetching transit hubs:', error);
        }

        setSelectedTransit('');
        setSelectedDestination('');
        setDestinationOptions([]);
        setTableData([]); // Clear table data when voyage changes
    };

    // Fetch destinations based on selected vessel, voyage, and transit
    const fetchDestinations = async (vessel, voyage, transit) => {
        if (!vessel || !voyage || !transit) return;

        try {
        const response = await fetch(`/api/admin/schedule/destinations?vesselID=${vessel}&voyageRef=${voyage}&transitHub=${transit}`, {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        });
        const { data } = await response.json();
        setDestinationOptions(data || []);
        } catch (error) {
        console.error('Error fetching destinations:', error);
        }

        setSelectedDestination('');
        setTableData([]); // Clear table data when transit changes
    };

    // Fetch table data based on vessel filter
    const fetchVesselTableData = async () => {
        if (!selectedVessel || !selectedVoyage || !selectedTransit || !selectedDestination) return;

        try {
        const response = await fetch(
            `/api/admin/schedule?vesselID=${selectedVessel}&voyageRef=${selectedVoyage}&transitHub=${selectedTransit}&destination=${selectedDestination}`, {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        }
        );
        const { data } = await response.json();
        setTableData(data || []);
        } catch (error) {
        console.error('Error fetching vessel table data:', error);
        }
    };

    // Fetch table data based on origin port filter
    const fetchOriginTableData = async () => {
        if (!selectedCountry || !selectedPort || !selectedOriginDestination) return;

        try {
        const response = await fetch(
            `/api/admin/schedule?country=${selectedCountry}&transitID=${selectedPort}&destination=${selectedOriginDestination}`, {
            headers: {
            "ngrok-skip-browser-warning": "true"
            }
        }
        );
        const { data } = await response.json();
        setTableData(data || []);
        } catch (error) {
        console.error('Error fetching origin table data:', error);
        }
    };

    // Handle vessel selection
    const handleVesselChange = (e) => {
        const vessel = e.target.value;
        setSelectedVessel(vessel);
        fetchVoyageRefs(vessel);
    };

    // Handle voyage selection
    const handleVoyageChange = (e) => {
        const voyage = e.target.value;
        setSelectedVoyage(voyage);
        fetchTransitHubs(selectedVessel, voyage);
    };

    // Handle transit selection
    const handleTransitChange = (e) => {
        const transit = e.target.value;
        setSelectedTransit(transit);
        fetchDestinations(selectedVessel, selectedVoyage, transit);
    };

    // Handle destination selection
    const handleDestinationChange = (e) => {
        const destination = e.target.value;
        setSelectedDestination(destination);
        // Table data will be fetched via useEffect when all selections are made
    };

    // Handle country selection for origin port filter
    const handleCountryChange = (e) => {
        const country = e.target.value;
        setSelectedCountry(country);
        fetchPorts(country);
    };

    // Handle port selection for origin port filter
    const handlePortChange = (e) => {
        const port = e.target.value;

        const selectedPort = portOptions.find(option => option.uuid === port);

        setSelectedPort(port);
        fetchOriginDestinations(selectedPort?.transit);
    };

    // Handle destination selection for origin port filter
    const handleOriginDestinationChange = (e) => {
        const destination = e.target.value;
        setSelectedOriginDestination(destination);
        // Table data will be fetched via useEffect when all selections are made
    };

    // Handle filter type change
    const handleFilterByChange = (method) => {
        setFilterBy(method);

        // Reset all selections
        setSelectedVessel('');
        setSelectedVoyage('');
        setSelectedTransit('');
        setSelectedDestination('');
        setSelectedCountry('');
        setSelectedPort('');
        setSelectedOriginDestination('');
        setTableData([]);

        // Clear all options except the ones needed for the selected filter
        if (method === 'vessel') {
        setPortOptions([]);
        setOriginDestinationOptions([]);
        } else {
        setVoyageOptions([]);
        setTransitOptions([]);
        setDestinationOptions([]);
        }
    };

    // Fetch table data when all required selections are made
    useEffect(() => {
        if (filterBy === 'vessel' && selectedVessel && selectedVoyage && selectedTransit && selectedDestination) {
        fetchVesselTableData();
        }
    }, [filterBy, selectedVessel, selectedVoyage, selectedTransit, selectedDestination]);

    // Separate useEffect for origin filter to ensure it only runs when all selections are made
    useEffect(() => {
        if (filterBy === 'origin' && selectedCountry && selectedPort && selectedOriginDestination) {
        fetchOriginTableData();
        }
    }, [filterBy, selectedCountry, selectedPort, selectedOriginDestination]);

    const sortedData = [...tableData].sort((a, b) => {
        const dateA = new Date(a.etd.split('/').reverse().join('-'));
        const dateB = new Date(b.etd.split('/').reverse().join('-'));
        return dateA - dateB;
    });

    return (
        <div>
            <div>
                <div className='md:mr-[2.5%]'>
                    <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
                        <h4 className='leading-[56px]'>Schedule</h4>
                        
                        <div className='flex flex-col md:flex-row gap-8 mb-8'>
                            <Link to="/">
                                <button className='w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                                    Bulk Edit
                                </button>
                            </Link>

                            <Link to="/create-schedule">
                                <button className='w-[165px] h-[40px] bg-[#16A34A] rounded-md text-white text-[14px] flex justify-center items-center gap-2 '> 
                                    <FaPlus className='mt-[2px]'/>
                                    Create Schedule
                                </button>
                            </Link>
                        </div>
                    </div>


                    <div className='my-8'>
                        {/* Filter options */}
                        <div className='flex flex-col md:flex-row gap-6 md:gap-16 mb-8'>
                            <label>
                                <input
                                    type="radio"
                                    name="filterBy"
                                    checked={filterBy === 'vessel'}
                                    onChange={() => handleFilterByChange('vessel')}
                                />
                                {' '}List by Vessel Name
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="filterBy"
                                    checked={filterBy === 'origin'}
                                    onChange={() => handleFilterByChange('origin')}
                                />
                                {' '}List by Origin Port
                            </label>
                        </div>

                        {/* Filter dropdowns */}
                        {filterBy === 'vessel' ? (
                            // Vessel Name Filter
                            <div className='flex flex-col md:flex-row gap-[20px] mb-8'>
                                <div>
                                    <label className="text-[14px] mb-2 block">
                                        Select Vessel*
                                    </label>
                                    <select
                                        value={selectedVessel}
                                        onChange={handleVesselChange}
                                        className="w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                        >
                                        <option value="">Select...</option>
                                        {vesselOptions.map((vessel, index) => (
                                            <option key={index} value={vessel.uuid}>{vessel.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[14px] mb-2 block">
                                        Voyage Ref*
                                    </label>

                                    <select
                                        value={selectedVoyage}
                                        onChange={handleVoyageChange}
                                        className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${
                                            !selectedVessel ? 'cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                        disabled={!selectedVessel}
                                    >
                                        <option value="">Select...</option>
                                        <option value="ALL">All</option>
                                        {voyageOptions.map((voyage, index) => (
                                            <option key={index} value={voyage.voyage_no}>{voyage.voyage_no}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[14px] mb-2 block">
                                        Transit Hub*
                                    </label>

                                    <select
                                        value={selectedTransit}
                                        onChange={handleTransitChange}
                                        className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${
                                            !selectedVoyage ? 'cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                        disabled={!selectedVoyage}
                                        >
                                        <option value="">Select...</option>
                                        {transitOptions.map((transit, index) => (
                                            <option key={index} value={transit.transit}>{transit.transit}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[14px] mb-2 block">
                                        Destination*
                                    </label>

                                    <select
                                        value={selectedDestination}
                                        onChange={handleDestinationChange}
                                        className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${
                                            !selectedTransit ? 'cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                        disabled={!selectedTransit}
                                        >
                                        <option value="">Select...</option>
                                        {destinationOptions.map((destination, index) => (
                                            <option key={index} value={destination.uuid}>{destination.destination}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            // Origin Port Filter
                            <div className='flex flex-col md:flex-row gap-[20px] mb-8'>
                                <div>
                                    <label className="text-[14px] mb-2 block">
                                        Select Country*
                                    </label>

                                    <select
                                        value={selectedCountry}
                                        onChange={handleCountryChange}
                                        className="w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white"
                                    >
                                        <option value="">Select...</option>
                                        {countryOptions.map((country, index) => (
                                            <option key={index} value={country.uuid}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[14px] mb-2 block">
                                        Select Port*
                                    </label>

                                    <select
                                        value={selectedPort}
                                        onChange={handlePortChange}
                                        className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${
                                            !selectedCountry ? 'cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                        disabled={!selectedCountry}
                                        >
                                        <option value="">Select...</option>
                                        {portOptions.map((port, index) => (
                                            <option key={index} value={port.uuid}>{port.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[14px] mb-2 block">
                                        Destination*
                                    </label>
                                    <select
                                        value={selectedOriginDestination}
                                        onChange={handleOriginDestinationChange}
                                        className={`w-[300px] md:w-[200px] LapL:w-[250px] h-[40px] border border-[#E2E8F0] rounded-md px-3 focus:outline-none appearance-none bg-white ${
                                            !selectedPort ? 'cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                        disabled={!selectedPort}
                                        >
                                        <option value="">Select...</option>
                                        {originDestinationOptions.map((destination, index) => (
                                            <option key={index} value={destination.uuid}>{destination.destination}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        {/* Table */}
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
                                    <th>ETA {selectedTransit || portOptions.find(val => val.uuid === selectedPort)?.transit }</th>
                                    <th>ETA {selectedOriginDestination || selectedDestination }</th>
                                    <th>Transit Time</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.length > 0 ? (
                                    sortedData.map((row, index) => (
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
                                    ))
                                    ) : (
                                    <tr>
                                        <td colSpan="11" className={styles.noDataFound}>
                                            No data available. Please select all filters.
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
