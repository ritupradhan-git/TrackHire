import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookmark, 
  faPaperPlane, 
  faComments, 
  faCircleXmark, 
  faCircleCheck,
  faCircle
} from '@fortawesome/free-solid-svg-icons';

const StatusBadge = ({ status }) => {
  // Define styles and icons for each status
  const statusConfig = {
    Saved: {
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
      dot: 'text-slate-400',
      icon: faBookmark
    },
    Applied: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
      dot: 'text-blue-500',
      icon: faPaperPlane
    },
    Interview: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      dot: 'text-amber-500',
      icon: faComments
    },
    Offer: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      dot: 'text-emerald-500',
      icon: faCircleCheck
    },
    Rejected: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-100',
      dot: 'text-rose-500',
      icon: faCircleXmark
    }
  };

  // Fallback for unknown status
  const config = statusConfig[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    dot: 'text-gray-400',
    icon: faCircle
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2 
        px-3 py-1 rounded-full border
        text-[11px] font-bold uppercase tracking-wider
        ${config.bg} ${config.text} ${config.border}
        transition-all duration-200
      `}
    >
      <FontAwesomeIcon icon={config.icon} className="text-[10px]" />
      {status}
    </span>
  );
};

export default StatusBadge;