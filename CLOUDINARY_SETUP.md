# Cloudinary Image Upload Setup

This guide will help you set up Cloudinary image uploads for your Oryx e-commerce application.

## Prerequisites

1. A Cloudinary account (sign up at [cloudinary.com](https://cloudinary.com))
2. Node.js and npm installed
3. Your Oryx project set up

## Setup Steps

### 1. Install Dependencies

The required packages have already been installed:
- `cloudinary` - Cloudinary SDK for Node.js
- `multer` - Middleware for handling multipart/form-data
- `next-cloudinary` - Next.js integration for Cloudinary
- `@types/multer` - TypeScript types for multer

### 2. Configure Environment Variables

Create a `.env.local` file in your project root and add the following variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Other Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Get Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### 4. Update Environment Variables

Replace the placeholder values in your `.env.local` file with your actual Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Features Implemented

### 1. Image Upload Component (`src/components/ImageUpload.tsx`)

- Drag and drop functionality
- Multiple image upload support
- Image preview with delete option
- File type validation (images only)
- File size validation (max 10MB)
- Progress indication during upload

### 2. Product Form Component (`src/components/ProductForm.tsx`)

- Complete product creation/editing form
- Integrated image upload functionality
- Form validation
- Real-time price calculation
- Category and tag management

### 3. Admin Interface (`src/app/admin/`)

- Admin dashboard (`/admin`)
- Product management (`/admin/products`)
- Create, edit, and delete products
- Image management for products

### 4. API Endpoints

- `POST /api/upload` - Upload images to Cloudinary
- `GET /api/products` - Fetch products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

## Usage

### For Admins

1. Navigate to `/admin/products`
2. Click "Add Product" to create a new product
3. Use the image upload area to drag and drop or click to select images
4. Fill in all required product information
5. Submit the form

### For Developers

#### Upload Images Programmatically

```typescript
import { uploadImage } from '@/lib/cloudinary';

// Upload a single image
const imageUrl = await uploadImage(imageBuffer, 'oryx-products');

// Upload multiple images
const imageUrls = await Promise.all(
  imageBuffers.map(buffer => uploadImage(buffer, 'oryx-products'))
);
```

#### Delete Images

```typescript
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

// Delete an image by URL
const publicId = getPublicIdFromUrl(imageUrl);
await deleteImage(publicId);
```

## File Structure

```
src/
├── lib/
│   └── cloudinary.ts          # Cloudinary configuration and utilities
├── components/
│   ├── ImageUpload.tsx        # Reusable image upload component
│   └── ProductForm.tsx        # Product creation/editing form
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts       # Image upload API endpoint
│   └── admin/
│       ├── layout.tsx         # Admin layout
│       ├── page.tsx           # Admin dashboard
│       └── products/
│           └── page.tsx       # Product management page
```

## Security Considerations

1. **File Type Validation**: Only image files are allowed
2. **File Size Limits**: Maximum 10MB per file
3. **Environment Variables**: Sensitive credentials are stored in environment variables
4. **Input Validation**: All form inputs are validated before processing

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check your Cloudinary credentials in `.env.local`
2. **Images Not Displaying**: Ensure the image URLs are accessible
3. **Form Validation Errors**: Check that all required fields are filled

### Error Messages

- "Invalid file type. Only images are allowed." - Upload a valid image file
- "File size too large. Maximum size is 10MB." - Reduce image file size
- "Failed to upload images" - Check Cloudinary configuration

## Support

If you encounter any issues, please check:
1. Cloudinary dashboard for upload status
2. Browser console for JavaScript errors
3. Server logs for API errors
4. Environment variables are correctly set 