const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define the Product schema to match the current model
const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Please provide a product ID'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Product name cannot be more than 100 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  costPrice: {
    type: Number,
    required: [true, 'Please provide a cost price'],
    min: [0, 'Cost price cannot be negative'],
  },
  discount: {
    type: Number,
    required: [true, 'Please provide a discount amount'],
    min: [0, 'Discount cannot be negative'],
    default: 0,
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Please provide a selling price'],
    min: [0, 'Selling price cannot be negative'],
  },
  categories: [{
    type: String,
    required: [true, 'Please provide at least one category'],
    enum: ['cutleries', 'chinaware', 'glassware', 'kitchen utensils', 'others'],
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  images: [{
    type: String,
    required: [true, 'Please provide at least one image'],
  }],
  sku: {
    type: String,
    required: [true, 'Please provide a SKU'],
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'Length cannot be negative'],
    },
    width: {
      type: Number,
      min: [0, 'Width cannot be negative'],
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative'],
    },
  },
  brand: {
    type: String,
    trim: true,
  },
  material: {
    type: String,
    trim: true,
  },
  warranty: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to calculate selling price
ProductSchema.pre('save', function(next) {
  if (this.isModified('costPrice') || this.isModified('discount')) {
    this.sellingPrice = this.costPrice - this.discount;
  }
  next();
});

