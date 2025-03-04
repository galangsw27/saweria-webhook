// src/pages/api/auth/register.js
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { addUser } from '../../../lib/db'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log(`[${new Date().toISOString()}] Request start: POST /api/auth/register`);

    const { username, password } = req.body; // Remove webhookUrl from destructuring
    
    // Validasi input
    if (!username || !password) {
      console.log(`[${new Date().toISOString()}] Input validation failed: Missing fields`);
      return res.status(400).json({ message: 'Username and password are required' });
    }
    console.log(`[${new Date().toISOString()}] Input validation passed: ${JSON.stringify({ username })}`);

    // Generate a UUID for the webhook URL
    const webhookUrl = uuidv4();
    console.log(`[${new Date().toISOString()}] Webhook URL generated: ${webhookUrl}`);

    // Hash password
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      console.log(`[${new Date().toISOString()}] Password hashing successful`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Password hashing failed: ${error.message}`);
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // Simpan pengguna ke database
    try {
      const hashPassword = await bcrypt.hash(password, 10);

      await addUser(username, hashPassword, webhookUrl); // Use the generated webhookUrl
      console.log(`[${new Date().toISOString()}] User added to database successfully`);
      return res.status(201).json({ message: 'User registered successfully', webhookUrl });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Database interaction failed: ${error.message}`);
      return res.status(500).json({ message: 'Error registering user' });
    }
  } else {
    console.log(`[${new Date().toISOString()}] Request method not allowed: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
