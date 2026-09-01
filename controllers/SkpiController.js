const SkpiSubmission = require('../models/SkpiSubmission');
const SkpiCategory = require('../models/SkpiCategory');
const User = require('../models/User');

const SkpiController = {
  // GET /api/categories
  getCategories: async (req, res) => {
    try {
      const categories = await SkpiCategory.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/mahasiswa/summary (mocking user_id = 1 for now)
  getSummary: async (req, res) => {
    try {
      const user_id = req.user ? req.user.id : 1; 

      const submissions = await SkpiSubmission.findAll({
        where: { user_id, status: 'selesai' },
        include: [{ model: SkpiCategory, as: 'kategori' }]
      });

      let totalStatis = 0;
      let totalDinamis = 0;

      // Group dynamics by max_poin_kategori logic
      const dynamicPointsGrouped = {};

      submissions.forEach(sub => {
        const cat = sub.kategori;
        if (cat.tipe_poin === 'statis') {
          totalStatis += sub.poin_disetujui;
        } else if (cat.tipe_poin === 'dinamis') {
          const groupId = cat.id; 
          if (!dynamicPointsGrouped[groupId]) {
            dynamicPointsGrouped[groupId] = {
              current: 0,
              max: cat.max_poin_kategori || Infinity
            };
          }
          dynamicPointsGrouped[groupId].current += sub.poin_disetujui;
        }
      });

      // Calculate Dinamis with max caps
      for (const key in dynamicPointsGrouped) {
        const group = dynamicPointsGrouped[key];
        totalDinamis += Math.min(group.current, group.max);
      }

      const isLulusStatis = totalStatis >= 70;

      res.json({
        totalStatis,
        totalDinamis,
        isLulusStatis,
        statusKelulusan: isLulusStatis ? 'LULUS SYARAT WAJIB' : 'BELUM MEMENUHI',
        submissions // Riwayat
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/submissions
  createSubmission: async (req, res) => {
    try {
      const { category_id, judul_kegiatan, penyelenggara, tanggal_kegiatan, nomor_sertifikat } = req.body;
      const user_id = req.user ? req.user.id : 1; 
      
      const category = await SkpiCategory.findByPk(category_id);
      if (!category) return res.status(404).json({ error: 'Category not found' });

      let file_path = '';
      if (req.file) {
        const base64File = req.file.buffer.toString('base64');
        file_path = `data:${req.file.mimetype};base64,${base64File}`;
      } else {
        // Fallback to empty if not provided, but usually required
        file_path = '';
      }
      const submission = await SkpiSubmission.create({
        user_id,
        category_id,
        judul_kegiatan,
        penyelenggara,
        tanggal_kegiatan,
        nomor_sertifikat,
        file_path,
        poin_diusulkan: category.poin_default,
        status: 'validasi_tu'
      });

      res.status(201).json({ message: 'Berhasil diunggah', data: submission });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ADMIN ENDPOINTS

  // GET /api/admin/submissions
  getAllSubmissions: async (req, res) => {
    try {
      const submissions = await SkpiSubmission.findAll({
        include: [
          { model: SkpiCategory, as: 'kategori' },
          { model: User, as: 'mahasiswa' }
        ],
        order: [['created_at', 'DESC']]
      });
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE /api/admin/submissions/:id
  deleteSubmission: async (req, res) => {
    try {
      const deleted = await SkpiSubmission.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Submission deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/categories
  createCategory: async (req, res) => {
    try {
      const category = await SkpiCategory.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT /api/categories/:id
  updateCategory: async (req, res) => {
    try {
      const [updated] = await SkpiCategory.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Category updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE /api/categories/:id
  deleteCategory: async (req, res) => {
    try {
      const deleted = await SkpiCategory.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Category deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/mahasiswa/submissions - semua pengajuan milik user login
  getMySubmissions: async (req, res) => {
    try {
      const user_id = req.user ? req.user.id : 1;
      const submissions = await SkpiSubmission.findAll({
        where: { user_id },
        include: [{ model: SkpiCategory, as: 'kategori' }],
        order: [['created_at', 'DESC']]
      });
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT /api/profile
  updateProfile: async (req, res) => {
    try {
      const { nama_lengkap, email, prodi } = req.body;
      await User.update({ nama_lengkap, email, prodi }, { where: { id: req.user.id } });
      const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/admin/users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/admin/users
  createUser: async (req, res) => {
    try {
      const { nim_nip, nama_lengkap, email, role, prodi, password } = req.body;
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await User.create({
        nim_nip,
        nama_lengkap,
        email,
        role,
        prodi,
        password: hashedPassword
      });
      
      const userRes = newUser.toJSON();
      delete userRes.password;
      res.status(201).json(userRes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = SkpiController;
