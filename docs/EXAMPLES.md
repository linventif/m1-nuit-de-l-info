# Project Structure Example

This document provides examples of how to organize code for different features.

## Example: User Management Feature

### Backend Structure

```
apps/api/src/
├── models/
│   └── User.js              # User model definition
├── controllers/
│   └── userController.js    # User business logic
├── routes/
│   └── userRoutes.js        # User API routes
├── middleware/
│   └── auth.js              # Authentication middleware (if needed)
└── utils/
    └── helpers.js           # Utility functions
```

### Frontend Structure

```
apps/web/src/
├── pages/
│   ├── Users.jsx            # Users list page
│   └── UserDetail.jsx       # Single user page
├── components/
│   ├── UserCard.jsx         # User card component
│   ├── UserForm.jsx         # User form component
│   └── common/
│       ├── Loading.jsx
│       └── ErrorMessage.jsx
└── utils/
    ├── api.js               # API client
    └── helpers.js           # Utility functions
```

## Example: Adding a "Posts" Feature

### Step-by-Step Guide

#### 1. Backend - Create Model

```javascript
// apps/api/src/models/Post.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

export const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

// Define relationship
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });

export default Post;
```

#### 2. Backend - Create Controller

```javascript
// apps/api/src/controllers/postController.js
import Post from '../models/Post.js';
import User from '../models/User.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const post = await Post.create({ title, content, userId });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add more methods...
```

#### 3. Backend - Create Routes

```javascript
// apps/api/src/routes/postRoutes.js
import express from 'express';
import { getAllPosts, createPost } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', createPost);

export default router;
```

#### 4. Backend - Register Routes

```javascript
// apps/api/src/index.js
import postRoutes from './routes/postRoutes.js';

app.use('/api/posts', postRoutes);
```

#### 5. Frontend - Create Components

```jsx
// apps/web/src/components/PostCard.jsx
import { formatDate } from '../utils/helpers';

function PostCard(props) {
  const post = props.post;
  
  return (
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{post.title}</h2>
        <p>{post.content}</p>
        <div class="text-sm text-base-content/60">
          By {post.author?.name} • {formatDate(post.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
```

#### 6. Frontend - Create Page

```jsx
// apps/web/src/pages/Posts.jsx
import { createSignal, onMount, For } from 'solid-js';
import { get } from '../utils/api';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Posts() {
  const [posts, setPosts] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await get('/api/posts');
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchPosts();
  });

  return (
    <div>
      <h1 class="text-3xl font-bold mb-6">Posts</h1>
      
      {loading() && <Loading />}
      {error() && <ErrorMessage message={error()} />}
      
      {!loading() && !error() && (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={posts()}>
            {(post) => <PostCard post={post} />}
          </For>
        </div>
      )}
    </div>
  );
}

export default Posts;
```

#### 7. Frontend - Add Route

```jsx
// apps/web/src/App.jsx
import Posts from './pages/Posts';

<Route path="/posts" component={Posts} />
```

#### 8. Frontend - Add Navigation

```jsx
// apps/web/src/components/Navbar.jsx
<li>
  <A href="/posts">Posts</A>
</li>
```

## File Separation Best Practices

### For Multiple Developers

1. **Claim files early**: Comment in the issue which files you'll work on
2. **Avoid working on same files**: Coordinate with team
3. **Small, focused changes**: Easier to review and merge
4. **Frequent commits**: Easier to resolve conflicts

### Recommended File Ownership

```
Developer 1: User authentication (auth.js, Login.jsx, Register.jsx)
Developer 2: User profile (UserProfile.jsx, userController.js)
Developer 3: Posts feature (Post.js, postController.js, Posts.jsx)
Developer 4: Comments feature (Comment.js, commentController.js)
Developer 5: UI components (Button.jsx, Card.jsx, Modal.jsx)
Developer 6: Database migrations and seeds
Developer 7: API middleware and error handling
Developer 8: Frontend routing and navigation
Developer 9: Styling and theming
Developer 10: Testing setup
Developer 11: Documentation
Developer 12: DevOps (Docker, CI/CD)
Developer 13: Project management and code reviews
```

## Communication Template

When starting work on a feature:

```markdown
## Working on: User Profile Feature

### Files I'll be creating/editing:
- apps/api/src/controllers/profileController.js (new)
- apps/api/src/routes/profileRoutes.js (new)
- apps/web/src/pages/UserProfile.jsx (new)
- apps/web/src/components/Navbar.jsx (edit - add profile link)

### Dependencies:
- Needs User model (already exists)
- Will use existing auth middleware

### Estimated completion: 2 days

### Questions:
- Should profile pictures be stored locally or in cloud storage?
```

## Next Steps

- See [Contributing Guidelines](./CONTRIBUTING.md) for coding standards
- See [Git Workflow](./GIT_WORKFLOW.md) for branching strategy
- See [Frontend Structure](./FRONTEND.md) for component patterns
- See [Database Schema](./DATABASE.md) for model definitions
