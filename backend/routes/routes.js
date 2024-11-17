const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const auth = require('../middlewares/auth');

const router = express.Router();

// User Registration
router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
// User Login
router.post('/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials.' });
  
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Set token in cookies (make it HttpOnly for security)
      res.cookie('token', token, {
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensures cookie is sent over HTTPS in production
        maxAge: 3600000, // 1 hour
      });
  
      res.json({ message: 'Login successful', user: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Create a new job
router.post('/jobs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Only clients can post jobs.' });

    const { title, description, budget } = req.body;
    const newJob = new Job({ title, description, budget, client: req.user.id });
    await newJob.save();

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().populate('client', 'username');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a proposal
router.post('/proposals', auth, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') return res.status(403).json({ message: 'Only freelancers can submit proposals.' });

    const { jobId, amount, message } = req.body;
    const newProposal = new Proposal({ jobId, freelancer: req.user.id, amount, message });
    await newProposal.save();

    res.status(201).json(newProposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch proposals for a job
router.get('/jobs/:jobId/proposals', auth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const proposals = await Proposal.find({ jobId }).populate('freelancer', 'username');
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept a proposal

router.post('/proposals/:proposalId/accept', auth, async (req, res) => {
  try {
    const { proposalId } = req.params;
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found.' });

    const job = await Job.findById(proposal.jobId);
    
    // // Use equals method for ObjectId comparison
    // if (!job.client.equals(req.user.id)) {
    //   return res.status(403).json({ message: 'Unauthorized.' });
    // }

    proposal.status = 'accepted';
    await proposal.save();
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
