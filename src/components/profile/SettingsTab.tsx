import React, { useState } from 'react';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: {
    fullName: string;
    mobileNumber: string;
    buildingNumber: string;
    streetName: string;
    zoneNumber: string;
    area: string;
    city: string;
    poBox: string;
  };
}

interface SettingsTabProps {
  profileForm: ProfileForm;
  onProfileFormChange: (field: string, value: string | { [key: string]: string }) => void;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string;
}

export default function SettingsTab({
  profileForm,
  onProfileFormChange,
  onSave,
  isSaving,
  saveMessage
}: SettingsTabProps) {
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Validate name
    if (!profileForm.name.trim()) {
      errors.name = 'Full name is required';
    } else if (profileForm.name.length > 60) {
      errors.name = 'Name cannot be more than 60 characters';
    }
    
    // Validate phone number if provided
    if (profileForm.phone && profileForm.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(profileForm.phone)) {
        errors.phone = 'Please provide a valid phone number';
      }
    }
    
    // Validate mobile number if provided
    if (profileForm.address.mobileNumber && profileForm.address.mobileNumber.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(profileForm.address.mobileNumber)) {
        errors.mobileNumber = 'Please provide a valid mobile number';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'address') {
        onProfileFormChange(parent, {
          ...profileForm.address,
          [child]: value
        });
      }
    } else {
      onProfileFormChange(field, value);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-playfair font-light text-gray-900">Account Settings</h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-playfair font-light text-gray-900">Personal Information</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Full Name</label>
                                 <input
                   type="text"
                   value={profileForm.name}
                   onChange={(e) => handleInputChange('name', e.target.value)}
                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700 ${
                     validationErrors.name ? 'border-red-300' : 'border-gray-300'
                   }`}
                   placeholder="Enter your full name"
                 />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-outfit font-light cursor-not-allowed"
                  placeholder="Enter your email"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Phone Number</label>
                                 <input
                   type="tel"
                   value={profileForm.phone}
                   onChange={(e) => handleInputChange('phone', e.target.value)}
                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700 ${
                     validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                   }`}
                   placeholder="Enter your phone number"
                 />
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-playfair font-light text-gray-900">Shipping Address</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.address.fullName}
                  onChange={(e) => handleInputChange('address.fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700"
                  placeholder="Enter full name for delivery"
                />
              </div>
              
              <div>
                <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={profileForm.address.mobileNumber}
                  onChange={(e) => handleInputChange('address.mobileNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700 ${
                    validationErrors.mobileNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter mobile number for delivery"
                />
                {validationErrors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.mobileNumber}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Building Number</label>
                  <input
                    type="text"
                    value={profileForm.address.buildingNumber}
                    onChange={(e) => handleInputChange('address.buildingNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700"
                    placeholder="Building No."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Zone Number</label>
                  <input
                    type="text"
                    value={profileForm.address.zoneNumber}
                    onChange={(e) => handleInputChange('address.zoneNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700"
                    placeholder="Zone No."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Street Name</label>
                <input
                  type="text"
                  value={profileForm.address.streetName}
                  onChange={(e) => handleInputChange('address.streetName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700"
                  placeholder="Enter street name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Area/Neighborhood</label>
                  <input
                    type="text"
                    value={profileForm.address.area}
                    onChange={(e) => handleInputChange('address.area', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700"
                    placeholder="Area/Neighborhood"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={profileForm.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700"
                    placeholder="City (e.g., Doha)"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">PO Box (Optional)</label>
                <input
                  type="text"
                  value={profileForm.address.poBox}
                  onChange={(e) => handleInputChange('address.poBox', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-all duration-300 hover:border-gray-400 text-gray-700"
                  placeholder="PO Box (optional)"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {saveMessage && (
            <div className={`mb-4 p-4 rounded-lg ${
              saveMessage.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {saveMessage}
            </div>
          )}
          <div className="flex justify-start text-gray-400 text-sm font-outfit font-light">*It may take some to display the changes</div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center my-4 px-8 py-4 bg-gray-900 text-white font-outfit font-light text-lg hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
