// ─── Arogya-Setu — Express + PostgreSQL Server ───────────────────────────────
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { sequelize } = require('./models');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/doctors',      require('./routes/doctors'));
app.use('/api/hospitals',    require('./routes/hospitals'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/symptoms',     require('./routes/symptoms'));
app.use('/api/health',       require('./routes/health'));
app.use('/api/emergency',    require('./routes/emergency'));
app.use('/api/outbreak',     require('./routes/outbreak'));
app.use('/api/pharmacy',     require('./routes/pharmacy'));
app.use('/api/ai',           require('./routes/ai'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', message: '🚀 Arogya-Setu API running (Node.js + PostgreSQL)', version: '2.0' });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found` }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');

    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('✅ Database tables synced');

    app.listen(PORT, () => {
      console.log(`\n🚀 Arogya-Setu API running at http://localhost:${PORT}`);
      console.log(`📖 Health check: http://localhost:${PORT}/api/ping\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err.message);
    console.error('\n📋 Make sure PostgreSQL is running and .env is correct');
    process.exit(1);
  }
}

start();
