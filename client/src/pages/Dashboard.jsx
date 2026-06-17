import React, { useEffect, useState, useCallback, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
} from "lucide-react";
import AuthContext from "../context/AuthContext.jsx";
import * as jobService from "../services/jobService.js";
import JobCard from "../components/JobCard.jsx";
import JobForm from "../components/JobForm.jsx";
import ExportButton from "../components/ExportButton.jsx";
import { toast } from "react-toastify";

const jobStatuses = ["All", "Saved", "Applied", "Interview", "Rejected"];
const MotionDiv = motion.div;

const Dashboard = () => {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [jobListLoading, setJobListLoading] = useState(true);
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
    try {
      const filters = {};
      if (filterStatus !== "All") filters.status = filterStatus;
      if (searchTerm) filters.search = searchTerm;
      if (sortBy) filters.sortBy = sortBy;

      const fetchedJobs = await jobService.getAllJobs(filters);
      setJobs(
        Array.isArray(fetchedJobs) ? fetchedJobs : fetchedJobs?.data || [],
      );
    } catch {
      toast.error("Failed to fetch jobs.");
    } finally {
      setJobListLoading(false);
    }
  }, [filterStatus, sortBy, searchTerm, isAuthenticated, authLoading]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) fetchJobs();
  }, [fetchJobs, authLoading, isAuthenticated]);

  useEffect(() => {
    if (showJobForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showJobForm]);
  // Derived Stats
  const stats = [
    {
      label: "Total Applications",
      value: jobs.length,
      icon: <LayoutGrid size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Interviews",
      value: jobs.filter((j) => j.status === "Interview").length,
      icon: <Clock size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Offers",
      value: jobs.filter((j) => j.status === "Offer").length,
      icon: <CheckCircle2 size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Rejected",
      value: jobs.filter((j) => j.status === "Rejected").length,
      icon: <XCircle size={20} />,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const handleSaveJob = () => {
    setShowJobForm(false);
    setJobToEdit(null);
    fetchJobs();
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      await jobService.deleteJob(id);
      fetchJobs();
      toast.success("Job removed.");
    }
  };

  if (authLoading || jobListLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-tight">
            Syncing your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] pb-20 pt-20">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-gray-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                Good morning, {user?.name?.split(" ")[0] || "Achiever"}
              </h1>
              <p className="text-gray-500 font-medium">
                You have {jobs.filter((j) => j.status === "Interview").length}{" "}
                upcoming interviews this week.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ExportButton />
              <button
                onClick={() => {
                  setJobToEdit(null);
                  setShowJobForm(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                <Plus size={18} /> Add Job
              </button>
            </div>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 p-5 rounded-[24px] shadow-sm flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search companies, roles, or keywords..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <select
                className="pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {jobStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s} Status
                  </option>
                ))}
              </select>
            </div>

            <select
              className="px-6 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dateAddedDesc">Newest First</option>
              <option value="dateAddedAsc">Oldest First</option>
              <option value="titleAsc">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* JOB MODAL */}
        <AnimatePresence>
          {showJobForm && (
            <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 pb-6 pt-24 sm:px-6 sm:pt-28">
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowJobForm(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <MotionDiv
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-2xl max-h-[calc(100vh-8rem)] rounded-[24px] shadow-xl shadow-slate-900/10 overflow-hidden border border-slate-200/80 flex flex-col"
              >
                <div className="modal-scrollbar flex-1 min-h-0 p-5 sm:p-7 overflow-y-auto overscroll-contain">
                  <JobForm
                    onSave={handleSaveJob}
                    onCancel={() => setShowJobForm(false)}
                    jobToEdit={jobToEdit}
                  />
                </div>
              </MotionDiv>
            </div>
          )}
        </AnimatePresence>

        {/* CONTENT AREA */}
        {jobs.length === 0 ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-gray-200 rounded-[32px] p-20 text-center"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
              <LayoutGrid size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No applications found
            </h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              Start your journey by adding your first job application to the
              tracker.
            </p>
            <button
              onClick={() => setShowJobForm(true)}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              + Add your first job
            </button>
          </MotionDiv>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
};

export default Dashboard;
