import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import User from './models/User.js';
import Score from './models/Score.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/health', healthRoutes);
  
// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Nuit de l'Info API",
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
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
    const bcrypt = (await import('bcrypt')).default;
    const defaultPassword = 'password123';
    const saltRounds = 10;

    // Hash passwords for test users
    const adminSalt = await bcrypt.genSalt(saltRounds);
    const adminPassword = await bcrypt.hash(defaultPassword, adminSalt);

    const moderatorSalt = await bcrypt.genSalt(saltRounds);
    const moderatorPassword = await bcrypt.hash(defaultPassword, moderatorSalt);

    const user1Salt = await bcrypt.genSalt(saltRounds);
    const user1Password = await bcrypt.hash(defaultPassword, user1Salt);

    const user2Salt = await bcrypt.genSalt(saltRounds);
    const user2Password = await bcrypt.hash(defaultPassword, user2Salt);

    const user3Salt = await bcrypt.genSalt(saltRounds);
    const user3Password = await bcrypt.hash(defaultPassword, user3Salt);

    const user4Salt = await bcrypt.genSalt(saltRounds);
    const user4Password = await bcrypt.hash(defaultPassword, user4Salt);

    const users = await User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        salt: adminSalt,
        password: { classic: adminPassword },
        role: 'admin',
      },
      {
        name: 'Moderator User',
        email: 'moderator@example.com',
        salt: moderatorSalt,
        password: { classic: moderatorPassword },
        role: 'moderator',
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        salt: user1Salt,
        password: { classic: user1Password },
        role: 'user',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        salt: user2Salt,
        password: { classic: user2Password },
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        salt: user3Salt,
        password: { classic: user3Password },
        role: 'user',
      },
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        salt: user4Salt,
        password: { classic: user4Password },
        role: 'user',
      },
    ]);
    console.log(
      `✅ Created ${users.length} test users (admin, moderator, and regular users)`
    );
    console.log(
      `   Login credentials: any email above with password "${defaultPassword}"`
    );
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  }
};

startServer();

export default app;
