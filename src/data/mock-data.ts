// Centralized mock data for the Oryx application

export type Product = {
  _id: string;
  name: string;
  description: string;
  sellingPrice: number;
  costPrice: number;
  discount: number;
  images: string[];
  categories: string[];
  stock: number;
  tags: string[];
  isTrending: boolean;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  brand?: string;
  material?: string;
  warranty?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

export type SortOption = {
  value: string;
  label: string;
};

export const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Crimson Scallop Plate',
    description:
      'Elegant crimson scallop plate with intricate detailing and premium craftsmanship. Perfect for formal dining and special occasions. Set includes 4 plates with a timeless design that elevates any table setting.',
    sellingPrice: 89.99,
    costPrice: 119.99,
    discount: 30.0,
    images: ['/crimson-scallop-jewels.png', '/white-plate.png'],
    categories: ['chinaware'],
    stock: 25,
    tags: ['homepage', 'featured'],
    isTrending: true,
    sku: 'crimson-scallop-jewels-001',
    weight: 1.2,
    dimensions: { length: 30, width: 30, height: 3 },
    brand: 'Oryx',
    material: 'Fine Porcelain with Crimson Glaze',
    warranty: '5 years',
  },
  {
    _id: '2',
    name: 'Golden Sear Collection',
    description:
      'Luxurious golden sear dinnerware set with elegant gold accents and superior quality craftsmanship. Each piece features a unique golden sear pattern that adds sophistication to your dining experience.',
    sellingPrice: 149.99,
    costPrice: 199.99,
    discount: 50.0,
    images: ['/golden-sear-scallops.png', '/black-plate.png'],
    categories: ['chinaware'],
    stock: 18,
    tags: ['homepage', 'premium'],
    isTrending: true,
    sku: 'golden-sear-scallops-001',
    weight: 1.8,
    dimensions: { length: 32, width: 32, height: 3 },
    brand: 'Oryx',
    material: 'Premium Porcelain with Gold Accents',
    warranty: '10 years',
  },
  {
    _id: '3',
    name: 'White Plate Collection',
    description:
      'Classic white dinner plates crafted from premium porcelain, perfect for any occasion. These versatile plates complement any table setting and are suitable for both formal and casual dining.',
    sellingPrice: 64.99,
    costPrice: 89.99,
    discount: 25.0,
    images: ['/white-plate.png', '/crimson-scallop-jewels.png'],
    categories: ['chinaware'],
    stock: 45,
    tags: ['homepage', 'classic'],
    isTrending: false,
    sku: 'WHITE-PLATE-001',
    weight: 1.0,
    dimensions: { length: 28, width: 28, height: 2 },
    brand: 'Oryx',
    material: 'Premium Porcelain',
    warranty: '3 years',
  },
  {
    _id: '4',
    name: 'Black Plate Series',
    description:
      'Modern black dinner plates with sleek design and sophisticated appeal. The matte black finish adds contemporary elegance to your dining experience while maintaining versatility for various cuisines.',
    sellingPrice: 79.99,
    costPrice: 109.99,
    discount: 30.0,
    images: ['/black-plate.png', '/golden-sear-scallops.png'],
    categories: ['chinaware'],
    stock: 32,
    tags: ['homepage', 'modern'],
    isTrending: true,
    sku: 'BLACK-PLATE-001',
    weight: 1.1,
    dimensions: { length: 29, width: 29, height: 2 },
    brand: 'Oryx',
    material: 'Porcelain with Matte Black Glaze',
    warranty: '3 years',
  },
];

export const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Crimson Scallop Plate',
    price: 89.99,
    image: '/crimson-scallop-jewels.png',
    quantity: 2,
    stock: 25,
  },
  {
    id: '2',
    name: 'Golden Sear Collection',
    price: 149.99,
    image: '/golden-sear-scallops.png',
    quantity: 1,
    stock: 18,
  },
  {
    id: '3',
    name: 'White Plate Collection',
    price: 64.99,
    image: '/white-plate.png',
    quantity: 1,
    stock: 45,
  },
];

export const categories = [
  'chinaware',
  'cutleries',
  'glassware',
  'kitchen utensils',
  'others',
];

export const sortOptions: SortOption[] = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter((product) =>
    product.categories.includes(category)
  );
};

export const getTrendingProducts = (): Product[] => {
  return mockProducts.filter((product) => product.isTrending);
};

export const getProductsByTag = (tag: string): Product[] => {
  return mockProducts.filter((product) => product.tags.includes(tag));
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product._id === id);
};
