const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import DB connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS with whitelist support
const rawClientUrls = process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawClientUrls.split(',').map(u => u.trim()).filter(Boolean);

console.log('🔓 Allowed CORS Origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow non-browser requests (curl, Postman, server-to-server)
    if (!origin) {
      console.log('✅ Allowed: No origin (server-to-server)');
      return callback(null, true);
    }

    // Exact match against configured allowlist
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ Allowed origin: ${origin}`);
      return callback(null, true);
    }

    // Allow Vercel app subdomains (useful for preview/deployed apps)
    try {
      const host = new URL(origin).hostname;
      if (host && host.endsWith('.vercel.app')) {
        console.log(`✅ Allowed Vercel origin: ${origin}`);
        return callback(null, true);
      }
    } catch (err) {
      // ignore URL parse errors and fall through to block
    }

    // If not allowed, explicitly deny (no CORS headers will be sent)
    console.warn(`❌ Blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Mount routes (support both /api/* and legacy /* to tolerate deployed client config)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Team Task Manager API is running',
    database: 'Connected',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});