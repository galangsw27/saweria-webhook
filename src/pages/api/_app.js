
// pages/api/_app.js
import { createTable } from '../../lib/db';

export default async function handler(req, res) {
  res.status(200).json({ message: 'API is running' });
}
