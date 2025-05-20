import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NetworkDebugger = () => {
  const [apiStatus, setApiStatus] = useState({
    loading: true,
    error: null,
    baseUrl: axios.defaults.baseURL,
    response: null
  });

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        // Test a simple GET request to your API
        const response = await axios.get('/api/products');
        setApiStatus({
          loading: false,
          error: null,
          baseUrl: axios.defaults.baseURL,
          response: {
            status: response.status,
            data: response.data.slice(0, 2), // Just show first 2 items to avoid clutter
            dataCount: response.data.length
          }
        });
      } catch (err) {
        setApiStatus({
          loading: false,
          error: {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
          },
          baseUrl: axios.defaults.baseURL,
          response: null
        });
      }
    };

    testApiConnection();
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">Network Diagnostics</h5>
      </div>
      <div className="card-body">
        <p><strong>API Base URL:</strong> {apiStatus.baseUrl}</p>
        
        {apiStatus.loading ? (
          <p>Testing API connection...</p>
        ) : apiStatus.error ? (
          <div className="alert alert-danger">
            <h6>API Connection Error:</h6>
            <pre className="mb-0">{JSON.stringify(apiStatus.error, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <div className="alert alert-success">
              <strong>Connection Successful!</strong> Received {apiStatus.response.dataCount} products.
            </div>
            <div>
              <h6>Sample Data:</h6>
              <pre className="border rounded p-2" style={{maxHeight: '150px', overflow: 'auto'}}>
                {JSON.stringify(apiStatus.response.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <h6 className="mt-3">Test Search & Sort:</h6>
        <div className="d-flex gap-2 flex-wrap">
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={async () => {
              try {
                const response = await axios.get('/api/products?search=flower');
                alert(`Search for 'flower' returned ${response.data.length} results`);
              } catch (err) {
                alert(`Error: ${err.message}`);
              }
            }}
          >
            Test Search
          </button>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={async () => {
              try {
                const response = await axios.get('/api/products?sort=price-low-high');
                alert(`Sort by price (low to high) returned ${response.data.length} results`);
              } catch (err) {
                alert(`Error: ${err.message}`);
              }
            }}
          >
            Test Sort
          </button>
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={async () => {
              try {
                const response = await axios.get('/api/products?search=rose&sort=price-low-high');
                alert(`Search 'rose' + sort returned ${response.data.length} results`);
              } catch (err) {
                alert(`Error: ${err.message}`);
              }
            }}
          >
            Test Both
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkDebugger;