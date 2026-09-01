const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const AuthController = {
  login: async (req, res) => {
    try {
      const { nim_nip, password } = req.body;
      const { Op } = require('sequelize');
      const user = await User.findOne({ 
        where: { 
          [Op.or]: [
            { nim_nip },
            { email: nim_nip }
          ]
        } 
      });
      if (!user) {
        return res.status(401).json({ error: 'NPM/NIP atau Email tidak ditemukan.' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Password salah.' });
      }

      const token = jwt.sign(
        { id: user.id, nim_nip: user.nim_nip, role: user.role, nama_lengkap: user.nama_lengkap },
        process.env.JWT_SECRET || 'rahasia_kampus_123',
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          nim_nip: user.nim_nip,
          nama_lengkap: user.nama_lengkap,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = AuthController;
