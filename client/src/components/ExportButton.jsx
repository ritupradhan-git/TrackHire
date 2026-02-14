// ExportButton.jsx
import React, { useState } from 'react';
import * as jobService from '../services/jobService.js';
import { toast } from 'react-toastify'; // Assuming you use toast

const ExportButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => { // Make this async to await jobService call
    setLoading(true);
    setError('');
    try {
      await jobService.exportJobsToExcel(); // Await the async function
      toast.success('Jobs exported successfully!');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to export jobs.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {/* ... error display ... */}
      <button
        onClick={handleExport}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition duration-300 ease-in-out ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        }`}
      >
        {loading ? 'Exporting...' : 'Export to Excel'}
      </button>
    </div>
  );
};

export default ExportButton;