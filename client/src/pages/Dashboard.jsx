import React, { useEffect, useState, useCallback, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import * as jobService from '../services/jobService.js';
import JobCard from '../components/JobCard.jsx';
import JobForm from '../components/JobForm.jsx';
import ExportButton from '../components/ExportButton.jsx';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const jobStatuses = ['All', 'Saved', 'Applied', 'Interview', 'Rejected'];

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [jobListLoading, setJobListLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  // Filters and Sorting
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('dateAddedDesc');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated || authLoading) {
      setJobListLoading(false);
      return;
    }

    setJobListLoading(true);
    setError('');
    try {
      const filters = {};
      if (filterStatus !== 'All') {
        filters.status = filterStatus;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }
      if (sortBy) {
        filters.sortBy = sortBy;
      }

      const fetchedJobs = await jobService.getAllJobs(filters);

      // --- CRITICAL FIX START ---
      // Ensure fetchedJobs is an array before setting the state
      if (Array.isArray(fetchedJobs)) {
        setJobs(fetchedJobs);
      } else if (fetchedJobs && typeof fetchedJobs === 'object' && Array.isArray(fetchedJobs.data)) {
        // If the API response is like { data: [...] }
        setJobs(fetchedJobs.data);
      }
      else {
        // If it's not an array and not an object with a 'data' array,
        // treat it as an empty array or log an error.
        console.warn("API did not return an array for jobs, received:", fetchedJobs);
        setJobs([]);
      }
      // --- CRITICAL FIX END ---

    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      const message = err.response?.data?.message || 'Failed to fetch jobs. Please try again.';
      setError(message);
      toast.error(message);
      setJobs([]); // Set to empty array on error to prevent further map errors
    } finally {
      setJobListLoading(false);
    }
  }, [filterStatus, sortBy, searchTerm, isAuthenticated, authLoading]);

  useEffect(() => {
    // Only trigger job fetching if auth context has finished loading and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchJobs();
    } else if (!authLoading && !isAuthenticated) {
      // If auth has loaded but user is not authenticated, stop job loading
      setJobListLoading(false);
    }
  }, [fetchJobs, authLoading, isAuthenticated]);

  const handleSaveJob = () => {
    setShowJobForm(false);
    setJobToEdit(null);
    fetchJobs(); // Refresh the job list
    toast.success(jobToEdit ? 'Job updated successfully!' : 'Job added successfully!');
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setError('');
      try {
        await jobService.deleteJob(id);
        fetchJobs(); // Refresh the job list
        toast.success('Job deleted successfully!');
      } catch (err) {
        console.error("Failed to delete job:", err);
        const message = err.response?.data?.message || 'Failed to delete job. Please try again.';
        setError(message);
        toast.error(message);
      }
    }
  };

  // Display loading state from both auth context and job list fetching
  if (authLoading || jobListLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-center text-gray-600 text-xl font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // If not authenticated and not loading, PrivateRoute should handle redirect, but as a fallback:
  if (!isAuthenticated && !authLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <p className="text-center text-gray-600 text-xl font-medium">Please log in to view your dashboard.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10"> {/* Slightly off-white background for depth */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 leading-tight">
          {user ? `${user.name}'s Job Dashboard` : 'Your Job Dashboard'}
        </h1>
      </header>

      {error && (
        <div
          className="max-w-6xl mx-auto bg-red-50 border border-red-300 text-red-700 px-5 py-4 rounded-lg relative mb-8 shadow-sm"
          role="alert"
        >
          <span className="block sm:inline font-medium">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            setJobToEdit(null);
            setShowJobForm(true);
          }}
          className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold shadow-md bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-offset-2"
        >
          Add New Job
        </button>
        <ExportButton /> {/* Assuming ExportButton has good default styling or will be styled internally */}
      </div>

      {showJobForm && (
        <div className="max-w-6xl mx-auto mb-10 px-4 sm:px-6 lg:px-8">
          <JobForm onSave={handleSaveJob} onCancel={() => setShowJobForm(false)} jobToEdit={jobToEdit} />
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Filter & Search Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="filterStatus"
              className="mt-1 block w-full pl-4 pr-10 py-2 text-base border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M6%209L0%203h12z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {jobStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              className="mt-1 block w-full pl-4 pr-10 py-2 text-base border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M6%209L0%203h12z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dateAddedDesc">Date Added (Newest)</option>
              <option value="dateAddedAsc">Date Added (Oldest)</option>
              <option value="titleAsc">Title (A-Z)</option>
              <option value="companyAsc">Company (A-Z)</option>
            </select>
          </div>

          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Search by Title/Company
            </label>
            <input
              type="text"
              id="searchTerm"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., React Developer, Google"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          <div className="bg-white shadow-xl rounded-2xl p-10 text-center border border-gray-100">
            <p className="text-gray-600 text-xl font-medium">No jobs found. Add one to get started!</p>
            <p className="mt-4 text-gray-500">
              Start tracking your applications by adding your first job.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Responsive grid for JobCards */}
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} onEdit={handleEditJob} onDelete={handleDeleteJob} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;