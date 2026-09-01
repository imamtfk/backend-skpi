const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      nim_nip: '1234567890',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('Logged in as', loginRes.data.user.nama_lengkap);

    const formData = new FormData();
    formData.append('category_id', 'B.1');
    formData.append('judul_kegiatan', 'Test Kegiatan');
    formData.append('penyelenggara', 'Test Penyelenggara');
    formData.append('tanggal_kegiatan', '2025-03-18');
    formData.append('nomor_sertifikat', 'CERT-123');
    
    // Create a dummy file
    fs.writeFileSync('dummy_upload.pdf', 'dummy content');
    formData.append('dokumen_bukti', fs.createReadStream('dummy_upload.pdf'));

    const res = await axios.post('http://localhost:5000/api/submissions', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
run();
