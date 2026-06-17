import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWandMagicSparkles, 
  faCircleNotch, 
  faPlus, 
  faXmark, 
  faBriefcase, 
  faBuilding, 
  faLocationDot, 
  faDollarSign, 
  faLink, 
  faPenNib,
  faStickyNote
} from '@fortawesome/free-solid-svg-icons';
import * as jobService from "../services/jobService.js";

const jobStatuses = ["Saved", "Applied", "Interview", "Rejected"];

const JobForm = ({ onSave, onCancel, jobToEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    description: "",
    sourceUrl: "",
    status: "Saved",
    notes: "",
  });
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || "",
        company: jobToEdit.company || "",
        location: jobToEdit.location || "",
        salary: jobToEdit.salary || "",
        experience: jobToEdit.experience || "",
        description: jobToEdit.description || "",
        sourceUrl: jobToEdit.sourceUrl || "",
        status: jobToEdit.status || "Saved",
        notes: jobToEdit.notes || "",
      });
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleScrape = async () => {
    setError("");
    setLoading(true);
    if (!scrapeUrl || !scrapeUrl.startsWith("http")) {
      setError("Please enter a valid URL (starting with http:// or https://)");
      setLoading(false);
      return;
    }

    try {
      const scrapedJob = await jobService.scrapeJob(scrapeUrl);
      const jobData = scrapedJob.data;
      setFormData((prevData) => ({
        ...prevData,
        title: jobData.title || prevData.title,
        company: jobData.company || prevData.company,
        location: jobData.location || prevData.location,
        description: jobData.description || prevData.description,
        sourceUrl: jobData.sourceUrl || prevData.sourceUrl,
        salary: jobData.salary || prevData.salary,
        experience: jobData.experience || prevData.experience,
      }));
      setScrapeUrl("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to scrape job. Please enter details manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (jobToEdit) {
        await jobService.updateJob(jobToEdit._id, formData);
      } else {
        await jobService.createJob(formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job");
    }
  };

  const inputClasses = "w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all text-sm font-medium placeholder:text-slate-400";
  const labelClasses = "block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-2";

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-[1.65rem] leading-tight font-extrabold text-slate-900">
            {jobToEdit ? "Edit Application" : "New Application"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Fill in the details manually or auto-fill via URL.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close job form"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          {error}
        </div>
      )}

      {/* MAGIC SCRAPE SECTION */}
      {!jobToEdit && (
        <div className="mb-7 p-5 bg-purple-50/40 border border-purple-100 rounded-2xl">
          <label htmlFor="scrapeUrl" className={`${labelClasses} text-purple-600`}>
            <FontAwesomeIcon icon={faWandMagicSparkles} /> Magic Auto-fill
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              id="scrapeUrl"
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              placeholder="Paste LinkedIn, Indeed, or Glassdoor URL..."
              className={`${inputClasses} border-purple-200 focus:ring-purple-50 focus:border-purple-400`}
            />
            <button
              type="button"
              onClick={handleScrape}
              disabled={loading || !scrapeUrl}
              className={`px-6 py-2.5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md sm:whitespace-nowrap ${
                loading || !scrapeUrl
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100 active:scale-95"
              }`}
            >
              {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : <FontAwesomeIcon icon={faWandMagicSparkles} />}
              {loading ? "Scraping..." : "Auto-fill"}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Job Title */}
          <div>
            <label className={labelClasses}><FontAwesomeIcon icon={faBriefcase} /> Job Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} required className={inputClasses} placeholder="e.g. Senior Frontend Engineer" />
          </div>

          {/* Company */}
          <div>
            <label className={labelClasses}><FontAwesomeIcon icon={faBuilding} /> Company *</label>
            <input name="company" value={formData.company} onChange={handleChange} required className={inputClasses} placeholder="e.g. Stripe" />
          </div>

          {/* Location */}
          <div>
            <label className={labelClasses}><FontAwesomeIcon icon={faLocationDot} /> Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className={inputClasses} placeholder="e.g. San Francisco or Remote" />
          </div>

          {/* Status */}
          <div>
            <label className={labelClasses}>Current Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
              {jobStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className={labelClasses}><FontAwesomeIcon icon={faDollarSign} /> Salary Range</label>
            <input name="salary" value={formData.salary} onChange={handleChange} className={inputClasses} placeholder="e.g. $120k - $150k" />
          </div>

          {/* Experience */}
          <div>
            <label className={labelClasses}><FontAwesomeIcon icon={faBriefcase} /> Experience Level</label>
            <input name="experience" value={formData.experience} onChange={handleChange} className={inputClasses} placeholder="e.g. 3-5 years" />
          </div>
        </div>

        {/* Source URL */}
        <div>
          <label className={labelClasses}><FontAwesomeIcon icon={faLink} /> Listing URL *</label>
          <input name="sourceUrl" type="url" value={formData.sourceUrl} onChange={handleChange} required className={inputClasses} placeholder="https://..." />
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}><FontAwesomeIcon icon={faPenNib} /> Description *</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required className={`${inputClasses} resize-none`} placeholder="Key requirements and details..." />
        </div>

        {/* Notes */}
        <div>
          <label className={labelClasses}><FontAwesomeIcon icon={faStickyNote} /> Personal Notes</label>
          <textarea name="notes" rows="2" value={formData.notes} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="Referral info, follow-up dates, etc." />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={jobToEdit ? faPenNib : faPlus} />
            {jobToEdit ? "Update Application" : "Save Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
