const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define the Product schema directly in the seed script
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Product name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one image'],
  }],
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'other'],
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  sku: {
    type: String,
    required: [true, 'Please provide a SKU'],
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create the Product model
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
    ],
    category: "electronics",
    stock: 50,
    sku: "WH-001"
  },
  {
    name: "Premium Cotton T-Shirt",
    description: "Comfortable and stylish cotton t-shirt made from 100% organic cotton. Available in multiple colors and sizes.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"
    ],
    category: "clothing",
    stock: 100,
    sku: "TS-001"
  },
  {
    name: "The Art of Programming",
    description: "A comprehensive guide to modern programming practices, algorithms, and software development methodologies.",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"
    ],
    category: "books",
    stock: 25,
    sku: "BK-001"
  },
  {
    name: "Smart Home Assistant",
    description: "Voice-controlled smart home assistant with AI capabilities. Control your home devices with simple voice commands.",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
    ],
    category: "electronics",
    stock: 30,
    sku: "SHA-001"
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and fitness activities.",
    price: 39.99,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
    ],
    category: "sports",
    stock: 75,
    sku: "YM-001"
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Beautiful handcrafted ceramic coffee mugs. Set of 4, perfect for your morning coffee or tea.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ],
    category: "home",
    stock: 60,
    sku: "CM-001"
  },
  {
    name: "Running Shoes Pro",
    description: "Professional running shoes with advanced cushioning technology. Designed for maximum comfort and performance.",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
    ],
    category: "sports",
    stock: 40,
    sku: "RS-001"
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
    price: 29.99,
    images: [
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500"
    ],
    category: "electronics",
    stock: 80,
    sku: "WC-001"
  }
];

async function seedDatabase() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env.local');
      console.log('Please add MONGODB_URI to your .env.local file');
      console.log('Example: MONGODB_URI=mongodb://localhost:27017/oryx-ecommerce');
      return;
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    // Display inserted products
    console.log('\nInserted products:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.sku}) - $${product.price}`);
    });

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.log('\nMongoDB is not running. Please:');
      console.log('1. Install MongoDB locally, or');
      console.log('2. Use MongoDB Atlas (cloud), or');
      console.log('3. Update MONGODB_URI in .env.local to point to your MongoDB instance');
    }
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
  }
}

// Run the seed function
seedDatabase(); 