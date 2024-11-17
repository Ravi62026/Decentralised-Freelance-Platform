const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user info to req.user
    next(); // Pass the request to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = auth;
