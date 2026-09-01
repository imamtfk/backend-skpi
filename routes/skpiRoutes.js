const express = require('express');
const router = express.Router();
const SkpiController = require('../controllers/SkpiController');
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public route
router.post('/auth/login', AuthController.login);

// Protected routes (Require JWT)
router.get('/categories', auth, SkpiController.getCategories);
router.get('/mahasiswa/summary', auth, SkpiController.getSummary);
router.get('/mahasiswa/submissions', auth, SkpiController.getMySubmissions);
router.post('/submissions', auth, upload.single('dokumen_bukti'), SkpiController.createSubmission);

// Profile
router.get('/profile', auth, SkpiController.getProfile);
router.put('/profile', auth, SkpiController.updateProfile);

// Admin / Verifikator approval route
router.put('/admin/submissions/:id/verify', auth, async (req, res) => {
  const { status, catatan, poin_disetujui } = req.body;
  try {
    const SkpiSubmission = require('../models/SkpiSubmission');
    const submission = await SkpiSubmission.findByPk(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Not found' });

    // Status progression: validasi_tu -> validasi_prodi -> approval_dekan -> selesai
    submission.status = status;
    
    if (catatan) {
      submission.catatan_verifikator = submission.catatan_verifikator 
        ? `${submission.catatan_verifikator}\n[${req.user.role}]: ${catatan}`
        : `[${req.user.role}]: ${catatan}`;
    }
    
    if (poin_disetujui !== undefined) {
      submission.poin_disetujui = poin_disetujui;
    }
    
    submission.verified_by = req.user.id;
    submission.verified_at = new Date();

    await submission.save();
    res.json({ message: 'Status updated', data: submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for mahasiswa to submit draft
router.put('/mahasiswa/submissions/:id/ajukan', auth, async (req, res) => {
  try {
    const SkpiSubmission = require('../models/SkpiSubmission');
    const submission = await SkpiSubmission.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!submission) return res.status(404).json({ error: 'Not found' });
    
    if (submission.status !== 'draft') return res.status(400).json({ error: 'Hanya dokumen draft yang dapat diajukan' });
    
    submission.status = 'validasi_tu';
    await submission.save();
    res.json({ message: 'Dokumen diajukan ke TU', data: submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/submissions', auth, SkpiController.getAllSubmissions);
router.delete('/admin/submissions/:id', auth, SkpiController.deleteSubmission);
router.get('/admin/users', auth, SkpiController.getAllUsers);
router.post('/admin/users', auth, SkpiController.createUser);

router.post('/categories', auth, SkpiController.createCategory);
router.put('/categories/:id', auth, SkpiController.updateCategory);
router.delete('/categories/:id', auth, SkpiController.deleteCategory);

module.exports = router;
