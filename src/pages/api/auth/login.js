// src/pages/api/auth.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  { getUserByUsername } from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ganti dengan secret Anda

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;


      const user = await getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      const webhookUrl = user.webhook_url;
      return res.status(200).json({ message: 'Login success' , token , webhookUrl  });
  }

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  
}
