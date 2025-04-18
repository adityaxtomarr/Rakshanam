import twilio from 'twilio';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

const accountSid = 'ACa10f2d6909f86f2e359323e74233f46e';
const authToken = 'ec84d5288088618c6d70069fba0936be';
const client = twilio(accountSid, authToken);
const emergencyContacts = ['+918340636142'];

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.post('/upload', upload.single('recording'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  console.log('Uploaded file URL:', fileUrl);

  // ✅ Send SMS here
  for (const number of emergencyContacts) {
    try {
      const message = await client.messages.create({
        body: `🚨 SOS Alert! View the recording: ${fileUrl}`,
        from: '+918340636142', 
        to: number
      });
      console.log(`✅ SMS sent to ${number}: ${message.sid}`);
    } catch (err) {
      console.error(`❌ Failed to send SMS to ${number}:`, err.message);
    }
  }

  res.json({ url: fileUrl });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
