import React from 'react';
import StatusBadge from './StatusBadge.jsx';

const JobCard = ({ job, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out rounded-xl p-6 border border-gray-200 flex flex-col h-full group">
      
      {/* Header Section: Title, Company, Location, Status */}
      <div className="flex justify-between items-start mb-5 gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors duration-200">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-base text-gray-700 font-semibold">{job.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-500">{job.location || 'Remote'}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={job.status} />
        </div>
      </div>

      {/* Details Section: Salary, Experience, Date Added */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-5 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Salary:
          </span>
          <span className="text-gray-900 font-semibold">{job.salary || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Experience:
          </span>
          <span className="text-gray-900 font-semibold">{job.experience || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Added On:
          </span>
          <span className="text-gray-900 font-semibold">{new Date(job.dateAdded).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-5 flex-grow">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {job.description || 'No description provided.'}
        </p>
      </div>

      {/* Source URL & Notes */}
      {(job.sourceUrl || job.notes) && (
        <div className="mb-5 space-y-3">
          {job.sourceUrl && (
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-all duration-200 hover:gap-3 group/link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="border-b border-transparent group-hover/link:border-indigo-600">
                View Job Posting
              </span>
            </a>
          )}
          {job.notes && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r">
              <p className="text-sm text-gray-700">
                <strong className="font-semibold text-amber-900">Notes:</strong> {job.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(job)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(job._id)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;