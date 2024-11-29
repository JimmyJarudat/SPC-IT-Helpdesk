import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ลบ Cookie
  res.setHeader('Set-Cookie', serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // ลบ Cookie โดยตั้งค่าเป็นวันหมดอายุในอดีต
  }));

  res.status(200).json({ message: 'Logged out successfully' });
}
