'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/app/actions';
import TextInput from '@/components/TextInput';

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
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-6">Create New Event</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-md">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextInput
              label="Event Title"
              htmlFor="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />

            <TextInput
              label="Slug (URL-friendly identifier)"
              htmlFor="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="e.g., react-workshop-2024"
            />

            <TextInput
              label="Description"
              htmlFor="description"
              isTextarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter event description"
              rows={4}
            />

            {/* Event Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-slate-200 mb-2">
                Event Image (PNG or JPG only) *
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-slate-400 mb-2">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-w-md h-48 object-cover rounded-md border border-slate-600"
                  />
                </div>
              )}
            </div>

            <TextInput
              label="Venue"
              htmlFor="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              placeholder="Enter venue location"
            />

            {/* Date and Time */}
            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium text-slate-200 mb-2">
                Date and Time *
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Mode */}
            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-slate-200 mb-2">
                Mode *
              </label>
              <select
                id="mode"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="In-person">In-person</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <TextInput
              label="Agenda"
              htmlFor="agenda"
              isTextarea
              name="agenda"
              value={formData.agenda}
              onChange={handleChange}
              placeholder="Enter event agenda (optional)"
              rows={4}
            />

            <TextInput
              label="Organizer"
              htmlFor="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="Enter organizer name (optional)"
            />

            <TextInput
              label="Tags"
              htmlFor="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Web Development (comma-separated)"
            />

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 py-3 border border-slate-600 rounded-md text-slate-200 hover:bg-slate-700 transition-colors font-medium"
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
