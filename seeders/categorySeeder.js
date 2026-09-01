const SkpiCategory = require('../models/SkpiCategory');

const seedCategories = async () => {
  const categories = [
    // Parents
    { id: 'B.2.1', parent_id: null, nama_kategori: 'Sertifikat Kemahasiswaan', tipe_poin: 'statis', poin_default: 0, max_poin_kategori: 35, is_wajib: true, keterangan: 'Induk B.2.1' },
    { id: 'B.2.2a', parent_id: null, nama_kategori: 'Prestasi & Penghargaan', tipe_poin: 'dinamis', poin_default: 0, max_poin_kategori: null, is_wajib: false, keterangan: 'Induk B.2.2a' },
    { id: 'B.2.2b', parent_id: null, nama_kategori: 'Program Kreativitas Mahasiswa', tipe_poin: 'dinamis', poin_default: 0, max_poin_kategori: null, is_wajib: false, keterangan: 'Induk B.2.2b' },
    
    // Children
    { id: 'B.1', parent_id: null, nama_kategori: 'Sertifikasi Kompetensi (Ekonomi/Kesehatan/Teknik)', tipe_poin: 'statis', poin_default: 35, max_poin_kategori: 35, is_wajib: true },
    { id: 'B.2.1.1', parent_id: 'B.2.1', nama_kategori: 'Sertifikat Orasi', tipe_poin: 'statis', poin_default: 15, max_poin_kategori: 15, is_wajib: true },
    { id: 'B.2.1.2', parent_id: 'B.2.1', nama_kategori: 'Sertifikat Organisasi (UKM/Ikatan Mahasiswa)', tipe_poin: 'statis', poin_default: 20, max_poin_kategori: 20, is_wajib: true },
    { id: 'B.2.2a.1', parent_id: 'B.2.2a', nama_kategori: 'Presenter/Moderator/Pemateri Seminar Nasional', tipe_poin: 'dinamis', poin_default: 3, max_poin_kategori: null, is_wajib: false },
    { id: 'B.2.2a.2', parent_id: 'B.2.2a', nama_kategori: 'Juara 1, 2, 3', tipe_poin: 'dinamis', poin_default: 3, max_poin_kategori: null, is_wajib: false },
    { id: 'B.2.2a.3', parent_id: 'B.2.2a', nama_kategori: 'Temuan Teliti & Diakui Nasional', tipe_poin: 'dinamis', poin_default: 10, max_poin_kategori: null, is_wajib: false },
    { id: 'B.2.2b.1', parent_id: 'B.2.2b', nama_kategori: 'Melaksanakan Seminar (Internal/Nasional/Internasional)', tipe_poin: 'dinamis', poin_default: 3, max_poin_kategori: 7, is_wajib: false },
    { id: 'B.2.2b.2', parent_id: 'B.2.2b', nama_kategori: 'Melaksanakan Pengabdian Ke Masyarakat', tipe_poin: 'dinamis', poin_default: 2, max_poin_kategori: null, is_wajib: false },
    { id: 'B.2.2b.3', parent_id: 'B.2.2b', nama_kategori: 'Melaksanakan Kejuaraan (Internal/Daerah/Nasional)', tipe_poin: 'dinamis', poin_default: 2, max_poin_kategori: 4, is_wajib: false },
    { id: 'B.2.2b.4', parent_id: 'B.2.2b', nama_kategori: 'Melaksanakan Kegiatan Universitas (Harla/Panitia Wisuda)', tipe_poin: 'dinamis', poin_default: 2, max_poin_kategori: null, is_wajib: false },
    { id: 'B.2.2b.5', parent_id: 'B.2.2b', nama_kategori: 'Sertifikat SJS (Minimal 20 Kehadiran)', tipe_poin: 'dinamis', poin_default: 2, max_poin_kategori: null, is_wajib: false }
  ];

  for (const cat of categories) {
    await SkpiCategory.findOrCreate({
      where: { id: cat.id },
      defaults: cat
    });
  }
  
  console.log('Categories seeded successfully!');
};

module.exports = seedCategories;
