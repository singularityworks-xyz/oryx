# Oryx - Modern E-commerce Platform

A fully functional e-commerce web application built with **Next.js 14**, **MongoDB**, **NextAuth.js**, and **Stripe** for payments.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth and credentials provider
- **Database**: MongoDB with Mongoose ODM
- **Payment Processing**: Stripe integration for secure payments
- **State Management**: Zustand for cart management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Management**: Full CRUD operations for products
- **Order Management**: Complete order lifecycle with status tracking
- **Search & Filtering**: Advanced product search and category filtering
- **Cart System**: Persistent cart with local storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **State Management**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)
- Stripe account
- Google OAuth credentials (optional)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd oryx
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/oryx-ecommerce

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` to point to your cloud database.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product management
│   │   ├── cart/          # Cart operations
│   │   ├── orders/        # Order management
│   │   └── checkout/      # Stripe checkout
│   ├── products/          # Product pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Cart page
│   ├── account/           # User account
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── Providers.tsx
├── lib/                   # Utility libraries
│   ├── db.ts             # Database connection
│   ├── auth.ts           # NextAuth configuration
│   └── mongodb.ts        # MongoDB client
├── models/               # Mongoose models
│   ├── User.ts
│   ├── Product.ts
│   └── Order.ts
└── store/                # State management
    └── cart.ts           # Cart store (Zustand)
```

## 🔧 Configuration

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your environment variables
3. The application will automatically create collections and indexes

### NextAuth.js Setup

1. Generate a secure secret: `openssl rand -base64 32`
2. Add it to `NEXTAUTH_SECRET` in your environment variables
3. For Google OAuth (optional):
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Add them to your environment variables
4. For webhooks (production), configure webhook endpoints

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products with pagination and filtering
- `POST /api/products` - Create a new product (admin only)

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create a new order

### Checkout
- `POST /api/checkout` - Create Stripe payment intent

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CSRF protection
- Input validation and sanitization
- Rate limiting (can be added)
- Secure payment processing with Stripe

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🎯 Roadmap

- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Wishlist functionality
- [ ] Multi-language support
- [ ] PWA features
- [ ] Analytics integration

---

Built with ❤️ using Next.js and modern web technologies.
