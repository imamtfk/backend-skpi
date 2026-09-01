const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      nim_nip: '1234567890',
      nama_lengkap: 'Mahasiswa Dummy',
      email: 'mahasiswa@kampus.ac.id',
      password: passwordHash,
      role: 'mahasiswa',
      prodi: 'Teknik Informatika',
      angkatan: '2023'
    },
    {
      nim_nip: '11111',
      nama_lengkap: 'TU Fakultas Teknik',
      email: 'tu@kampus.ac.id',
      password: passwordHash,
      role: 'tu_fakultas',
      prodi: 'Teknik Informatika'
    },
    {
      nim_nip: '22222',
      nama_lengkap: 'Kaprodi Teknik Informatika',
      email: 'prodi@kampus.ac.id',
      password: passwordHash,
      role: 'prodi',
      prodi: 'Teknik Informatika'
    },
    {
      nim_nip: '33333',
      nama_lengkap: 'Dekan Fakultas Teknik',
      email: 'dekan@kampus.ac.id',
      password: passwordHash,
      role: 'dekan',
      prodi: 'Teknik Informatika'
    },
    {
      nim_nip: '00000',
      nama_lengkap: 'Super Admin SKPI',
      email: 'admin@kampus.ac.id',
      password: passwordHash,
      role: 'admin',
      prodi: 'Semua Prodi'
    }
  ];

  for (const user of users) {
    await User.findOrCreate({
      where: { nim_nip: user.nim_nip },
      defaults: user
    });
  }
  console.log('Users seeded successfully!');
};

module.exports = seedUsers;
