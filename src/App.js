import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShippingTable = () => {

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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/vessel`, {
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/location/countries`, {
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/port?countryID=${country}`, {
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/destinations?transitHub=${port}&counrty=${selectedCountry}`, {
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/voyages/${vessel}`, {
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/ports?voyageRef=${voyage}&vesselID=${selectedVessel}`, {
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/destinations?vesselID=${vessel}&voyageRef=${voyage}&transitHub=${transit}`, {
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
        `${process.env.REACT_APP_BASE_URL}/api/admin/schedule?vesselID=${selectedVessel}&voyageRef=${selectedVoyage}&transitHub=${selectedTransit}&destination=${selectedDestination}`, {
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
        `${process.env.REACT_APP_BASE_URL}/api/admin/schedule?country=${selectedCountry}&transitID=${selectedPort}&destination=${selectedOriginDestination}`, {
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


  const getSelectedTransitName = () => {
    if (filterBy === 'vessel' && selectedTransit) {
      const transit = transitOptions.find(t => t.uuid === selectedTransit);
      return transit ? transit.transit : 'Transit';
    } else if (filterBy === 'origin' && selectedPort) {
      const port = portOptions.find(p => p.uuid === selectedPort);
      return port ? port.origin : 'Transit';
    }
    return 'Transit';
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Filter options */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '20px' }}>
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
        <Link to={"/add"} style={{marginLeft:'20px'}} ><button>Add +</button></Link>
      </div>

      {/* Filter dropdowns */}
      {filterBy === 'vessel' ? (
        // Vessel Name Filter
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Select Vessel*</label>
            <select
              value={selectedVessel}
              onChange={handleVesselChange}
              style={{ padding: '8px', width: '200px' }}
            >
              <option value="">Select...</option>
              {vesselOptions.map((vessel, index) => (
                <option key={index} value={vessel.uuid}>{vessel.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Voyage Ref*</label>
            <select
              value={selectedVoyage}
              onChange={handleVoyageChange}
              style={{ padding: '8px', width: '200px' }}
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
            <label style={{ display: 'block', marginBottom: '5px' }}>Transit Hub*</label>
            <select
              value={selectedTransit}
              onChange={handleTransitChange}
              style={{ padding: '8px', width: '200px' }}
              disabled={!selectedVoyage}
            >
              <option value="">Select...</option>
              {transitOptions.map((transit, index) => (
                <option key={index} value={transit.transit}>{transit.transit}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Destination*</label>
            <select
              value={selectedDestination}
              onChange={handleDestinationChange}
              style={{ padding: '8px', width: '200px' }}
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
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Select Country*</label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              style={{ padding: '8px', width: '200px' }}
            >
              <option value="">Select...</option>
              {countryOptions.map((country, index) => (
                <option key={index} value={country.uuid}>{country.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Select Port*</label>
            <select
              value={selectedPort}
              onChange={handlePortChange}
              style={{ padding: '8px', width: '200px' }}
              disabled={!selectedCountry}
            >
              <option value="">Select...</option>
              {portOptions.map((port, index) => (
                <option key={index} value={port.uuid}>{port.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Destination*</label>
            <select
              value={selectedOriginDestination}
              onChange={handleOriginDestinationChange}
              style={{ padding: '8px', width: '200px' }}
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
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>No</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Mother Vessel</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Voyage Ref</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>CFS Closing</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>FCL Closing</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Origin</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>ETD</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>ETA{getSelectedTransitName()}</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>ETA {selectedOriginDestination || selectedDestination}</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Transit Time</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{row.id || (index + 1)}</td>
                  <td style={{ padding: '10px' }}>{row.vessel_name}</td>
                  <td style={{ padding: '10px' }}>{row.voyage_no}</td>
                  <td style={{ padding: '10px' }}>{new Date(row.cfs_closing).toLocaleDateString("en-GB")}</td>
                  <td style={{ padding: '10px' }}>{new Date(row.fcl_closing).toLocaleDateString("en-GB")}</td>
                  <td style={{ padding: '10px' }}>{row.origin}</td>
                  <td style={{ padding: '10px' }}>{new Date(row.etd).toLocaleDateString("en-GB") || "N/A"}</td>
                  <td style={{ padding: '10px' }}>{new Date(row.eta_transit).toLocaleDateString("en-GB")}</td>
                  <td style={{ padding: '10px' }}>{new Date(row.dst_eta).toLocaleDateString("en-GB")}</td>
                  <td style={{ padding: '10px' }}>{row.transit_time}</td>
                  <td style={{ padding: '10px' }} ><Link to={`/edit/${row.uuid}`}> Edit</Link></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" style={{ padding: '10px', textAlign: 'center' }}>
                  No data available. Please select all filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingTable;