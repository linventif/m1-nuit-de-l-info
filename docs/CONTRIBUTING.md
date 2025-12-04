# Contributing Guidelines

Welcome! This guide will help you contribute effectively to the project with ~13 developers.

## 🎯 Getting Started

### Before You Start

1. **Read the documentation**
   - [README.md](../README.md) - Project overview
   - [Git Workflow](./GIT_WORKFLOW.md) - Branching and PR process
   - [Frontend Structure](./FRONTEND.md) - Frontend development
   - [API Documentation](../apps/api/API.md) - Backend API
   - [Database Schema](./DATABASE.md) - Database structure

2. **Set up your environment**
   ```bash
   # Install dependencies
   bun install
   
   # Copy environment variables
   cp .env.example .env
   
   # Start database
   docker-compose up db -d
   
   # Run development servers
   bun dev
   ```

3. **Create an issue** (if one doesn't exist)
   - Describe what you want to work on
   - Wait for approval from maintainers
   - Get assigned to the issue

## 📋 Coding Standards

### JavaScript Style Guide

#### General Rules

```javascript
// ✅ Use const/let, never var
const userName = 'John';
let counter = 0;

// ✅ Use arrow functions
const add = (a, b) => a + b;

// ✅ Use template literals
const message = `Hello, ${userName}!`;

// ✅ Use destructuring
const { name, email } = user;
const [first, second] = items;

// ✅ Use async/await over promises
async function fetchData() {
  const response = await fetch(url);
  return response.json();
}

// ✅ Use meaningful variable names
const userCount = users.length;  // Good
const uc = users.length;         // Bad
```

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() {}

// Components: PascalCase
function UserCard() {}
function NavigationBar() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3001';
const MAX_RETRY_ATTEMPTS = 3;

// Files:
// - Components: PascalCase (UserCard.jsx)
// - Utilities: camelCase (formatDate.js)
// - Pages: PascalCase (HomePage.jsx)
```

#### File Organization

```javascript
// ✅ Organize imports
// 1. External dependencies
import { createSignal } from 'solid-js';
import { A } from '@solidjs/router';

// 2. Internal dependencies
import Button from '../components/Button';
import { formatDate } from '../utils/date';

// 3. Styles
import './styles.css';

// Component code here...
```

### JSX Style Guide

```jsx
// ✅ Self-closing tags
<Component />

// ✅ Props on separate lines (if many)
<Component
  prop1="value1"
  prop2="value2"
  prop3="value3"
/>

// ✅ Use class instead of className (SolidJS)
<div class="container">

// ✅ Event handlers with arrow functions
<button onClick={() => handleClick()}>

// ✅ Conditional rendering
<Show when={condition} fallback={<Loading />}>
  <Content />
</Show>

// ✅ Lists with For component
<For each={items()}>
  {(item) => <Item data={item} />}
</For>
```

### CSS/Tailwind Style Guide

```jsx
// ✅ Use Tailwind utility classes
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ✅ Use DaisyUI components
<button class="btn btn-primary">Click Me</button>

// ✅ Group related classes
<div class="
  flex flex-col gap-4
  p-6 m-4
  bg-base-100 rounded-lg shadow-xl
">

// ❌ Avoid inline styles (use Tailwind instead)
<div style="padding: 16px;">  // Bad
<div class="p-4">             // Good
```

### Backend Style Guide

```javascript
// ✅ Use ES6 modules
import express from 'express';

// ✅ Use async/await
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Validate input
if (!name || !email) {
  return res.status(400).json({ error: 'Name and email required' });
}

// ✅ Use proper HTTP status codes
res.status(201).json(user);  // Created
res.status(404).json({ error: 'Not found' });
res.status(500).json({ error: 'Server error' });
```

## 🌳 Git Workflow

### Branch Naming

```bash
# Feature
feature/user-authentication
feature/add-search-functionality

# Bug fix
bugfix/fix-login-error
bugfix/resolve-navigation-issue

# Documentation
docs/update-readme
docs/add-api-documentation

# Hotfix
hotfix/critical-security-fix
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(auth): add user registration
fix(api): resolve database connection issue
docs(readme): update installation instructions
style(web): format code with prettier
refactor(api): improve query performance
test(auth): add login tests
chore: update dependencies
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Pull Request Process

1. **Create PR from your feature branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature
   git merge develop
   git push origin feature/your-feature
   ```

2. **Fill out PR template**
   - Clear title
   - Description of changes
   - Screenshots (if UI changes)
   - Link related issues

3. **Request reviewers**
   - Assign at least 1 reviewer
   - Tag team members if needed

4. **Address feedback**
   - Make requested changes
   - Reply to comments
   - Re-request review

5. **Merge**
   - Use "Squash and Merge"
   - Delete branch after merge

## ✅ Pull Request Checklist

Before creating a PR, ensure:

- [ ] Code follows style guide
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Code is properly formatted (`bun format`)
- [ ] Branch is up to date with `develop`
- [ ] Commits follow conventional format
- [ ] Documentation updated (if needed)
- [ ] No merge conflicts

## 🧪 Testing

### Running Tests

```bash
# Run all tests (when implemented)
bun test

# Run tests for specific package
bun turbo run test --filter=api
```

### Writing Tests

```javascript
// Example test structure (when test framework is added)
describe('User API', () => {
  it('should create a new user', async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@example.com' }),
    });
    
    expect(response.status).toBe(201);
  });
});
```

## 📝 Documentation

### Code Comments

```javascript
// ✅ Good - Explain WHY, not WHAT
// Use binary search because array is sorted
const index = binarySearch(arr, target);

