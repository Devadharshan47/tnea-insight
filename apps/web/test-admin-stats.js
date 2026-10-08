fetch('http://localhost:3001/api/admin/stats', {
  headers: {
    'Cookie': 'tnea_auth_token=' // I need a token for admin?
  }
}).then(res => res.json()).then(console.log).catch(console.error);
