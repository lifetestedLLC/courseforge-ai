# CourseForge AI 🎓

An intelligent course platform built with Next.js, featuring AI-powered content generation, Stripe payment integration, and modern authentication.

## 🌟 Features

- **AI-Powered Course Generation**: Leverage OpenAI to create intelligent course content
- **Secure Authentication**: NextAuth.js with multiple provider support
- **Payment Processing**: Full Stripe integration with subscription management
- **Modern UI/UX**: Responsive design with Tailwind CSS and Lucide React icons
- **Database Management**: Prisma ORM with PostgreSQL support
- **Type Safety**: Full TypeScript support throughout the application
- **API Documentation**: Comprehensive API endpoints with examples

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **Payments**: Stripe
- **AI Integration**: OpenAI API
- **Icons**: Lucide React
- **Validation**: Zod

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Stripe account
- OpenAI API key

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lifetestedLLC/courseforge-ai.git
cd courseforge-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the example environment file and configure your variables:

```bash
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

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio for database management
npm run db:studio
```

### 5. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Set up your products and pricing in the Stripe dashboard
3. Configure webhook endpoints
4. Update the product/price IDs in your application

### 6. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🧪 Testing

### Stripe Integration Tests

```bash
# Test Stripe connection
npm run stripe:test

# Test Stripe connection with environment
npm run stripe:connection

# Verify price IDs
npm run stripe:prices

# Test webhook events
npm run stripe:webhooks:test
```

### Listen to Stripe Webhooks (Local Development)

```bash
npm run stripe:webhooks
```

## 📚 API Documentation

The application includes comprehensive API documentation. Key endpoints:

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js authentication

### Stripe Integration
- `GET /api/stripe/test-connection` - Test Stripe connection
- `GET /api/stripe/verify-prices` - Verify Stripe price IDs
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Application Routes
- `/` - Landing page
- `/login` - Authentication page
- `/dashboard` - User dashboard
- `/pricing` - Pricing plans

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run stripe:test` - Test Stripe integration
- `npm run stripe:webhooks` - Listen to Stripe webhooks

## 📁 Project Structure

```
courseforge-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── login/             # Authentication pages
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── test-*.js                  # Test scripts
└── documentation files        # Various guides
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Support

If you encounter any issues or have questions:

1. Check the existing [Issues](https://github.com/lifetestedLLC/courseforge-ai/issues)
2. Create a new issue with detailed information
3. Include relevant logs, error messages, and steps to reproduce

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Stripe Documentation](https://stripe.com/docs)
- [OpenAI Documentation](https://platform.openai.com/docs)

---

**Built with ❤️ by LifeTested LLC**