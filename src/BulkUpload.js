import React, { useState } from 'react';

const BulkScheduleUpload = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setError(null);
        setResponse(null);
    };

    const validateFile = (file) => {
        if (!file) {
            setError('Please select a file');
            return false;
        }

        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload only Excel files (.xlsx or .xls)');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFile(file)) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setResponse(null);

        const formData = new FormData();
        formData.append('scheduleFile', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/schedule/bulk`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload schedules');
            }

            setResponse(data);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Bulk Import Schedules</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="scheduleFile">Select Excel File:</label>
                    <input
                        type="file"
                        id="scheduleFile"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" disabled={isLoading || !file}>
                    {isLoading ? 'Processing...' : 'Process File'}
                </button>
            </form>

            {error && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    Error: {error}
                </div>
            )}

            {response && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Processing Results:</h3>
                    <p>Total records processed: {response.data.total}</p>
                    <p>Created: {response.data.created}</p>
                    <p>Updated: {response.data.updated}</p>
                    <p>Failed: {response.data.failed}</p>

                    {response.data.failed > 0 && (
                        <div>
                            <h4>Failed Records:</h4>
                            <ul>
                                {response.data.errors.map((error, index) => (
                                    <li key={index}>
                                        Row data: {JSON.stringify(error.row)}<br />
                                        Error: {error.error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BulkScheduleUpload;