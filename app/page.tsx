'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { ArrowRightIcon, AcademicCapIcon, StarIcon, UserGroupIcon, BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import NameCardsScroller from '@/components/NameCardsScroller'
import AddNameCardForm from '@/components/AddNameCardForm'
import NameCardsList from '@/components/NameCardsList'
import ContactForm from '@/components/ContactForm'
import EnquiriesManager from '@/components/EnquiriesManager'
import DirectorCards from '@/components/DirectorCards'
import { INameCard } from '@/lib/models/NameCard'

const Home = () => {

  const [showAppPopup, setShowAppPopup] = useState(false)
  const [nameCards, setNameCards] = useState<INameCard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch name cards from API
  const fetchNameCards = async () => {
    try {
      const response = await fetch('/api/name-cards')
      const data = await response.json()
      if (data.success) {
        setNameCards(data.data)
      }
    } catch (error) {
      console.error('Error fetching name cards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNameCards()
  }, [])

  const handleCardAdded = () => {
    fetchNameCards()
  }

  const handleCardDeleted = () => {
    fetchNameCards()
  }

  const features = [
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Expert Faculty",
      description: "Learn from industry experts with years of teaching experience"
    },
    {
      icon: <BookOpenIcon className="w-8 h-8" />,
      title: "Comprehensive Curriculum",
      description: "Well-structured courses designed for maximum learning outcomes"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Small Class Sizes",
      description: "Personalized attention with optimal student-teacher ratios"
    },
    {
      icon: <StarIcon className="w-8 h-8" />,
      title: "Proven Results",
      description: "Track record of student success and academic excellence"
    }
  ]

  const stats = [
    { number: "5000+", label: "Students Taught" },
    { number: "15+", label: "Years Experience" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Expert Teachers" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Download App Popup */}
      {showAppPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowAppPopup(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h3 className="text-lg font-bold mb-2 text-gray-800">Download Our App</h3>
            <p className="text-gray-600 mb-4">Get the best experience on mobile. Download the Step Up Education app now!</p>
            <a
              href="/app-release.apk"
              download
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold px-6 py-2 rounded-xl shadow hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Download App
            </a>
          </div>
        </div>
      )}

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 bg-white bg-opacity-5 backdrop-blur-lg border-b border-white border-opacity-10">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <AcademicCapIcon className="w-8 h-8" />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            StepUp Education
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-white hover:text-purple-300 transition-colors duration-300 font-medium">About</Link>
          <Link href="/courses" className="text-white hover:text-purple-300 transition-colors duration-300 font-medium">Courses</Link>
          <Link href="/contact-us" className="text-white hover:text-purple-300 transition-colors duration-300 font-medium">Contact</Link>
          <Link
            href="https://stepupeduapplication.netlify.app/login"
            target="_self"
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 font-medium"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className='relative z-10 pt-20 pb-16 flex flex-col items-center justify-center min-h-[80vh]'>
        <div className="text-center mb-12 text-white max-w-5xl mx-auto px-6">
          <h1 className='xl:text-7xl lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold mb-6 leading-tight'>
            Transform Your Future with
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">
              Quality Education
            </span>
          </h1>
          <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
            Join thousands of successful students who have achieved their dreams through our comprehensive educational programs and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#contact" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 font-semibold text-lg">
              Get Started Today
            </Link>
            <Link href="#features" className="border-2 border-white border-opacity-30 text-white px-8 py-4 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 font-semibold text-lg">
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose StepUp Education?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We provide world-class education with modern teaching methodologies and personalized attention to ensure your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
                <div className="text-purple-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Name Cards Scroller Section */}
      <section className="relative z-10 py-16 px-2">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our Students & Teachers</h2>
          <p className="text-gray-300 text-lg">Celebrating achievements and progress of our learning community</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <NameCardsScroller cards={nameCards} />
        )}
      </section>

      {/* Directors Section */}
      <section className="relative z-10 py-20 px-6">
        <DirectorCards />
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 py-12 px-6'>
        <div className="max-w-6xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <AcademicCapIcon className="w-6 h-6 text-purple-400" />
              <span className="text-white font-bold text-xl">StepUp Education Institute</span>
            </div>
            <p className="text-gray-300 mb-4">Empowering minds, shaping futures</p>
            <div className="flex justify-center gap-6 mb-6">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link href="/courses" className="text-gray-300 hover:text-white transition-colors">Courses</Link>
              <Link href="/contact-us" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</Link>
            </div>
            <div className="border-t border-white border-opacity-20 pt-4">
              <p className='text-center text-gray-400 text-sm'>
                © 2024 StepUp Education Institute. All rights reserved. | Powered by stepupedu.site
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons
      <AddNameCardForm onCardAdded={handleCardAdded} />
      <NameCardsList cards={nameCards} onCardDeleted={handleCardDeleted} />
      <EnquiriesManager /> */}

      {/* Download App Button */}
      <button
        onClick={() => setShowAppPopup(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-lg p-3 hover:scale-110 transition-all duration-300 flex items-center gap-2"
        style={{ boxShadow: '0 4px 24px 0 rgba(80,0,120,0.15)' }}
        aria-label="Download App"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4m-7 7h10" />
        </svg>
        <span className="inline text-sm font-semibold">Download App</span>
      </button>

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
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}

export default Home