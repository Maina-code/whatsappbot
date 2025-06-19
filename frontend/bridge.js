import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const apiUrl = process.env.WHATSAPP_API_URL;
const token = process.env.ACCESS_TOKEN;

// Endpoint to receive message from frontend and send to WhatsApp
app.post('/send-whatsapp', async (req, res) => {
  const { number, message } = req.body;

  try {
    const response = await axios.post(
      apiUrl,
      {
        messaging_product: 'whatsapp',
        to: number,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ status: 'success', response: response.data });
  } catch (err) {
    console.error('WhatsApp API error:', err.response?.data || err.message);
    res.status(500).json({ status: 'error', error: err.response?.data || err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 WhatsApp Bridge server running at http://localhost:3000');
});
