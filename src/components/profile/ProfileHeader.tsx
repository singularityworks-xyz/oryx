import React from 'react';

export default function ProfileHeader() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-playfair font-light text-gray-900">My Account</h1>
          <p className="text-gray-600 font-outfit font-light mt-1">Manage your profile and orders</p>
        </div>
      </div>
    </div>
  );
}
