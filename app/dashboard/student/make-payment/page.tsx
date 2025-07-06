"use client";
import React from "react";
import { CreditCardIcon, ArrowLeftIcon, QrCodeIcon, ClipboardDocumentIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const qrCodeUrl = "/your-qr-code.png"; // Place your QR code image in public/your-qr-code.png
const upiId = "yourupi@bank";
const mobileNo = "9876543210";

const MakePayment = () => {
  const router = useRouter();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl px-4 py-2 text-white hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Make a Payment</h2>
            <p className="text-gray-300">Pay your fees using UPI or mobile banking</p>
          </div>

          {/* Payment Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 border border-white border-opacity-20 shadow-xl">
            {/* QR Code Section */}
            <div className="text-center mb-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <QrCodeIcon className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Scan QR Code</h3>
                </div>
                <div className="bg-white rounded-2xl p-4 inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR to Pay"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  Scan this QR code with any UPI app
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-6">
              {/* UPI ID */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="block text-sm text-gray-300 mb-1">UPI ID:</span>
                    <span className="text-white font-mono text-lg">{upiId}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(upiId, 'UPI ID')}
                    className="ml-4 p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20"
                    title="Copy UPI ID"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5 text-green-400" />
                  </button>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="block text-sm text-gray-300 mb-1">Mobile No:</span>
                    <span className="text-white font-mono text-lg">{mobileNo}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => copyToClipboard(mobileNo, 'Mobile Number')}
                      className="p-3 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20"
                      title="Copy Mobile Number"
                    >
                      <ClipboardDocumentIcon className="w-5 h-5 text-green-400" />
                    </button>
                    <a
                      href={`tel:${mobileNo}`}
                      className="p-3 bg-green-500 bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all duration-300 border border-green-500 border-opacity-30"
                      title="Call"
                    >
                      <PhoneIcon className="w-5 h-5 text-green-300" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="mt-8 bg-amber-500 bg-opacity-20 border border-amber-500 border-opacity-30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-900 text-sm font-bold">!</span>
                </div>
                <div>
                  <h4 className="text-amber-300 font-semibold mb-2">Important Instructions</h4>
                  <ul className="text-amber-200 text-sm space-y-1">
                    <li>• After payment, please note your transaction/UTR number</li>
                    <li>• Keep the payment receipt for your records</li>
                    <li>• Contact us if payment is not reflected within 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Apps */}
            <div className="mt-8">
              <h4 className="text-white font-semibold mb-4 text-center">Supported Payment Apps</h4>
              <div className="grid grid-cols-4 gap-4">
                {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                  <div key={app} className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg mx-auto mb-2"></div>
                    <span className="text-xs text-gray-300">{app}</span>
                  </div>
                ))}
              </div>
            </div>
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

export default MakePayment;