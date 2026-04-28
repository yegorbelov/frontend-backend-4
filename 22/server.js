const express = require('express');
const os = require('os');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Response from backend server',
    port: PORT,
    backend: process.env.BACKEND_LABEL || os.hostname(),
    hostname: os.hostname(),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});
