const fs = require('fs');

async function run() {
  try {
    // 1. Get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nim_nip: '1234567890',
        password: 'password123'
      })
    });
    const login = await loginRes.json();
    const token = login.token;
    console.log('Token acquired');

    // 2. Submit form
    // In node fetch we can use the native FormData
    const form = new FormData();
    form.append('category_id', 'B.1');
    form.append('judul_kegiatan', 'Test Kegiatan');
    form.append('penyelenggara', 'Test Penyelenggara');
    form.append('tanggal_kegiatan', '2024-01-01');
    form.append('nomor_sertifikat', '123/TEST/2024');
    
    // Create dummy file
    fs.writeFileSync('dummy.jpg', 'dummy content');
    const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
    form.append('dokumen_bukti', blob, 'dummy.jpg');

    console.log('Sending request...');
    const response = await fetch('http://localhost:5000/api/submissions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });
    
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}
run();
