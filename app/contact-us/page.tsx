
"use client";
import React, { useState } from "react";
import { PhoneIcon, ClipboardDocumentIcon, CheckCircleIcon, EnvelopeIcon, MapPinIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

const ContactUs = () => {
  const [copied, setCopied] = useState(false);
  const mobileNo = "9234666761";

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-gray-300 text-lg">We're here to help you succeed</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full border border-white border-opacity-20 shadow-xl mb-8">
          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                <AcademicCapIcon className="w-4 h-4 text-white" />
              </div>
              About StepUp Education
            </h2>
            <p className="text-gray-300 leading-relaxed">
              StepUp Education is dedicated to providing quality education management solutions for schools
              and institutions. We help you manage students, teachers, schedules,
              payments, and more with ease and security.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Phone Number Section */}
            <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <PhoneIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">Mobile Number</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={`tel:${mobileNo}`}
                  className="text-blue-300 hover:text-blue-200 underline text-xl font-mono transition-colors duration-300"
                >
                  {mobileNo}
                </a>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      copied 
                        ? 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500 border-opacity-30' 
                        : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20 border border-white border-opacity-20'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                  
                  <a
                    href={`tel:${mobileNo}`}
                    className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
                    title="Call Now"
                  >
                    <PhoneIcon className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Contact Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-10 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <EnvelopeIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <p className="text-gray-300 text-sm">Coming Soon</p>
              </div>
              
              <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-10 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPinIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Location</h3>
                <p className="text-gray-300 text-sm">Available on Request</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full border border-white border-opacity-20 shadow-xl mb-8">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Support Hours</h3>
          <div className="text-center space-y-2">
            <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
            <p className="text-gray-300">Sunday: Closed</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white border-opacity-20">
          <div className="text-center text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} StepUp Education - Powered by stepupedu.site
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

export default ContactUs;
