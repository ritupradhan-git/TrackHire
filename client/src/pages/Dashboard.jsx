import React, { useEffect, useState, useCallback, useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import * as jobService from "../services/jobService.js";
import JobCard from "../components/JobCard.jsx";
import JobForm from "../components/JobForm.jsx";
import ExportButton from "../components/ExportButton.jsx";
import { toast } from "react-toastify";

const jobStatuses = ["All", "Saved", "Applied", "Interview", "Rejected"];

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [jobListLoading, setJobListLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("dateAddedDesc");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated || authLoading) {
      setJobListLoading(false);
      return;
    }

    setJobListLoading(true);
    setError("");

    try {
      const filters = {};
      if (filterStatus !== "All") filters.status = filterStatus;
      if (searchTerm) filters.search = searchTerm;
      if (sortBy) filters.sortBy = sortBy;

      const fetchedJobs = await jobService.getAllJobs(filters);

      if (Array.isArray(fetchedJobs)) setJobs(fetchedJobs);
      else if (fetchedJobs?.data) setJobs(fetchedJobs.data);
      else setJobs([]);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch jobs.";
      setError(message);
      toast.error(message);
      setJobs([]);
    } finally {
      setJobListLoading(false);
    }
  }, [filterStatus, sortBy, searchTerm, isAuthenticated, authLoading]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) fetchJobs();
    else if (!authLoading && !isAuthenticated) setJobListLoading(false);
  }, [fetchJobs, authLoading, isAuthenticated]);

  const handleSaveJob = () => {
    setShowJobForm(false);
    setJobToEdit(null);
    fetchJobs();
    toast.success(jobToEdit ? "Job updated!" : "Job added!");
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Delete this job?")) {
      await jobService.deleteJob(id);
      fetchJobs();
      toast.success("Deleted!");
    }
  };

  if (authLoading || jobListLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="animate-pulse text-xl font-semibold text-gray-700">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Welcome back, <span className="text-indigo-600">{user?.name || "User"}</span>
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Track, manage and win your job applications 🚀
          </p>
        </header>

        {/* ACTION BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button
            onClick={() => { setJobToEdit(null); setShowJobForm(true); }}
            className="px-8 py-3 bg-black text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition"
          >
            + Add Job
          </button>
          <ExportButton />
        </div>

        {/* JOB FORM MODAL STYLE */}
        {showJobForm && (
          <div className="backdrop-blur-xl bg-white/80 border shadow-xl rounded-2xl p-8 mb-10">
            <JobForm
              onSave={handleSaveJob}
              onCancel={() => setShowJobForm(false)}
              jobToEdit={jobToEdit}
            />
          </div>
        )}

        {/* FILTER PANEL */}
        <div className="bg-white/80 backdrop-blur-xl border shadow-xl rounded-2xl p-8 mb-10">
          <h3 className="text-2xl font-bold mb-6">Filter & Search</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <select
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {jobStatuses.map((s) => <option key={s}>{s}</option>)}
            </select>

            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dateAddedDesc">Newest</option>
              <option value="dateAddedAsc">Oldest</option>
              <option value="titleAsc">Title A-Z</option>
            </select>

            <input
              className="input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* JOB GRID */}
        {jobs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border shadow-xl rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">No Jobs Yet</h2>
            <p className="text-gray-500 mt-3">Click “Add Job” to begin your journey.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;