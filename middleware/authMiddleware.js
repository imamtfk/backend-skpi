const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Akses ditolak. Token tidak tersedia.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Format token salah.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_kampus_123');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token tidak valid atau sudah kadaluarsa.' });
  }
};

module.exports = authMiddleware;
