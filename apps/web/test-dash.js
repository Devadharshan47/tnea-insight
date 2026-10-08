fetch('http://localhost:3001/student/dashboard').then(res => res.text()).then(html => console.log(html.length)).catch(console.error);
