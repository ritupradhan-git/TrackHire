import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  salary: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  experience: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  sourceUrl: {
    type: String,
    required: [true, 'Source URL is required'],
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
      'Please use a valid URL'
    ],
  },
  status: {
    type: String,
    enum: ["Saved", "Applied", "Interview", "Rejected"],
    default: "Saved",
  },
  notes: {
    type: String,
    default: "",
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Job', JobSchema);