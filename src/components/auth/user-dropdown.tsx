'use client'

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Package, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
        <span className="hidden md:block text-sm font-semibold text-gray-700">
          {user.firstName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-600">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">My Profile</span>
            </Link>
            
            <Link
              href="/orders"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              <Package className="h-5 w-5" />
              <span className="font-medium">My Orders</span>
            </Link>
            
            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-5 w-5" />
              <span className="font-medium">Wishlist</span>
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 hover:text-red-700 w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
