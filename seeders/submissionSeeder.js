const SkpiSubmission = require('../models/SkpiSubmission');

const seedSubmissions = async () => {
  const submissions = [
    {
      user_id: 1, // Mahasiswa Dummy
      category_id: 'B.1', // Wajib: 35 Poin
      judul_kegiatan: 'Sertifikasi Kompetensi Analis Data Junior',
      penyelenggara: 'BNSP',
      tanggal_kegiatan: '2025-05-10',
      nomor_sertifikat: 'BNSP-2025-001',
      file_path: '/uploads/cert1.pdf',
      poin_diusulkan: 35,
      poin_disetujui: 35,
      status: 'selesai',
      verified_by: 2,
      verified_at: new Date()
    },
    {
      user_id: 1,
      category_id: 'B.2.1.2', // Wajib: Organisasi 20 Poin
      judul_kegiatan: 'Pengurus HMTI 2024/2025',
      penyelenggara: 'Kampus',
      tanggal_kegiatan: '2025-01-10',
      nomor_sertifikat: 'SK-HMTI-2025',
      file_path: '/uploads/cert2.pdf',
      poin_diusulkan: 20,
      poin_disetujui: 20,
      status: 'selesai',
      verified_by: 2,
      verified_at: new Date()
    },
    {
      user_id: 1,
      category_id: 'B.2.2a.3', // Dinamis: Temuan Teliti 10 Poin
      judul_kegiatan: 'Penelitian Algoritma Prediksi Gempa',
      penyelenggara: 'Kemenristekdikti',
      tanggal_kegiatan: '2025-08-15',
      nomor_sertifikat: 'KEMEN-2025',
      file_path: '/uploads/cert3.pdf',
      poin_diusulkan: 10,
      poin_disetujui: 10,
      status: 'selesai',
      verified_by: 2,
      verified_at: new Date()
    },
    {
      user_id: 1,
      category_id: 'B.2.2b.1', // Dinamis: Seminar 3 poin (Max 7)
      judul_kegiatan: 'Seminar Nasional AI 2026',
      penyelenggara: 'Universitas ABC',
      tanggal_kegiatan: '2026-02-20',
      nomor_sertifikat: 'SEM-2026',
      file_path: '/uploads/cert4.pdf',
      poin_diusulkan: 3,
      status: 'validasi_tu' // pending
    }
  ];

  for (const sub of submissions) {
    await SkpiSubmission.create(sub);
  }
  console.log('Submissions seeded successfully!');
};

module.exports = seedSubmissions;
