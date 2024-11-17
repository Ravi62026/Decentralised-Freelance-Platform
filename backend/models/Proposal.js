const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  status: { type: String, default: 'pending' }, // pending, accepted, rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Proposal', proposalSchema);
