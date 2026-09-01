const express = require('express');
const router = express.Router();
const AbsensiController = require('../controllers/AbsensiController');
const auth = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/absensi', auth, upload.single('foto'), AbsensiController.submitAbsensi);
router.get('/absensi/mahasiswa', auth, AbsensiController.getMyAbsensi);
router.get('/admin/users/:user_id/absensi', auth, AbsensiController.getAbsensiByUserId);

module.exports = router;
