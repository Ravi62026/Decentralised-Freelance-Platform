const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'open' }, // open, assigned, completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
