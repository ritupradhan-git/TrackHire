import React, { useState, useEffect } from "react";
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
    } else {
      // Reset form if no jobToEdit is provided (for new job creation)
      setFormData({
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
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleScrapeChange = (e) => {
    setScrapeUrl(e.target.value);
  };

  // JobForm.jsx - inside handleScrape
  const handleScrape = async () => {
    setError("");
    setLoading(true);
    console.log("1. Scrape button clicked. Current scrapeUrl:", scrapeUrl);

    // Add a quick client-side URL validation here for robustness
    if (!scrapeUrl || !scrapeUrl.startsWith("http")) {
      setError("Please enter a valid URL (starting with http:// or https://)");
      setLoading(false);
      return; // Stop execution if URL is invalid
    }

    try {
      console.log("2. Attempting to call jobService.scrapeJob...");
      const scrapedJob = await jobService.scrapeJob(scrapeUrl);
      console.log("3. Frontend received scraped data:", scrapedJob); // This should now show if POST succeeded
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
      setScrapeUrl(""); // Clear scrape URL after successful scrape
      console.log("4. Form data updated successfully.");
    } catch (err) {
      console.error("5. Error during scraping process:", err); // Catch any errors from jobService.scrapeJob
      setError(
        err.response?.data?.message ||
          "Failed to scrape job. Please check the URL and try again.",
      );
    } finally {
      setLoading(false);
      console.log("6. Scraping process finished.");
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
      onSave(); // Callback to refresh jobs and close form
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {jobToEdit ? "Edit Job" : "Add New Job"}
      </h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Scrape Section */}
      <div className="mb-6 border-b pb-6 border-gray-200">
        <label
          htmlFor="scrapeUrl"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Scrape Job from URL
        </label>
        <div className="flex space-x-3">
          <input
            type="url"
            id="scrapeUrl"
            name="scrapeUrl"
            value={scrapeUrl}
            onChange={handleScrapeChange}
            placeholder="e.g., https://www.linkedin.com/jobs/..."
            className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleScrape}
            disabled={loading || !scrapeUrl}
            className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              loading || !scrapeUrl
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            }`}
          >
            {loading ? "Scraping..." : "Scrape"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Salary */}
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Experience */}
        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700"
          >
            Experience
          </label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {jobStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Source URL */}
        <div className="md:col-span-2">
          <label
            htmlFor="sourceUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Source URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="sourceUrl"
            name="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {jobToEdit ? "Update Job" : "Add Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