// ❌ Bad - States the obvious
// Loop through array
for (let i = 0; i < arr.length; i++) {}

// ✅ Document complex functions
/**
 * Calculate user's total score including bonuses
 * @param {Object} user - User object with scores array
 * @param {number} bonusMultiplier - Multiplier for bonus calculation
 * @returns {number} Total score with bonuses applied
 */
function calculateScore(user, bonusMultiplier) {
  // Implementation...
}
```

### README Updates

When adding new features:

1. Update main README.md if needed
2. Add to relevant documentation in `docs/`
3. Update API.md for new endpoints
4. Add examples for new components

## 🚀 Development Workflow

### Daily Workflow

```bash
# 1. Start your day
git checkout develop
git pull origin develop

# 2. Create feature branch (if new task)
git checkout -b feature/my-feature

# 3. Make changes and commit frequently
git add .
git commit -m "feat: add user profile component"

# 4. Push changes
git push origin feature/my-feature

# 5. Create PR when ready
# (via GitHub/GitLab UI)

# 6. After PR is merged
git checkout develop
git pull origin develop
git branch -d feature/my-feature
```

### Working with Team Members

1. **Communication**
   - Post updates in team chat
   - Tag relevant people in PRs
   - Ask questions early

2. **Code Reviews**
   - Review PRs promptly (within 24h)
   - Be constructive and specific
   - Approve only if you'd maintain it

3. **Conflicts**
   - Communicate before working on same files
   - Merge `develop` regularly
   - Resolve conflicts promptly

## 🐛 Debugging

### Frontend Debugging

```javascript
// Use console.log for debugging
console.log('User data:', user);

// Use debugger statement
function processData(data) {
  debugger;  // Execution will pause here
  return data.map(item => item.value);
}

// Use browser DevTools
// - React DevTools (works with SolidJS via adapter)
// - Network tab for API calls
// - Console for errors
```

### Backend Debugging

```javascript
// Use console.log
console.log('Request body:', req.body);

// Use try-catch for errors
try {
  const user = await User.findByPk(id);
} catch (error) {
  console.error('Database error:', error);
}

// Check database directly
docker-compose exec db mariadb -u root -p
```

## 📦 Adding Dependencies

```bash
# Add to specific package
cd apps/web
bun add package-name

# Add dev dependency
bun add -d package-name

# Add to root (if shared)
bun add -w package-name

# Update package-lock
bun install
```

**Before adding:**
1. Check if similar package already exists
2. Discuss with team if it's a large dependency
3. Document why it's needed in PR

## 🎨 UI/UX Guidelines

1. **Responsive Design**
   - Test on mobile, tablet, desktop
   - Use Tailwind responsive classes (`md:`, `lg:`)

2. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels where needed
   - Ensure keyboard navigation works

3. **Loading States**
   - Show loading indicators for async operations
   - Use DaisyUI loading components

4. **Error Handling**
   - Display user-friendly error messages
   - Use DaisyUI alerts

## ❓ Getting Help

1. **Check documentation first**
   - README and docs folder
   - Existing code examples

2. **Search for similar issues**
   - GitHub issues
   - Team chat history

3. **Ask in team chat**
   - Provide context
   - Share code snippets
   - Include error messages

4. **Create detailed issue**
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior

## 🏆 Recognition

Great contributors:
- Write clean, maintainable code
- Help review others' PRs
- Improve documentation
- Share knowledge with team
- Report and fix bugs

## 📚 Resources

- [SolidJS Docs](https://www.solidjs.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Sequelize Docs](https://sequelize.org/docs/v6/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 📞 Contact

- Team Chat: [Your team chat link]
- Issues: [GitHub/GitLab issues link]
- Email: [Team email]

---

Thank you for contributing! 🎉
