"use client";
import React, { useState } from "react";
import { PhoneIcon } from "@heroicons/react/24/outline";

const ContactUs = () => {
  const [copied, setCopied] = useState(false);
  const mobileNo = "9234666761";

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">Contact Us</h1>
        <p className="text-gray-600 mb-6 text-center">
          <span className="font-semibold">About Us:</span> StepUp Education is
          dedicated to providing quality education management solutions for schools
          and institutions. We help you manage students, teachers, schedules,
          payments, and more with ease and security.
        </p>
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="font-semibold">Mobile No:</span>
          <div className="flex items-center gap-2">
            <a
              href="tel:9234666761"
              className="text-blue-600 underline text-lg font-mono"
            >
              9234666761
            </a>
            <button
              onClick={handleCopy}
              className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <a
              href="tel:9234666761"
              className="ml-1 p-1 rounded hover:bg-blue-100"
              title="Call"
            >
              <PhoneIcon className="h-6 w-6 text-green-600" />
            </a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-6">
          &copy; {new Date().getFullYear()} StepUp Education
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
