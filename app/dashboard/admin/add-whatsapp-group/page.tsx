
'use client';
import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AddWhatsAppGroup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    groupName: '',
    groupLink: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateWhatsAppLink = (link: string) => {
    // Updated regex to allow all valid WhatsApp group invite link characters
    // WhatsApp group codes can contain letters, numbers, underscores, hyphens, and other URL-safe characters
    const whatsappPattern = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9_\-]+$/;
    return whatsappPattern.test(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.class || !formData.section || !formData.groupName || !formData.groupLink) {
      setError('All required fields must be filled');
      return;
    }

    if (!validateWhatsAppLink(formData.groupLink)) {
      setError('Please enter a valid WhatsApp group invite link (https://chat.whatsapp.com/...)');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/whatsapp-groups', formData);
      setSuccess('WhatsApp group added successfully!');
      setFormData({
        class: '',
        section: '',
        groupName: '',
        groupLink: '',
        description: ''
      });
      setTimeout(() => {
        router.push('/dashboard/admin');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add WhatsApp group');
    } finally {
      setLoading(false);
    }
  };

  const classes = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl text-white hover:bg-opacity-20 transition-all duration-300"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
            
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Add WhatsApp Group</h2>
            <p className="text-gray-300">Create a new WhatsApp group for a class</p>
          </div>

          {/* Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Class <span className="text-red-400">*</span>
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="" className="bg-gray-800 text-white">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls} className="bg-gray-800 text-white">{cls}</option>
                  ))}
                </select>
              </div>

              {/* Section Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Section <span className="text-red-400">*</span>
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="" className="bg-gray-800 text-white">Select Section</option>
                  {sections.map(section => (
                    <option key={section} value={section} className="bg-gray-800 text-white">{section}</option>
                  ))}
                </select>
              </div>

              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Group Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleChange}
                  placeholder="e.g., Class 10-A Mathematics"
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {/* WhatsApp Group Link */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  WhatsApp Group Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  name="groupLink"
                  value={formData.groupLink}
                  onChange={handleChange}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the WhatsApp group invite link starting with https://chat.whatsapp.com/
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Group description or purpose..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-50 rounded-xl p-4">
                  <p className="text-green-300 text-sm">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Adding Group...' : 'Add WhatsApp Group'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AddWhatsAppGroup;
