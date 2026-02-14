import React, { useEffect, useState, useCallback, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import * as jobService from '../services/jobService.js';
import JobCard from '../components/JobCard.jsx';
import JobForm from '../components/JobForm.jsx';
import ExportButton from '../components/ExportButton.jsx';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const jobStatuses = ['All', 'Saved', 'Applied', 'Interview', 'Rejected'];

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext); // Destructure isAuthenticated and authLoading
  const [jobs, setJobs] = useState([]);
  const [jobListLoading, setJobListLoading] = useState(true); // Renamed to avoid conflict with authLoading
  const [error, setError] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  // Filters and Sorting
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('dateAddedDesc'); // 'dateAddedAsc', 'dateAddedDesc', 'titleAsc', 'companyAsc'
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
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-gray-700 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  // If not authenticated and not loading, PrivateRoute should handle redirect, but as a fallback:
  if (!isAuthenticated && !authLoading) {
    // This case should ideally be handled by PrivateRoute, but ensures no UI is rendered without auth
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-center text-gray-700 text-lg">Please log in to view your dashboard.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        {user ? `${user.name}'s Job Dashboard` : 'Your Job Dashboard'}
      </h1>

      {error && (
        <div
          className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6 px-4 sm:px-0">
        <button
          onClick={() => {
            setJobToEdit(null);
            setShowJobForm(true);
          }}
          className="px-6 py-3 rounded-lg text-white font-semibold shadow-md transition duration-300 ease-in-out bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Job
        </button>
        <ExportButton />
      </div>

      {showJobForm && (
        <div className="max-w-4xl mx-auto mb-8 px-4 sm:px-0">
          <JobForm onSave={handleSaveJob} onCancel={() => setShowJobForm(false)} jobToEdit={jobToEdit} />
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200 px-4 sm:px-0">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter & Search Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              id="filterStatus"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              id="sortBy"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
              Search by Title/Company
            </label>
            <input
              type="text"
              id="searchTerm"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., React Developer, Google"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No jobs found. Add one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
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