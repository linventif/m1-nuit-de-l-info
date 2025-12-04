import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import User from './models/User.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/health', healthRoutes);
app.use('/poutre', (req, res) => {
  res.send('Poutre endpoint is under construction.');
});

app.use('/poutre/:id', (req, res) => {
  // get id from params
  const { id } = req.params;
  console.log(id);
  res.send(id);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Nuit de l'Info API",
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Force sync models (drops and recreates tables on every start)
    await sequelize.sync({ force: true });
    console.log('✅ Database models synchronized (forced).');

    // Seed test data
    await seedTestData();
    console.log('✅ Test data seeded.');

    app.listen(PORT, () => {
      console.log(`🚀 API server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Seed test data function
const seedTestData = async () => {
  try {
    const users = await User.bulkCreate([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2b$10$YourHashedPasswordHere1234567890123456789012345678', // placeholder hashed password
        role: 'admin',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '$2b$10$YourHashedPasswordHere1234567890123456789012345678',
        role: 'user',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: '$2b$10$YourHashedPasswordHere1234567890123456789012345678',
        role: 'moderator',
      },
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: '$2b$10$YourHashedPasswordHere1234567890123456789012345678',
        role: 'user',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: '$2b$10$YourHashedPasswordHere1234567890123456789012345678',
        role: 'user',
      },
    ]);
    console.log(`✅ Created ${users.length} test users`);
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  }
};

startServer();

export default app;
