'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  onSignOut: () => void;
}

export default function MobileMenu({ onSignOut }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute top-16 right-4 w-48 bg-base-100 shadow-lg rounded-lg py-2 z-50">
          <Link 
            href="/account" 
            className="block px-4 py-2 hover:bg-base-200"
            onClick={() => setIsOpen(false)}
          >
            Account Settings
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              onSignOut();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-base-200 text-error"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 