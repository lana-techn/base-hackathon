# 🌿 Git Workflow - BethNa AI Trader

## Branch Strategy

### 🔄 **Branch Structure**

```
main (protected)
├── production (protected) 
└── development
    └── feature/* (development branches)
```

### 👥 **User Roles**

- **maulana-tech** (`firdaussyah03@gmail.com`) - Developer
- **lana-techn** (`developerlana0@gmail.com`) - Maintainer/Merger

## 🚀 Development Workflow

### 1. **Feature Development** (maulana-tech)

```bash
# Start from development branch
git checkout development
git pull origin development

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: implement your feature"

# Push feature branch
git push origin feature/your-feature-name
```

### 2. **Create Pull Request**

- **From**: `feature/your-feature-name`
- **To**: `development`
- **Reviewer**: lana-techn
- **Auto-merge**: After approval

### 3. **Development to Production** (lana-techn only)

```bash
# Switch to lana-techn account
git config user.name "lana-techn"
git config user.email "developerlana0@gmail.com"

# Merge development to production
git checkout production
git pull origin production
git merge development
git push origin production
```

### 4. **Production to Main** (lana-techn only)

```bash
# Merge production to main for deployment
git checkout main
git pull origin main
git merge production
git push origin main
```

## 🔧 Vercel Deployment Strategy

### **Deployment Approach**

Due to Vercel collaboration limitations, we use separate deployment strategies:

- **Production** (lana-techn): https://bethna-ai-trader.vercel.app
- **Development** (maulana-tech): https://bethna-ai-trader-dev.vercel.app

### **Deployment Commands**

```bash
# Development deployment (maulana-tech)
./scripts/deploy-dev.sh

# Production deployment (lana-techn only)
./scripts/switch-user.sh prod
vercel --prod
```

### **Environment Variables by Branch**

#### Production (main):
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=prod_api_key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_AGENT_ALPHA_URL=https://api.bethna.ai
```

#### Development:
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=dev_api_key
NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_AGENT_ALPHA_URL=http://localhost:8000
```

## 🛡️ Branch Protection Rules

### **Main Branch** (Protected)
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Restrict pushes to lana-techn only
- ✅ Include administrators in restrictions

### **Production Branch** (Protected)
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Restrict pushes to lana-techn only

### **Development Branch** (Open)
- ✅ Allow direct pushes from maulana-tech
- ✅ Automatic deployment to preview environment

## 🔄 Release Process

### **Hotfix Process**

```bash
# Emergency fix (lana-techn)
git checkout main
git checkout -b hotfix/critical-fix
# Make fix
git checkout main
git merge hotfix/critical-fix
git push origin main

# Backport to other branches
git checkout production
git merge main
git push origin production

git checkout development  
git merge production
git push origin development
```

### **Regular Release**

1. **Development** → Test features
2. **Production** → Staging/QA testing
3. **Main** → Production deployment

## 📝 Commit Convention

### **Format**
```
type(scope): description

[optional body]

[optional footer]
```

### **Types**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### **Examples**
```bash
feat(trading): add real-time price updates
fix(wallet): resolve connection timeout issue
docs(readme): update deployment instructions
test(validation): add property-based tests
```

## 🚨 Emergency Procedures

### **Rollback Production**
```bash
# lana-techn only
git checkout main
git revert HEAD
git push origin main
```

### **Force Sync Branches**
```bash
# Reset development to match production
git checkout development
git reset --hard origin/production
git push --force origin development
```

## 🔍 Code Review Guidelines

### **Review Checklist**
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No sensitive data in commits
- [ ] Performance impact considered
- [ ] Security implications reviewed

### **Approval Process**
1. **maulana-tech** creates PR
2. **lana-techn** reviews and approves
3. Auto-merge to target branch
4. Automatic deployment triggers

## 🎯 Quick Commands

### **Switch User Context**
```bash
# For development (maulana-tech)
git config user.name "maulana-tech"
git config user.email "firdaussyah03@gmail.com"

# For production merges (lana-techn)  
git config user.name "lana-techn"
git config user.email "developerlana0@gmail.com"
```

### **Branch Status**
```bash
# Check all branches
git branch -a

# Check current branch
git branch --show-current

# Check branch tracking
git branch -vv
```

This workflow ensures clean separation of concerns and prevents collaboration issues with Vercel deployments! 🚀