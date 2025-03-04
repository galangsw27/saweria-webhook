// src/pages/api/webhook/[uuid].js
import { saveDonation } from '../../../lib/db'; // Adjust the import path as necessary
import { verifyToken } from '../../../utils/jwt'; // Adjust the import path as necessary

export default async function handler(req, res) {
  const { uuid } = req.query; // Get the UUID from the URL

  if (req.method === 'POST') {
    console.log(`[${new Date().toISOString()}] Request start: POST /api/webhook/${uuid}`);

    const token = req.headers.authorization?.split(' ')[1];
    console.log(`[${new Date().toISOString()}] Token received: ${token ? 'Present' : 'Absent'}`);

    // Verify the JWT token
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log(`[${new Date().toISOString()}] Token verification failed: Unauthorized`);
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log(`[${new Date().toISOString()}] Token verification successful: User ID ${decoded.id}`);

    // Extract donation data from the request body
    const { donator_name, donator_email, amount_raw, message } = req.body;
    console.log(`[${new Date().toISOString()}] Received donation data: From ${donator_name}, Amount ${amount_raw}, Message ${message}`);

    const userId = decoded.id; // Get the user ID from the decoded token

    try {
      // Save the donation to the database
      const donationId = await saveDonation(userId, donator_name, donator_email, amount_raw, message);
      console.log(`[${new Date().toISOString()}] Donation saved successfully: Donation ID ${donationId}`);
      return res.status(201).json({ message: 'Donation saved successfully', status: 200 });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Donation save failed: ${error.message}`);
      return res.status(500).json({ message: 'Error saving donation' });
    }
  } else {
    console.log(`[${new Date().toISOString()}] Request method not allowed: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