// Create the Product model
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const homepageProducts = [
  {
    productId: "HP-001",
    name: "Elegant White Dinner Plate Set",
    description: "Sophisticated white dinner plates crafted from premium porcelain. Perfect for formal dining and everyday elegance. Set of 6 plates with a timeless design that complements any table setting.",
    costPrice: 89.99,
    discount: 15.00,
    sellingPrice: 74.99,
    categories: ["chinaware"],
    stock: 45,
    tags: ["homepage", "featured", "dinnerware"],
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
    ],
    sku: "WHITE-PLATE-001",
    isActive: true,
    isTrending: true,
    weight: 0.8,
    dimensions: {
      length: 28,
      width: 28,
      height: 2
    },
    brand: "Oryx",
    material: "Porcelain",
    warranty: "2 years"
  },
  {
    productId: "HP-002",
    name: "Premium Stainless Steel Cutlery Set",
    description: "Luxurious 18/10 stainless steel cutlery set with ergonomic handles. Includes dinner forks, knives, spoons, and dessert utensils. Dishwasher safe with lifetime warranty.",
    costPrice: 129.99,
    discount: 25.00,
    sellingPrice: 104.99,
    categories: ["cutleries"],
    stock: 32,
    tags: ["homepage", "premium", "cutlery"],
    images: [
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500",
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500"
    ],
    sku: "CUTLERY-001",
    isActive: true,
    isTrending: false,
    weight: 1.2,
    dimensions: {
      length: 20,
      width: 15,
      height: 3
    },
    brand: "Oryx",
    material: "18/10 Stainless Steel",
    warranty: "Lifetime"
  },
  {
    productId: "HP-003",
    name: "Crystal Wine Glass Collection",
    description: "Handcrafted crystal wine glasses with elegant stem design. Perfect for red and white wines. Set of 4 glasses with superior clarity and resonance.",
    costPrice: 79.99,
    discount: 10.00,
    sellingPrice: 69.99,
    categories: ["glassware"],
    stock: 28,
    tags: ["homepage", "crystal", "wine"],
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500"
    ],
    sku: "WINE-GLASS-001",
    isActive: true,
    isTrending: true,
    weight: 0.6,
    dimensions: {
      length: 8,
      width: 8,
      height: 25
    },
    brand: "Oryx",
    material: "Crystal",
    warranty: "1 year"
  },
  {
    productId: "HP-004",
    name: "Professional Chef's Knife",
    description: "8-inch professional chef's knife with high-carbon steel blade and ergonomic handle. Perfect for precision cutting, chopping, and slicing. Includes protective sheath.",
    costPrice: 149.99,
    discount: 30.00,
    sellingPrice: 119.99,
    categories: ["kitchen utensils"],
    stock: 18,
    tags: ["homepage", "professional", "chef"],
    images: [
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500",
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500"
    ],
    sku: "CHEF-KNIFE-001",
    isActive: true,
    isTrending: false,
    weight: 0.4,
    dimensions: {
      length: 25,
      width: 4,
      height: 2
    },
    brand: "Oryx",
    material: "High-Carbon Steel",
    warranty: "5 years"
  },
  {
    productId: "HP-005",
    name: "Artisan Wooden Serving Bowl",
    description: "Handcrafted wooden serving bowl made from sustainable acacia wood. Perfect for salads, pasta, or decorative purposes. Natural finish with food-safe coating.",
    costPrice: 59.99,
    discount: 5.00,
    sellingPrice: 54.99,
    categories: ["others"],
    stock: 22,
    tags: ["homepage", "artisan", "wooden"],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ],
    sku: "WOODEN-BOWL-001",
    isActive: true,
    isTrending: true,
    weight: 0.8,
    dimensions: {
      length: 20,
      width: 20,
      height: 8
    },
    brand: "Oryx",
    material: "Acacia Wood",
    warranty: "1 year"
  },
  {
    productId: "HP-006",
    name: "Copper Cookware Set",
    description: "Premium copper cookware set with stainless steel lining. Includes 3 pots and 2 pans with ergonomic handles. Excellent heat distribution and conductivity.",
    costPrice: 299.99,
    discount: 50.00,
    sellingPrice: 249.99,
    categories: ["kitchen utensils"],
    stock: 12,
    tags: ["homepage", "copper", "cookware"],
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
    ],
    sku: "COPPER-COOK-001",
    isActive: true,
    isTrending: false,
    weight: 3.5,
    dimensions: {
      length: 35,
      width: 25,
      height: 15
    },
    brand: "Oryx",
    material: "Copper with Stainless Steel",
    warranty: "10 years"
  },
  {
    productId: "HP-007",
    name: "Ceramic Coffee Mug Collection",
    description: "Handcrafted ceramic coffee mugs with modern design. Set of 4 mugs with comfortable handles and microwave-safe construction. Perfect for coffee, tea, or hot beverages.",
    costPrice: 44.99,
    discount: 8.00,
    sellingPrice: 36.99,
    categories: ["chinaware"],
    stock: 55,
    tags: ["homepage", "ceramic", "coffee"],
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500"
    ],
    sku: "COFFEE-MUG-001",
    isActive: true,
    isTrending: true,
    weight: 0.3,
    dimensions: {
      length: 10,
      width: 10,
      height: 12
    },
    brand: "Oryx",
    material: "Ceramic",
    warranty: "1 year"
  },
  {
    productId: "HP-008",
    name: "Stainless Steel Mixing Bowls",
    description: "Professional-grade stainless steel mixing bowls set. Includes 3 sizes (small, medium, large) with non-slip bases. Perfect for baking, cooking, and food preparation.",
    costPrice: 69.99,
    discount: 12.00,
    sellingPrice: 57.99,
    categories: ["kitchen utensils"],
    stock: 38,
    tags: ["homepage", "stainless", "mixing"],
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
    ],
    sku: "MIXING-BOWL-001",
    isActive: true,
    isTrending: false,
    weight: 1.8,
    dimensions: {
      length: 25,
      width: 25,
      height: 12
    },
    brand: "Oryx",
    material: "Stainless Steel",
    warranty: "3 years"
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

    // Insert homepage products
    const insertedProducts = await Product.insertMany(homepageProducts);
    console.log(`Successfully inserted ${insertedProducts.length} homepage products`);

    // Display inserted products
    console.log('\nInserted homepage products:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.sku}) - $${product.sellingPrice} (Original: $${product.costPrice})`);
      console.log(`  Categories: ${product.categories.join(', ')}`);
      console.log(`  Tags: ${product.tags.join(', ')}`);
      console.log(`  Stock: ${product.stock}`);
      console.log('');
    });

    console.log('Database seeding completed successfully!');
    console.log('\nYou can now test the homepage SHOP section with these products.');
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