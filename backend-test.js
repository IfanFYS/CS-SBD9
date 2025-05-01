const https = require('https');

// Updated with the correct Render backend URL
const backendUrl = 'https://cs-sbd9-backend.onrender.com/';

console.log(`Testing connection to backend at: ${backendUrl}`);

https.get(backendUrl, (res) => {
  let data = '';
  
  console.log(`Status code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:');
    console.log(data);
  });
}).on('error', (err) => {
  console.error('Error connecting to backend:');
  console.error(err.message);
});