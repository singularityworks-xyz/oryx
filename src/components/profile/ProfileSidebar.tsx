import React from 'react';
import { LogOut, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number | null;
}

interface ProfileSidebarProps {
  user: {
    image?: string;
    name?: string;
    email?: string;
  };
  navigationItems: NavigationItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

export default function ProfileSidebar({
  user,
  navigationItems,
  activeTab,
  onTabChange,
  onSignOut
}: ProfileSidebarProps) {
  return (
    <div className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
        {/* User Info Card */}
        <div className="text-center mb-8 pb-6 border-b border-gray-100">
          <div className="mb-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'User'}
                width={80}
                height={80}
                className="rounded-full border-4 border-gray-100 shadow-sm mx-auto"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border-4 border-gray-100 shadow-sm mx-auto">
                <span className="text-gray-600 text-2xl font-bold font-outfit">
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-playfair font-light text-gray-900 mb-1">
            {user.name || 'User'}
          </h3>
          <p className="text-sm text-gray-600 font-outfit font-light">
            {user.email}
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-outfit font-light">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.count !== null && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white rotate-90' : 'text-gray-400'
                  }`} />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-red-600 hover:text-red-400 hover:bg-gray-50 rounded-lg transition-all duration-200 font-outfit font-light"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
