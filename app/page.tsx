'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { ArrowRightIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const router = useRouter()
  const images = [
    { src: '/reading.png', alt: 'Educational illustration 1' },
    { src: '/webinar.png', alt: 'Educational illustration 2' },
    { src: '/video-conference.png', alt: 'Educational illustration 3' }
  ]

  useEffect(() => {
    // Check for session cookie and redirect if logged in
    const sessionData = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('session='));
    if (sessionData) {
      try {
        const userData = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
        if (userData?.user?.role) {
          if (userData.user.role === 'student') router.replace('/dashboard/student')
          else if (userData.user.role === 'teacher') router.replace('/dashboard/teacher')
          else if (userData.user.role === 'admin') router.replace('/dashboard/admin')
        }
      } catch (err) {
        // Ignore errors, show home page
      }
    }
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(timer)
  }, [router, images.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className='relative z-10 flex flex-col justify-center items-center min-h-screen px-6'>
        {/* Logo Section */}
        {/* <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-6 border border-white border-opacity-20 shadow-xl mb-8">
            <Image
              src="/logo.png"
              alt="Logo of the stepupeducation which is powered by stepupedu.site"
              width={280}
              height={280}
              className="mx-auto"
            />
          </div>
        </div> */}
        
        {/* Image Carousel Section */}
        <div className="w-full max-w-md mx-auto mb-2">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-6 border border-white border-opacity-20 shadow-xl">
            <div className="relative w-[280px] h-[280px] mx-auto">
              <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
                <Image
                  src={images[currentImage].src}
                  alt={images[currentImage].alt}
                  fill
                  className="object-contain rounded-2xl"
                />
              </div>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImage === index 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 w-6' 
                        : 'bg-white bg-opacity-40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white border-opacity-20 shadow-xl max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Step Up Education</h1>
            <p className="text-gray-300">Your journey to excellence starts here</p>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="w-full max-w-md">
          <Link href="/login">
            <div className='group relative w-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105'>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-white font-bold text-xl">Get Started</span>
                <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-3 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white border-opacity-20">
          <footer className='text-center text-gray-300 text-sm'>
            Powered by stepupedu.site
          </footer>
        </div>
      </main>

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
  )
}

export default Home
