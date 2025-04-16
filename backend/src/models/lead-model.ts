import mongoose, { Schema } from 'mongoose';

const leadSchema = new Schema({
  name: String,
  jobTitle: String,
  company: String,
  location: String,
  profileUrl: String
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);