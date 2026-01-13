'use client';

import { useState } from 'react';
import { deleteEvent } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function DeleteEventButton({ eventSlug, eventTitle }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteEvent(eventSlug);
      router.refresh();
    } catch (error) {
      alert('Failed to delete event: ' + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {isDeleting ? 'DELETING...' : 'DELETE'}
    </button>
  );
}
