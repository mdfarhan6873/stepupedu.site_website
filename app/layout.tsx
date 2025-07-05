import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { html } from 'framer-motion/client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StepUp Education | School Management App',
  description: 'StepUp Education is a modern , mobile-friendly school management platform for students, teachers, and admins. Manage schedules, payments, notifications, and more.',
  keywords: 'school management, education, students, teachers, admin, schedules, payments, notifications, stepupedu, stepupedu.site',
  openGraph: {
    title: 'StepUp Education | School Management App ',
    description: 'StepUp Education is a modern, mobile-friendly school management platform for students, teachers, and admins. Manage schedules, payments, notifications, and more.',
    url: 'https://stepupedu.site',
    siteName: 'StepUp Education ',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'StepUp Education Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://stepupedu.site" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
