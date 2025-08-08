'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  product?: {
    _id?: string;
    productId?: string;
    name: string;
    description: string;
    costPrice: number;
    discount: number;
    sellingPrice: number;
    categories: string[];
    stock: number;
    tags: string[];
    images: string[];
    sku: string;
    isActive: boolean;
    isTrending: boolean;
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
  onSubmit: (productData: any) => void;
  isLoading?: boolean;
}

const categories = ['cutleries', 'chinaware', 'glassware', 'kitchen utensils', 'others'];

export default function ProductForm({ product, onSubmit, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    productId: product?.productId || '',
    name: product?.name || '',
    description: product?.description || '',
    costPrice: product?.costPrice || 0,
    discount: product?.discount || 0,
    sellingPrice: product?.sellingPrice || 0,
    categories: product?.categories || [],
    stock: product?.stock || 0,
    tags: product?.tags || [],
    images: product?.images || [],
    sku: product?.sku || '',
    isActive: product?.isActive ?? true,
    isTrending: product?.isTrending ?? false,
    weight: product?.weight || 0,
    dimensions: {
      length: product?.dimensions?.length || 0,
      width: product?.dimensions?.width || 0,
      height: product?.dimensions?.height || 0,
    },
    brand: product?.brand || '',
    material: product?.material || '',
    warranty: product?.warranty || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate discount when selling price changes
  useEffect(() => {
    if (formData.costPrice > 0 && formData.sellingPrice > 0) {
      const calculatedDiscount = Math.max(0, formData.costPrice - formData.sellingPrice);
      setFormData(prev => ({ ...prev, discount: calculatedDiscount }));
    }
  }, [formData.costPrice, formData.sellingPrice]);

  // Calculate selling price when costPrice or discount changes (for initial load)
  useEffect(() => {
    if (formData.costPrice > 0 && formData.discount >= 0) {
      const calculatedSellingPrice = Math.max(0, formData.costPrice - formData.discount);
      setFormData(prev => ({ ...prev, sellingPrice: calculatedSellingPrice }));
    }
  }, [formData.costPrice, formData.discount]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId.trim()) {
      newErrors.productId = 'Product ID is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.costPrice <= 0) {
      newErrors.costPrice = 'Cost price must be greater than 0';
    }

    if (formData.sellingPrice < 0) {
      newErrors.sellingPrice = 'Selling price cannot be negative';
    }

    if (formData.sellingPrice > formData.costPrice) {
      newErrors.sellingPrice = 'Selling price cannot be greater than cost price';
    }

    if (formData.discount < 0) {
      newErrors.discount = 'Discount cannot be negative';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    
    handleInputChange('categories', newCategories);
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  // Calculate discount percentage
  const discountPercentage = formData.costPrice > 0 
    ? ((formData.discount / formData.costPrice) * 100).toFixed(1)
    : '0';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID *
            </label>
            <input
              type="text"
              value={formData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.productId ? 'border-red-500' : ''
              }`}
            />
            {errors.productId && (
              <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SKU *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.sku ? 'border-red-500' : ''
              }`}
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
            )}
          </div>
        </div>

        {/* Pricing and Stock */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Pricing & Stock</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.costPrice ? 'border-red-500' : ''
              }`}
            />
            {errors.costPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.costPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Selling Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.sellingPrice ? 'border-red-500' : ''
              }`}
            />
            {errors.sellingPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount (Auto-calculated)
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                value={formData.discount}
                readOnly
                className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                ({discountPercentage}%)
              </span>
            </div>
            {errors.discount && (
              <p className="mt-1 text-sm text-red-600">{errors.discount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.stock ? 'border-red-500' : ''
              }`}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{category}</span>
            </label>
          ))}
        </div>
        {errors.categories && (
          <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="tag1, tag2, tag3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images *
        </label>
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => handleInputChange('images', images)}
          maxImages={5}
        />
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images}</p>
        )}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Material
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => handleInputChange('material', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Warranty
            </label>
            <input
              type="text"
              value={formData.warranty}
              onChange={(e) => handleInputChange('warranty', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Dimensions & Weight</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Length (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.dimensions.length}
                onChange={(e) => handleInputChange('dimensions', {
                  ...formData.dimensions,
                  length: parseFloat(e.target.value) || 0
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Width (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.dimensions.width}
                onChange={(e) => handleInputChange('dimensions', {
                  ...formData.dimensions,
                  width: parseFloat(e.target.value) || 0
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.dimensions.height}
                onChange={(e) => handleInputChange('dimensions', {
                  ...formData.dimensions,
                  height: parseFloat(e.target.value) || 0
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Active</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isTrending}
            onChange={(e) => handleInputChange('isTrending', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Trending</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
} 