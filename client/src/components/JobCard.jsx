import React from 'react';
import StatusBadge from './StatusBadge.jsx';

const JobCard = ({ job, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-lg text-gray-700">{job.company}</p>
          <p className="text-sm text-gray-500">{job.location}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="mb-4 text-gray-600 text-sm">
        <p>
          <strong>Salary:</strong> {job.salary || 'N/A'}
        </p>
        <p>
          <strong>Experience:</strong> {job.experience || 'N/A'}
        </p>
        <p>
          <strong>Added On:</strong> {new Date(job.dateAdded).toLocaleDateString()}
        </p>
      </div>

      <p className="text-gray-700 mb-4">{job.description}</p>

      {job.sourceUrl && (
        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium mr-4"
        >
          View Job
        </a>
      )}
      {job.notes && (
        <p className="text-sm text-gray-600 mt-2">
          <strong>Notes:</strong> {job.notes}
        </p>
      )}

      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => onEdit(job)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(job._id)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;