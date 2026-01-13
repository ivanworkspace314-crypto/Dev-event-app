'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/app/actions';

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    venue: '',
    dateTime: '',
    mode: 'In-person',
    agenda: '',
    organizer: '',
    tags: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image/(png|jpeg|jpg)')) {
        setError('Please select a PNG or JPG image only');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate image
      if (!imageFile) {
        setError('Please upload an event image');
        setIsSubmitting(false);
        return;
      }

      // Upload image to Cloudinary via API route
      const imageFormData = new FormData();
      imageFormData.append('file', imageFile);
      
      const cloudinaryResponse = await fetch('/api/upload', {
        method: 'POST',
        body: imageFormData
      });

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        console.error('Cloudinary error:', errorData);
        throw new Error(errorData.error || 'Failed to upload image to Cloudinary');
      }

      const imageData = await cloudinaryResponse.json();
      const imagePath = imageData.secure_url;

      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      // Prepare event data
      const eventData = {
        ...formData,
        'image-path': imagePath,
        tags: tagsArray,
        dateTime: new Date(formData.dateTime).toISOString(),
      };

      await createEvent(eventData);
      
      // Redirect to admin page on success
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-500"
                placeholder="Enter event title"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL-friendly identifier) *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-500"
                placeholder="e.g., react-workshop-2024"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-500"
                placeholder="Enter event description"
              />
            </div>

            {/* Event Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Event Image (PNG or JPG only) *
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-w-md h-48 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-500"
                placeholder="Enter venue location"
              />
            </div>

            {/* Date and Time */}
            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-2">
                Date and Time *
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Mode */}
            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">
                Mode *
              </label>
              <select
                id="mode"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="In-person">In-person</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Agenda */}
            <div>
              <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-2">
                Agenda
              </label>
              <textarea
                id="agenda"
                name="agenda"
                value={formData.agenda}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-500"
                placeholder="Enter event agenda (optional)"
              />
            </div>

            {/* Organizer */}
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
                Organizer
              </label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-500"
                placeholder="Enter organizer name (optional)"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-500"
                placeholder="e.g., JavaScript, React, Web Development (comma-separated)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
