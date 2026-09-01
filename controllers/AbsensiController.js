const Absensi = require('../models/Absensi');
const User = require('../models/User');

const AbsensiController = {
  // POST /api/absensi
  submitAbsensi: async (req, res) => {
    try {
      const { namaKegiatan, lat, lng } = req.body;
      const user_id = req.user.id;
      
      let foto_path = '';
      if (req.file) {
        const base64Image = req.file.buffer.toString('base64');
        foto_path = `data:${req.file.mimetype};base64,${base64Image}`;
      } else {
        return res.status(400).json({ error: 'Foto wajib diunggah' });
      }

      const absensi = await Absensi.create({
        user_id,
        nama_kegiatan: namaKegiatan,
        foto_path,
        lat,
        lng,
        status: 'hadir'
      });

      res.status(201).json({ message: 'Absensi berhasil disimpan', data: absensi });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/absensi/mahasiswa
  getMyAbsensi: async (req, res) => {
    try {
      const absensiList = await Absensi.findAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'DESC']]
      });
      res.json(absensiList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/admin/users/:user_id/absensi
  getAbsensiByUserId: async (req, res) => {
    try {
      const absensiList = await Absensi.findAll({
        where: { user_id: req.params.user_id },
        order: [['created_at', 'DESC']]
      });
      res.json(absensiList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = AbsensiController;
