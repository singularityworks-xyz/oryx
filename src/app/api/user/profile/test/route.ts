import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Profile API is working',
    endpoints: {
      GET: '/api/user/profile - Get user profile',
      PUT: '/api/user/profile - Update user profile',
    },
    supportedFields: {
      name: 'Full name (required, max 60 chars)',
      phone: 'Phone number (optional, international format)',
      address: {
        street: 'Street address (optional)',
        city: 'City (optional)',
        state: 'State/Province (optional)',
        zipCode: 'ZIP/Postal code (optional, US format)',
        country: 'Country (optional)'
      }
    },
    validation: {
      name: 'Required, non-empty, max 60 characters',
      phone: 'Optional, must match international phone format',
      zipCode: 'Optional, must match US ZIP code format (12345 or 12345-6789)'
    }
  });
}
