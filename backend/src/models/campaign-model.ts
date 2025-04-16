import mongoose, { Schema } from 'mongoose';

const campaignSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'INACTIVE', 'DELETED'], 
    default: 'ACTIVE' 
  },
  leads: [{ type: String }],
  accountIDs: [{ type: String }],
}, 
{ timestamps: true });

export default mongoose.model('Campaign', campaignSchema);