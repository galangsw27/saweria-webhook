// src/pages/api/webhook.js
import { saveDonation } from '../../lib/db';
import { verifyToken } from '../../utils/jwt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log(`[${new Date().toISOString()}] Request start: POST /api/webhook`);

    const token = req.headers.authorization?.split(' ')[1];
    console.log(`[${new Date().toISOString()}] Token received: ${token ? 'Present' : 'Absent'}`);

    const decoded = verifyToken(token);

    if (!decoded) {
      console.log(`[${new Date().toISOString()}] Token verification failed: Unauthorized`);
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log(`[${new Date().toISOString()}] Token verification successful: User ID ${decoded.id}`);

    const {donator_name, donator_email, amount_raw, message } = req.body;
    console.log(`[${new Date().toISOString()}] Received donation data:From ${donator_name}, Amount ${amount_raw}, Message ${message}`);

    const userId = decoded.id;

    try {
      const donationId = await saveDonation(userId, donator_name, donator_email, amount_raw, message);
      console.log(`[${new Date().toISOString()}] Donation saved successfully: Donation ID ${donationId}`);
      return res.status(201).json({ donationId });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Donation save failed: ${error.message}`);
      return res.status(500).json({ message: 'Error saving donation' });
    }
  } else {
    console.log(`[${new Date().toISOString()}] Request method not allowed: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
