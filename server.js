const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ensure 'details' folder exists
const detailsDir = path.join(__dirname, 'details');
fs.mkdirSync(detailsDir, { recursive: true });

// Save user details
app.post('/api/save', (req, res) => {
  const { username, empid, age, section, gender } = req.body;

  if (!username || !empid || !age || !section || !gender) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const data = { username, empid, age, section, gender };
  const filePath = path.join(detailsDir, `${empid}.json`);

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) return res.status(500).json({ error: 'Error saving details.' });
    res.json({ message: 'Details saved successfully.' });
  });
});

// Fetch user details by empid
app.get('/api/user/:empid', (req, res) => {
  const empid = req.params.empid;
  const filePath = path.join(detailsDir, `${empid}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'User not found.' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file.' });
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
