import dbConnect from '../../../../../lib/dbConnect';
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  // ตรวจสอบว่า Method ต้องเป็น GET เท่านั้น
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { authToken } = req.cookies;

  if (!authToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    await dbConnect();

    const decoded = jwt.verify(authToken, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error in /api/auth/me:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
