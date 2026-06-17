import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faLocationDot, 
  faMoneyBillWave, 
  faBriefcase, 
  faCalendarDay, 
  faArrowUpRightFromSquare, 
  faPenToSquare, 
  faTrashCan,
  faNoteSticky
} from '@fortawesome/free-solid-svg-icons';
import StatusBadge from './StatusBadge.jsx';

const JobCard = ({ job, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-7 shadow-[0px_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0px_15px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      
      {/* HEADER: Company Logo & Status */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-center text-blue-600 text-xl font-bold">
            {job.company ? job.company.charAt(0) : <FontAwesomeIcon icon={faBuilding} className="text-gray-300" />}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
              {job.title}
            </h3>
            <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
              {job.company}
            </p>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* QUICK STATS GRID */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600 bg-slate-50/50 border border-slate-100/50 rounded-xl px-3 py-2">
          <FontAwesomeIcon icon={faLocationDot} className="text-blue-500/70 w-4" />
          <span className="truncate">{job.location || 'Remote'}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600 bg-slate-50/50 border border-slate-100/50 rounded-xl px-3 py-2">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-emerald-500/70 w-4" />
          <span>{job.salary || 'Competitive'}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600 bg-slate-50/50 border border-slate-100/50 rounded-xl px-3 py-2">
          <FontAwesomeIcon icon={faBriefcase} className="text-purple-500/70 w-4" />
          <span>{job.experience || 'Entry Level'}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600 bg-slate-50/50 border border-slate-100/50 rounded-xl px-3 py-2">
          <FontAwesomeIcon icon={faCalendarDay} className="text-orange-500/70 w-4" />
          <span>{new Date(job.dateAdded).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-6 flex-grow">
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 italic">
          "{job.description || 'No description provided.'}"
        </p>
      </div>

      {/* EXTERNAL LINK & NOTES */}
      <div className="flex items-center justify-between mb-8">
        {job.sourceUrl ? (
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 group/link"
          >
            <span>VIEW LISTING</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        ) : <div />}

        {job.notes && (
          <div className="relative group/note">
            <FontAwesomeIcon icon={faNoteSticky} className="text-amber-400 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
              {job.notes}
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
        <button
          onClick={() => onEdit(job)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          EDIT
        </button>
        <button
          onClick={() => onDelete(job._id)}
          className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
};

export default JobCard;