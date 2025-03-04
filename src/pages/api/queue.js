// src/pages/api/queue.js
import { getDonationsByUserId } from '../../lib/db';
import { verifyToken } from '../../utils/jwt';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = decoded.id;
    const donations = await getDonationsByUserId(userId);
    return res.status(200).json({ donations });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
