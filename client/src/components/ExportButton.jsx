import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileArrowDown, 
  faCircleNotch 
} from '@fortawesome/free-solid-svg-icons';
import * as jobService from '../services/jobService.js';
import { toast } from 'react-toastify';

const ExportButton = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await jobService.exportJobsToExcel();
      toast.success('Spreadsheet generated successfully');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to export jobs.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`
        flex items-center gap-3 px-5 py-2.5 
        text-sm font-bold transition-all duration-200
        rounded-2xl border
        ${loading 
          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-95'
        }
      `}
    >
      {loading ? (
        <>
          <FontAwesomeIcon icon={faCircleNotch} spin className="text-blue-600" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faFileArrowDown} className="text-blue-600" />
          <span>Export to Excel</span>
        </>
      )}
    </button>
  );
};

export default ExportButton;