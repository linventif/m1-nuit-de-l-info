# Git Workflow Guide

This guide outlines the Git workflow for the Nuit de l'Info project with ~13 developers.

## 🌳 Branching Strategy

We use a simplified Git Flow strategy:

```
main (production-ready code)
  └── develop (integration branch)
      ├── feature/your-feature-name
      ├── feature/another-feature
      └── bugfix/fix-description
```

### Branch Types

- **`main`** - Production-ready code. Protected branch.
- **`develop`** - Integration branch for features. Protected branch.
- **`feature/*`** - New features or enhancements
- **`bugfix/*`** - Bug fixes
- **`hotfix/*`** - Urgent fixes for production
- **`docs/*`** - Documentation updates

## 🚀 Workflow

### 1. Starting New Work

```bash
# Make sure you're on develop and it's up to date
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 2. Making Changes

```bash
# Make your changes, then stage them
git add .

# Commit with a descriptive message
git commit -m "feat: add user authentication"

# Push to remote
git push origin feature/your-feature-name
```

### 3. Creating a Pull Request

1. Go to GitHub/GitLab
2. Create a Pull Request from your branch to `develop`
3. Fill in the PR template:
   - **Title**: Clear, concise description
   - **Description**: What changed and why
   - **Screenshots**: If UI changes
   - **Related Issues**: Link any related issues
4. Request at least one reviewer
5. Link any related issues

### 4. Code Review Process

**As an Author:**
- Respond to all comments
- Make requested changes in new commits
- Don't force push after reviews start
- Notify reviewers when ready for re-review

**As a Reviewer:**
- Review within 24 hours
- Be constructive and specific
- Approve only if you'd be happy to maintain the code
- Check for:
  - Code quality and style
  - Tests (if applicable)
  - Documentation updates
  - No merge conflicts

### 5. Merging

Once approved:
```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop

# Resolve any conflicts, then push
git push origin feature/your-feature-name
```

Merge via GitHub/GitLab UI using **"Squash and Merge"** for clean history.

### 6. After Merge

```bash
# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch (or via GitHub UI)
git push origin --delete feature/your-feature-name

# Update develop
git checkout develop
git pull origin develop
```

## 📝 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(api): add user registration endpoint
fix(web): resolve navigation bug on mobile
docs(readme): update installation instructions
refactor(api): improve database query performance
style(web): format code with prettier
test(api): add user controller tests
chore: update dependencies
```

## 🔄 Keeping Your Branch Updated

```bash
# Regularly sync with develop
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop
```

Or use rebase for cleaner history:
```bash
git checkout feature/your-feature-name
git rebase develop
```

## ⚠️ Handling Merge Conflicts

```bash
# When conflicts occur during merge
git status  # See conflicting files

# Open files and resolve conflicts
# Look for <<<<<<< HEAD markers

# After resolving
git add .
git commit -m "resolve merge conflicts"
git push
```

## 🏷️ Tagging Releases

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags
git push origin --tags
```

## 👥 Team Practices

### Daily Workflow
1. Pull latest `develop` at start of day
2. Work on your feature branch
3. Commit frequently with good messages
4. Push at end of day
5. Create PR when feature is complete

### Communication
- Post in team chat when creating PR
- Tag reviewers appropriately
- Discuss complex changes before implementing
- Update project board/issues

### Before Creating PR
- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] No console errors
- [ ] Documentation updated
- [ ] Branch is up to date with `develop`
- [ ] Meaningful commit messages

### PR Checklist
- [ ] Title is clear and descriptive
- [ ] Description explains what and why
- [ ] Related issues are linked
- [ ] Screenshots included (if UI changes)
- [ ] No merge conflicts
- [ ] CI/CD passes
- [ ] At least one reviewer assigned

## 🚨 Emergency Hotfixes

For critical production issues:

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# Make fix and test thoroughly
git add .
git commit -m "hotfix: fix critical production bug"

# Merge to both main and develop
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop

# Tag the release
git tag -a v1.0.1 -m "Hotfix: critical bug fix"
git push origin --tags

# Delete hotfix branch
git branch -d hotfix/critical-bug-fix
```

## 📚 Useful Git Commands

```bash
# View branch graph
git log --graph --oneline --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD

# View changes
git diff

# View staged changes
git diff --staged

# Stash changes temporarily
git stash
git stash pop

# View all branches
git branch -a

# Search commits
git log --grep="keyword"

# View file history
git log --follow filename
```

## 🔗 Resources

- [Pro Git Book](https://git-scm.com/book/en/v2)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)
