# Profile Update System

## Overview
The profile update system allows users to update their full name, address information, and phone number through a comprehensive API and user interface.

## Features Implemented

### 1. User Model (`src/models/User.ts`)
The User model already contained all necessary fields:
- **Full Name**: `name` field (required, max 60 characters)
- **Phone Number**: `phone` field (optional, with validation)
- **Address Fields**:
  - `address.fullName` - Full name for delivery
- `address.mobileNumber` - Mobile number for delivery
- `address.buildingNumber` - Building number
- `address.streetName` - Street name
- `address.zoneNumber` - Zone number
- `address.area` - Area/Neighborhood
- `address.city` - City (usually "Doha" or other municipality)
- `address.poBox` - PO Box (optional, as mail delivery is to PO boxes)

### 2. API Endpoint (`src/app/api/user/profile/route.ts`)
Enhanced the existing PUT endpoint with comprehensive validation:

#### Validation Rules:
- **Name**: Required, non-empty, max 60 characters
- **Phone**: Optional, must match international format `^[\+]?[1-9][\d]{0,15}$`
- **Mobile Number**: Optional, must match international format `^[\+]?[1-9][\d]{0,15}$`
- **Address Fields**: All must be strings if provided

#### Response Format:
```json
{
  "success": true,
  "user": { /* updated user object */ },
  "message": "Profile updated successfully"
}
```

#### Error Handling:
- Validation errors return 400 status with detailed error messages
- Mongoose validation errors are properly handled
- Authentication errors return 401 status

### 3. Frontend Components

#### ProfilePage (`src/components/ProfilePage.tsx`)
- Manages profile form state
- Handles API calls for profile updates
- Provides error handling and success messages
- Automatically reloads profile data after successful updates

#### SettingsTab (`src/components/profile/SettingsTab.tsx`)
- Form interface for profile editing
- Client-side validation with real-time error display
- Visual feedback for validation errors
- Responsive design with proper field layout

### 4. Form Validation

#### Client-Side Validation:
- Name field validation (required, length)
- Phone number format validation
- ZIP code format validation
- Real-time error clearing on input

#### Server-Side Validation:
- Comprehensive field validation
- Data type checking
- Format validation for phone and ZIP
- Mongoose schema validation

## Usage

### API Endpoints

#### GET `/api/user/profile`
Retrieves the current user's profile information.

#### PUT `/api/user/profile`
Updates the user's profile information.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": {
    "fullName": "John Doe",
    "mobileNumber": "+97412345678",
    "buildingNumber": "123",
    "streetName": "Al Corniche Street",
    "zoneNumber": "15",
    "area": "West Bay",
    "city": "Doha",
    "poBox": "12345"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* updated user object */ },
  "message": "Profile updated successfully"
}
```

### Frontend Usage

1. Navigate to the profile page
2. Click on the "Settings" tab
3. Fill in the desired fields
4. Click "Save Changes"
5. Validation errors will be displayed if any
6. Success message will appear on successful update

## Security Features

- Authentication required for all profile operations
- Input validation and sanitization
- Proper error handling without information leakage
- Session-based user identification

## Testing

A test endpoint is available at `/api/user/profile/test` to verify the API functionality and view supported fields and validation rules.

## Future Enhancements

Potential improvements that could be added:
- Profile picture upload functionality
- Additional address validation (country-specific formats)
- Phone number internationalization
- Profile change history tracking
- Email change functionality (with verification)
- Two-factor authentication integration
