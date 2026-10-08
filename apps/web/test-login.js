fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'student@example.com', password: 'student123' })
}).then(res => res.json()).then(console.log).catch(console.error);
