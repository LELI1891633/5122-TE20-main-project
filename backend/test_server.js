const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://0.0.0.0:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
});

