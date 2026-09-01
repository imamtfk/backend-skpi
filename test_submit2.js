const fs = require('fs');

async function run() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nim_nip: '1234567890',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Logged in as', loginData.user.nama_lengkap);

    const formData = new FormData();
    formData.append('category_id', 'B.1');
    formData.append('judul_kegiatan', 'Test Kegiatan');
    formData.append('penyelenggara', 'Test Penyelenggara');
    formData.append('tanggal_kegiatan', '2025-03-18');
    formData.append('nomor_sertifikat', 'CERT-123');
    
    // Create a dummy file
    fs.writeFileSync('dummy_upload.pdf', 'dummy content');
    const blob = new Blob(['dummy content'], { type: 'application/pdf' });
    formData.append('dokumen_bukti', blob, 'dummy_upload.pdf');

    const res = await fetch('http://localhost:5000/api/submissions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    const result = await res.json();
    console.log('Success:', res.status, result);
  } catch (err) {
    console.error('Error:', err);
  }
}
run();
