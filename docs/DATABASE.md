# Database Schema Documentation

## 📊 Overview

This project uses **MariaDB** as the database with **Sequelize** as the ORM.

## 🗄️ Database Configuration

### Connection Settings

```javascript
// apps/api/src/config/database.js
{
  host: 'localhost',     // or 'db' in Docker
  port: 3306,
  database: 'nuit_info',
  username: 'user',
  password: 'password',
  dialect: 'mariadb'
}
```

### Environment Variables

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nuit_info
DB_USER=user
DB_PASSWORD=password
```

## 📋 Tables

### Users Table

**Table Name:** `users`

**Description:** Stores user information for the application.

**Schema:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User's email address |
| role | VARCHAR(255) | DEFAULT 'user' | User role (user, admin, moderator) |
| createdAt | DATETIME | NOT NULL | Record creation timestamp |
| updatedAt | DATETIME | NOT NULL | Record last update timestamp |

**Indexes:**
- Primary Key: `id`
- Unique Index: `email`

**Model Definition:**

```javascript
// apps/api/src/models/User.js
User.define({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'admin', 'moderator']],
    },
  },
});
```

## 🔄 Migrations

Sequelize automatically syncs models with the database.

### Development Mode

```javascript
// Auto-create/update tables
await sequelize.sync({ alter: true });
```

### Production Mode

```javascript
// Only create missing tables
await sequelize.sync();
```

### Manual Migrations

For production, consider using Sequelize CLI:

```bash
# Install Sequelize CLI
bun add -D sequelize-cli

# Initialize migrations
npx sequelize-cli init

# Create migration
npx sequelize-cli migration:generate --name create-users

# Run migrations
npx sequelize-cli db:migrate

# Undo migration
npx sequelize-cli db:migrate:undo
```

## 🌱 Seed Data

Initial data is created via `init.sql`:

```sql
INSERT INTO `users` (`name`, `email`, `role`, `createdAt`, `updatedAt`) VALUES
('John Doe', 'john@example.com', 'admin', NOW(), NOW()),
('Jane Smith', 'jane@example.com', 'user', NOW(), NOW()),
('Bob Johnson', 'bob@example.com', 'moderator', NOW(), NOW());
```

## 📝 Adding New Models

### 1. Create Model File

Create `apps/api/src/models/YourModel.js`:

```javascript
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const YourModel = sequelize.define(
  'YourModel',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Add your fields here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'your_table_name',
    timestamps: true,
  }
);

export default YourModel;
```

### 2. Create Controller

Create `apps/api/src/controllers/yourController.js`:

```javascript
import YourModel from '../models/YourModel.js';

export const getAll = async (req, res) => {
  try {
    const items = await YourModel.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add more controller methods...
```

### 3. Create Routes

Create `apps/api/src/routes/yourRoutes.js`:

```javascript
import express from 'express';
import { getAll } from '../controllers/yourController.js';

const router = express.Router();

router.get('/', getAll);
// Add more routes...

export default router;
```

### 4. Register Routes

In `apps/api/src/index.js`:

```javascript
import yourRoutes from './routes/yourRoutes.js';

app.use('/api/your-resource', yourRoutes);
```

## 🔗 Relationships

### One-to-Many Example

```javascript
// User has many Posts
User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
});

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
});
```

### Many-to-Many Example

```javascript
// Users belong to many Teams through UserTeams
User.belongsToMany(Team, {
  through: 'UserTeams',
  foreignKey: 'userId',
});

Team.belongsToMany(User, {
  through: 'UserTeams',
  foreignKey: 'teamId',
});
```

## 🔍 Querying Data

### Basic Queries

```javascript
// Find all
const users = await User.findAll();

// Find by primary key
const user = await User.findByPk(1);

// Find one
const user = await User.findOne({ where: { email: 'test@example.com' } });

// Find with conditions
const admins = await User.findAll({
  where: {
    role: 'admin',
  },
});

// Find with pagination
const users = await User.findAll({
  limit: 10,
  offset: 0,
});
```

### Advanced Queries

```javascript
// With operators
import { Op } from 'sequelize';

const users = await User.findAll({
  where: {
    [Op.or]: [
      { role: 'admin' },
      { role: 'moderator' }
    ]
  }
});

// With includes (joins)
const users = await User.findAll({
  include: [{
    model: Post,
    as: 'posts'
  }]
});

// With ordering
const users = await User.findAll({
  order: [['createdAt', 'DESC']]
});
```

## 💾 Data Operations

### Create

```javascript
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
});
```

### Update

```javascript
await User.update(
  { role: 'admin' },
  { where: { id: 1 } }
);

// Or on instance
const user = await User.findByPk(1);
user.role = 'admin';
await user.save();
```

### Delete

```javascript
await User.destroy({
  where: { id: 1 }
});

// Or on instance
const user = await User.findByPk(1);
await user.destroy();
```

## 🛡️ Validation

### Model-level Validation

```javascript
{
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 18,
      max: 100,
    },
  },
}
```

### Custom Validators

```javascript
{
  username: {
    type: DataTypes.STRING,
    validate: {
      customValidator(value) {
        if (value.length < 3) {
          throw new Error('Username must be at least 3 characters');
        }
      },
    },
  },
}
```

## 🔐 Best Practices

### 1. Use Transactions

```javascript
const t = await sequelize.transaction();

try {
  await User.create({ name: 'John' }, { transaction: t });
  await Post.create({ title: 'Post' }, { transaction: t });
  await t.commit();
} catch (error) {
  await t.rollback();
  throw error;
}
```

### 2. Prevent SQL Injection

```javascript
// ✅ Good - Parameterized query
User.findAll({
  where: {
    name: userInput,
  },
});

// ❌ Bad - Raw query without parameters
sequelize.query(`SELECT * FROM users WHERE name = '${userInput}'`);
```

### 3. Select Only Needed Fields

```javascript
// ✅ Good
User.findAll({
  attributes: ['id', 'name', 'email'],
});

// ❌ Bad - Selects all fields
User.findAll();
```

### 4. Use Indexes

```javascript
{
  email: {
    type: DataTypes.STRING,
    unique: true,  // Creates index
  },
}

// Or in model options
{
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
}
```

## 🧪 Testing Queries

Use MariaDB shell or a GUI tool:

```bash
# Access database
docker-compose exec db mariadb -u user -p nuit_info

# Run queries
SELECT * FROM users;
SELECT * FROM users WHERE role = 'admin';
```

## 📊 Database Tools

### CLI Tools

- **mariadb-dump**: Backup database
- **mariadb**: Interactive shell

### GUI Tools

- **DBeaver**: Free, cross-platform
- **MySQL Workbench**: Official MySQL GUI
- **phpMyAdmin**: Web-based
- **TablePlus**: Modern, paid

## 🔗 Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [MariaDB Documentation](https://mariadb.com/kb/en/)
- [Sequelize CLI](https://github.com/sequelize/cli)
- [Sequelize Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)

## 📚 Next Steps

- Return to [main README](../README.md)
- See [API Documentation](../apps/api/API.md)
- Check [Contributing Guidelines](./CONTRIBUTING.md)
