'use client';

import { useEffect } from 'react';
import WeightForm from './WeightForm';

interface WeightEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWeightAdded: () => void;
}

export default function WeightEntryModal({ isOpen, onClose, onWeightAdded }: WeightEntryModalProps) {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-sm bg-white">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-6">Add Weight Entry</h3>
        <WeightForm onWeightAdded={onWeightAdded} />
      </div>
      <div className="modal-backdrop bg-black/20" onClick={onClose}></div>
    </div>
  );
}