'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [
    { src: '/reading.png', alt: 'Educational illustration 1' },
    { src: '/webinar.png', alt: 'Educational illustration 2' },
    { src: '/video-conference.png', alt: 'Educational illustration 3' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <main className='flex flex-col justify-center items-center pt-24'>
      <Image
        src="/logo.png"
        alt="Logo of the stepupeducation which is powered by stepupedu.site"
        width={300}
        height={300}
      />
      
      <div className="w-full max-w-3xl mx-auto my-8">
        <div className="relative w-[300px] h-[300px] mx-auto">
          <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
            <Image
              src={images[currentImage].src}
              alt={images[currentImage].alt}
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${currentImage === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center fixed bottom-0 pb-4">
        <Link href="/homes">
          <div className='h-10 w-52 bg-blue-600 rounded-md hover:bg-cyan-700 text-white font-bold text-2xl text-center'>
            Get Started
          </div>
        </Link>

        <footer className='text-center mt-4 flex items-baseline'>
          Powered by stepupedu.site
        </footer>
      </div>
    </main>
  )
}

export default Home