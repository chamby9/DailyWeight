'use client';

import { useEffect } from 'react';
import WeightForm from './WeightForm';

interface WeightEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWeightAdded: () => void;
}

export default function WeightEntryModal({ isOpen, onClose, onWeightAdded }: WeightEntryModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Handle successful weight addition
  const handleWeightAdded = () => {
    onWeightAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal dialog */}
      <div className="modal modal-open">
        <div className="modal-box relative">
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-4">Add Weight Entry</h3>
          <WeightForm onWeightAdded={handleWeightAdded} />
        </div>
      </div>
    </>
  );
}