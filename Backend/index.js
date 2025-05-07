const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const PORT = 4000; // Your API port

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup to allow Next.js (adjust origin to your frontend)
app.use(cors({
  origin: 'http://localhost:3001', // Next.js dev server
  credentials: true               // Allow credentials (cookies)
}));

// Mock user data (in real case, fetch from DB)
const USERS = [
  { email: 'admin@mail.com', password: 'password123', role: 'admin' },
  { email: 'recruiter@mail.com', password: 'userpass', role: 'recruiter' }
];

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In a real app, generate a JWT token instead
  const authToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');

  // Set cookies
  res.cookie('auth_token', authToken, {
    httpOnly: false,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.cookie('user_role', user.role, {
    httpOnly: false, // Accessible to client-side if needed
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: 'Login successful', data: {user: {
    email: user.email,
    role: user.role
  }, token: authToken, } });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
