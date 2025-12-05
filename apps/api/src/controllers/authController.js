import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, gameType } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Determine game type (default to 'classic' if not provided)
    const passwordGameType = gameType || 'classic';

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate salt and hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with password as JSON object using the specified gameType
    const user = await User.create({
      name,
      email,
      password: { [passwordGameType]: hashedPassword },
      salt,
      role: 'user',
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password and salt) and token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password - check against all password hashes in JSON object
    let isPasswordValid = false;
    let matchedGameType = null;

    // Handle both JSON object and legacy string format
    if (typeof user.password === 'string') {
      // Legacy format: single password string
      isPasswordValid = await bcrypt.compare(password, user.password);
      matchedGameType = 'classic';
    } else {
      // New format: JSON object with multiple game passwords
      const passwordObject = user.password;
      
      // Try to match password against any hash in the object
      for (const [gameType, hashedPassword] of Object.entries(passwordObject)) {
        const isValid = await bcrypt.compare(password, hashedPassword);
        if (isValid) {
          isPasswordValid = true;
          matchedGameType = gameType;
          break; // Stop checking once we find a match
        }
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, gameType: matchedGameType },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password and salt) and token
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
      gameType: matchedGameType,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Logout user
 * Note: With JWT, logout is primarily handled client-side by removing the token.
 * This endpoint provides a way to explicitly log out and can be used for logging purposes.
 */
export const logout = async (req, res) => {
  try {
    // On sait qui se déconnecte grâce à req.user
    console.log(`User ${req.user.id} (${req.user.email}) logged out`);
    
    res.json({
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get current user (protected route)
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add or update password for a specific game type
 */
export const updateGamePassword = async (req, res) => {
  try {
    const { gameType } = req.params;
    const { password } = req.body;
    const userId = req.user.id; // Depuis le token JWT

    // Validation
    if (!gameType || !password) {
      return res.status(400).json({ error: 'gameType and password are required' });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Récupérer l'objet password actuel
    let passwordObject = typeof user.password === 'string' 
      ? { classic: user.password } // Si ancien format string
      : { ...user.password };       // Si déjà JSON

    // Vérifier si le mot de passe existe déjà pour ce gameType
    const passwordExists = passwordObject.hasOwnProperty(gameType);

    // Hash le nouveau mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(saltRounds));
    
    // Ajouter ou modifier le mot de passe pour ce type de jeu
    passwordObject[gameType] = hashedPassword;

    // Sauvegarder
    await user.update({ password: passwordObject });

    res.json({
      message: `Password for ${gameType} ${passwordExists ? 'updated' : 'added'} successfully`,
      gameType,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

