import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ShippingEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    voyage_no: '',
    port_id: '',
    vessel_id: '',
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

  // Fetch options for dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch ports
        const portsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/port`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        if (!portsResponse.ok) throw new Error(`Failed to fetch ports: ${portsResponse.status}`);
        const portsResult = await portsResponse.json();
        setPortOptions(portsResult.data || []);

        // Fetch vessels
        const vesselsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/vessel`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        if (!vesselsResponse.ok) throw new Error(`Failed to fetch vessels: ${vesselsResponse.status}`);
        const vesselsResult = await vesselsResponse.json();
        setVesselOptions(vesselsResult.data || []);

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

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/${id}`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        
        if (!response.ok) throw new Error(`Failed to fetch record: ${response.status}`);
        
        const result = await response.json();
        if (result.error === false && result.data?.length > 0) {
          const formattedData = result.data[0];
          setFormData({
            ...formattedData,
            cfs_closing: formatDateForInput(formattedData.cfs_closing),
            fcl_closing: formatDateForInput(formattedData.fcl_closing),
            eta_transit: formatDateForInput(formattedData.eta_transit),
            etd: formatDateForInput(formattedData.etd),
            dst_eta: formatDateForInput(formattedData.dst_eta)
          });
        } else {
          throw new Error('No data found or invalid response format');
        }
      } catch (error) {
        console.error('Error fetching record:', error);
        setError('Failed to load record data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecordData();
    else {
      setLoading(false);
      setError('No record ID provided');
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch (e) {
      console.error('Invalid date format:', e);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/${id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`Failed to update record: ${response.status}`);
      
      alert('Record updated successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error updating record:', error);
      setError('Failed to update record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  const renderFormField = (name) => {
    // Check if the field should be a dropdown
    if (name === 'port_id') {
      return (
        <select
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          required
        >
          <option value="">Select Port</option>
          {portOptions.map((port) => (
            <option key={port.id} value={port.id}>
              {port.transit}
            </option>
          ))}
        </select>
      );
    } else if (name === 'vessel_id') {
      return (
        <select
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          required
        >
          <option value="">Select Vessel</option>
          {vesselOptions.map((vessel) => (
            <option key={vessel.id} value={vessel.id}>
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
          required
        >
          <option value="">Select Destination</option>
          {destinationOptions.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.destination}
            </option>
          ))}
        </select>
      );
    } else if (['cfs_closing', 'fcl_closing', 'etd', 'eta_transit', 'dst_eta'].includes(name)) {
      return (
        <input
          type="datetime-local"
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          required={['voyage_no', 'vessel_id', 'port_id', 'destination'].includes(name)}
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
          required={['voyage_no', 'vessel_id', 'port_id', 'destination'].includes(name)}
        />
      );
    }
  };

  if (loading && !formData.voyage_no) return <div style={{ padding: '20px' }}>Loading record data...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Edit Shipping Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          {['voyage_no', 'vessel_id', 'port_id', 'cfs_closing', 'fcl_closing', 'etd', 'eta_transit', 'destination', 'dst_eta', 'transit_time'].map((name) => (
            <div key={name}>
              <label style={{ display: 'block', marginBottom: '5px' }}>{name.replace('_', ' ').toUpperCase()}</label>
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
            {loading ? 'Updating...' : 'Update Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingEdit;