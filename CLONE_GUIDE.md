# Cloning CourseForge AI Repository

## Quick Clone Commands

### Using HTTPS (with token authentication):
```bash
git clone https://github.com/lifetestedLLC/courseforge-ai.git
cd courseforge-ai
```

### Using SSH (if you have SSH keys set up):
```bash
git clone git@github.com:lifetestedLLC/courseforge-ai.git
cd courseforge-ai
```

### Using GitHub CLI:
```bash
gh repo clone lifetestedLLC/courseforge-ai
cd courseforge-ai
```

## Complete Setup After Cloning

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/courseforge"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Stripe
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Verify Installation
```bash
# Run development server
npm run dev

# Test Stripe connection
npm run stripe:test

# Run linter
npm run lint

# Build the application
npm run build
```

## Environment-Specific Setup

### Development Environment
```bash
# Start development server
npm run dev

# Access the application
open http://localhost:3000
```

### Production Environment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Verification Checklist

After cloning and setting up, verify:

- [ ] All dependencies installed successfully
- [ ] Environment variables configured correctly
- [ ] Database connection established
- [ ] Prisma client generated
- [ ] Development server starts without errors
- [ ] Stripe integration tests pass
- [ ] Application builds successfully
- [ ] All pages load correctly

## Common Issues After Cloning

### 1. Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 2. Database Connection Issues
```bash
# Verify database is running
# Check connection string in .env.local
# Ensure database exists
```

### 3. Environment Variable Issues
```bash
# Check all required variables are set
# Verify no typos in variable names
# Ensure values are correct
```

### 4. Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## Git Configuration for New Clone

### Set up your Git identity:
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Add upstream remote (if forking):
```bash
git remote add upstream https://github.com/lifetestedLLC/courseforge-ai.git
```

### Keep your fork updated:
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Development Workflow

### 1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

### 2. Make your changes and commit:
```bash
git add .
git commit -m "Add your feature description"
```

### 3. Push to your branch:
```bash
git push origin feature/your-feature-name
```

### 4. Create a pull request on GitHub

## Team Collaboration

### Pull latest changes:
```bash
git pull origin main
```

### Check status:
```bash
git status
```

### View recent commits:
```bash
git log --oneline -5
```

## Docker Setup (Alternative)

If you prefer using Docker, you can create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Then build and run:
```bash
docker build -t courseforge-ai .
docker run -p 3000:3000 --env-file .env.local courseforge-ai
```

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/lifetestedLLC/courseforge-ai/issues)
2. Create a new issue with detailed error information
3. Include your environment details (OS, Node version, etc.)

## Next Steps

After successful setup:

1. **Explore the codebase** - Start with the `src/app` directory
2. **Review the documentation** - Check the various markdown files
3. **Test the features** - Try user registration, payments, etc.
4. **Customize for your needs** - Modify the code as required
5. **Deploy your instance** - Follow the deployment guide

---

**Happy coding! 🚀**