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
    const login = await loginRes.json();
    const token = login.token;

    const response = await fetch('http://localhost:5000/api/mahasiswa/submissions', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}
run();
