// src/pages/api/queue.js
import { insertOrUpdateSettings } from '../../lib/db';
import { verifyToken } from '../../utils/jwt';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = verifyToken(token);
  
      if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const { keywords, minDonate } = req.body;
  
      if (!keywords || !minDonate) {
        return res.status(400).json({ message: 'Keywords and minDonate are required' });
      }
  
      try {
        await insertOrUpdateSettings(connection, keywords, minDonate);
        return res.status(200).json({ success: true, message: 'Settings saved successfully' });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to save settings' });
      } finally {
        if (connection) {
          connection.end();
        }
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
