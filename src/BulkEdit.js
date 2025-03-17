import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ShippingScheduleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    voyage_no: '',
    port_uuid: '',
    vessel_uuid: '',
    cfs_closing: '',
    fcl_closing: '',
    eta_transit: '',
    etd: '',
    destination: '',
    dst_eta: '',
    transit_time: ''
  });

  // Add states for dropdown options
  const [portOptions, setPortOptions] = useState([]);
  const [vesselOptions, setVesselOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  // Field labels mapping
  const fieldLabels = {
    voyage_no: 'Voyage Number',
    port_uuid: 'Transit Hub',
    vessel_uuid: 'Vessel Name',
    cfs_closing: 'CFS Closing Date',
    fcl_closing: 'FCL Closing Date',
    eta_transit: 'ETA at Transit',
    etd: 'ETD',
    destination: 'Destination',
    dst_eta: 'Destination ETA',
    transit_time: 'Transit Time (Days)'
  };

  // List of fields to show in the form
  const fieldsToShow = [
    'voyage_no',
    'port_uuid',
    'vessel_uuid',
    'cfs_closing',
    'fcl_closing',
    'eta_transit',
    'etd',
    'destination',
    'dst_eta',
    'transit_time'
  ];

  // Fetch record data first, then fetch options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch options first (required for both add and edit)
        await fetchOptions(formData.vessel_uuid);
        
        // For edit mode, fetch existing record data
        if (isEditMode) {
          if (!id) {
            setError('No record ID provided');
            setLoading(false);
            return;
          }
          
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/${id}`, {
            headers: { "ngrok-skip-browser-warning": "true" }
          });

          if (!response.ok) throw new Error(`Failed to fetch record: ${response.status}`);

          const result = await response.json();
          if (result.error === false && result.data?.length > 0) {
            const formattedData = result.data[0];

            // Pick only the fields we need
            const filteredData = {};
            fieldsToShow.forEach(field => {
              if (field in formattedData) {
                filteredData[field] = formattedData[field];
              }
            });

            const updatedFormData = {
              ...filteredData,
              cfs_closing: formatDateForInput(formattedData.cfs_closing),
              fcl_closing: formatDateForInput(formattedData.fcl_closing),
              eta_transit: formatDateForInput(formattedData.eta_transit),
              etd: formatDateForInput(formattedData.etd),
              dst_eta: formatDateForInput(formattedData.dst_eta)
            };
            
            setFormData(updatedFormData);
            
            // Now fetch ports specific to this vessel
            if (updatedFormData.vessel_uuid) {
              await fetchPortsForVessel(updatedFormData.vessel_uuid);
            }
          } else {
            throw new Error('No data found or invalid response format');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const fetchOptions = async (vesselId = null) => {
    try {
      // Fetch vessels
      const vesselsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/vessel`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!vesselsResponse.ok) throw new Error(`Failed to fetch vessels: ${vesselsResponse.status}`);
      const vesselsResult = await vesselsResponse.json();
      setVesselOptions(vesselsResult.data || []);

      // Fetch ports (if vesselId is provided, fetch ports for that vessel)
      const portsUrl = isEditMode
        ? `${process.env.REACT_APP_BASE_URL}/api/admin/schedule/ports?vesselID=${vesselId}`
        : `${process.env.REACT_APP_BASE_URL}/api/admin/port`;
      
      const portsResponse = await fetch(portsUrl, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!portsResponse.ok) throw new Error(`Failed to fetch ports: ${portsResponse.status}`);
      const portsResult = await portsResponse.json();
      setPortOptions(portsResult.data || []);

      // Fetch destinations
      const destinationsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/destinations`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!destinationsResponse.ok) throw new Error(`Failed to fetch destinations: ${destinationsResponse.status}`);
      const destinationsResult = await destinationsResponse.json();
      setDestinationOptions(destinationsResult.data || []);
    } catch (error) {
      console.error('Error fetching options:', error);
      setError('Failed to load dropdown options. Please try again.');
    }
  };

  useEffect(() => {
    // Only fetch ports if vessel_uuid is valid
    if (formData.vessel_uuid) {
      fetchPortsForVessel(formData.vessel_uuid);
    }
  }, [formData.vessel_uuid]);
  

  const fetchPortsForVessel = async (vesselId) => {
    if (!vesselId) return;
    
    try {
      const portsUrl = isEditMode
      ? `${process.env.REACT_APP_BASE_URL}/api/admin/schedule/ports?vesselID=${vesselId}`
      : `${process.env.REACT_APP_BASE_URL}/api/admin/port`;

      const portsResponse = await fetch(portsUrl, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      
      if (!portsResponse.ok) throw new Error(`Failed to fetch ports: ${portsResponse.status}`);
      
      const portsResult = await portsResponse.json();
      setPortOptions(portsResult.data || []);
    } catch (error) {
      console.error('Error fetching ports for selected vessel:', error);
    }
  };

  // Update ports when vessel selection changes
  useEffect(() => {
    if (formData.vessel_uuid) {
      fetchPortsForVessel(formData.vessel_uuid);
    }
  }, [formData.vessel_uuid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Modified to only format date (no time)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Get only YYYY-MM-DD part
    } catch (e) {
      console.error('Invalid date format:', e);
      return '';
    }
  };

  // Prepare date for sending to backend - maintain original format
  const formatDateForSubmission = (dateString) => {
    if (!dateString) return '';
    try {
      // Ensure we have the date in YYYY-MM-DD format and add T00:00:00 to maintain API format
      return `${dateString}T00:00:00`;
    } catch (e) {
      console.error('Error formatting date for submission:', e);
      return dateString;
    }
  };

  const validateForm = () => {
    // Required fields based on the backend controller
    const requiredFields = [
      'voyage_no', 
      'port_uuid', 
      'vessel_uuid', 
      'cfs_closing', 
      'fcl_closing', 
      'eta_transit', 
      'destination', 
      'dst_eta', 
      'transit_time', 
      'etd'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      window.alert(`Please fill in all required fields: ${missingFields.map(field => fieldLabels[field]).join(', ')}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);

      // Prepare data for backend - map port_uuid and vessel_uuid to port_id and vessel_id
      const dataToSend = { ...formData };

      // Format date fields for API submission
      const dateFields = ['cfs_closing', 'fcl_closing', 'eta_transit', 'etd', 'dst_eta'];
      dateFields.forEach(field => {
        if (dataToSend[field]) {
          dataToSend[field] = formatDateForSubmission(dataToSend[field]);
        }
      });

      // Map port_uuid to port_id
      if (dataToSend.port_uuid) {
        dataToSend.port_id = dataToSend.port_uuid;
        delete dataToSend.port_uuid;
      }

      // Map vessel_uuid to vessel_id
      if (dataToSend.vessel_uuid) {
        dataToSend.vessel_id = dataToSend.vessel_uuid;
        delete dataToSend.vessel_uuid;
      }

      let response;
      let successMessage;
      
      if (isEditMode) {
        // Update existing record
        response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/${id}/edit`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', "ngrok-skip-browser-warning": "true" },
          body: JSON.stringify(dataToSend)
        });
        successMessage = 'Record updated successfully!';
      } else {
        // Create new record
        response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', "ngrok-skip-browser-warning": "true" },
          body: JSON.stringify(dataToSend)
        });
        successMessage = 'Schedule added successfully!';
      }

      const result = await response.json();

      if (result.error) {
        // Show error message from API
        window.alert(result.data || result.message || "An error occurred");
      } else {
        // Success message
        window.alert(successMessage);
        navigate(-1);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} record:`, error);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} record. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  const renderFormField = (name) => {
    // Determine if field should be disabled in edit mode
    const isDisabledInEditMode = isEditMode && ['voyage_no', 'vessel_uuid',"port_uuid","destination"].includes(name);
    
    // Check if the field should be a dropdown
    if (name === 'port_uuid') {
      return (
        <select
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          required
          disabled={isDisabledInEditMode}
        >
          <option value="">Select Port</option>
          {portOptions.map((port) => (
            <option key={port.uuid} value={port.uuid}>
              {isEditMode ? port.transit : port.name}
            </option>
          ))}
        </select>
      );
    } else if (name === 'vessel_uuid') {
      return (
        <select
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          required
          disabled={isDisabledInEditMode}
        >
          <option value="">Select Vessel</option>
          {vesselOptions.map((vessel) => (
            <option key={vessel.uuid} value={vessel.uuid}>
              {vessel.name}
            </option>
          ))}
        </select>
      );
    } else if (name === 'destination') {
      return (
        <select
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          disabled={isDisabledInEditMode}
          required
        >
          <option value="">Select Destination</option>
          {destinationOptions.map((destination) => (
            <option key={destination.uuid} value={destination.uuid}>
              {destination.destination}
            </option>
          ))}
        </select>
      );
    } else if (['cfs_closing', 'fcl_closing', 'etd', 'eta_transit', 'dst_eta'].includes(name)) {
      return (
        <input
          type="date"
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          required
        />
      );
    } else {
      return (
        <input
          type="text"
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          required
          disabled={isDisabledInEditMode}
        />
      );
    }
  };

  if (loading && !formData.voyage_no && isEditMode) return <div style={{ padding: '20px' }}>Loading record data...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>{isEditMode ? 'Edit' : 'Add'} Shipping Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          {fieldsToShow.map((name) => (
            <div key={name}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {fieldLabels[name] || name.replace(/_/g, ' ').toUpperCase()}
                {['voyage_no', 'port_uuid', 'vessel_uuid', 'cfs_closing', 'fcl_closing', 'eta_transit', 'destination', 'dst_eta', 'transit_time', 'etd'].includes(name) && <span style={{ color: 'red' }}> *</span>}
              </label>
              {renderFormField(name)}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{ padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            disabled={loading}
          >
            {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Schedule' : 'Add Schedule')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShippingScheduleForm;