import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';

  switch (status) {
    case 'Saved':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'Applied':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'Interview':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    case 'Rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;