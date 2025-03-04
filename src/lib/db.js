// lib/db.js
import mysql from 'mysql2/promise';

// Konfigurasi koneksi ke database MySQL
const dbConfig = {
  host: 'localhost', // Ganti dengan host MySQL Anda
  user: 'root',      // Ganti dengan username MySQL Anda
  password: '123123@', // Ganti dengan password MySQL Anda
  database: 'dbQueue', // Ganti dengan nama database Anda
};

// Fungsi untuk membuka koneksi ke database MySQL
export const openDb = async () => {
  return await mysql.createConnection(dbConfig);
};

// Fungsi untuk menambahkan pengguna
export const addUser = async (username, password, webhookUrl) => {
    const db = await openDb();
    await db.execute('INSERT INTO users (username, password, webhook_url) VALUES (?, ?, ?)', [username, password, webhookUrl]);
    await db.end();
};

// Fungsi untuk mendapatkan pengguna berdasarkan username
export const getUserByUsername = async (username) => {
    const db = await openDb();
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    await db.end();

    return rows[0];
};
// Fungsi untuk menyimpan donasi
export const saveDonation = async (userId, donator_name, donator_email, amount, message) => {
const db = await openDb();
await db.execute('INSERT INTO donations (user_id, donator_name, donator_email, amount, message) VALUES (?, ?, ?, ?, ?)', [userId, donator_name, donator_email, amount, message]);
await db.end();
};

// Fungsi untuk mendapatkan antrian donasi berdasarkan user_id
export const getDonationsByUserId = async (userId) => {
const db = await openDb();
const [rows] = await db.execute('SELECT * FROM donations WHERE user_id = ?', [userId]);
await db.end();
return rows;
};

export const insertOrUpdateSettings = async (connection, keywords, minDonate) => {
    try {
      // Check if the record exists
      const [rows] = await connection.execute('SELECT id FROM settings WHERE keywords = ?', [keywords]);
      
      if (rows.length > 0) {
        // Update existing record
        await connection.execute('UPDATE settings SET minDonate = ? WHERE keywords = ?', [minDonate, keywords]);
      } else {
        // Insert new record
        await connection.execute('INSERT INTO settings (keywords, minDonate) VALUES (?, ?)', [keywords, minDonate]);
      }
    } catch (error) {
      console.error('Error inserting or updating settings:', error);
      throw error;
    }
  }
