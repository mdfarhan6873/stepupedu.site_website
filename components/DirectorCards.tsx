'use client'
import React from 'react';
import { AcademicCapIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const DirectorCards: React.FC = () => {
  const directors = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      position: "Managing Director & Founder",
      qualification: "Ph.D. in Education Management",
      experience: "15+ Years",
      specialization: "Educational Leadership & Strategic Planning",
      achievements: [
        "Founded 3 successful educational institutions",
        "Mentored 10,000+ students",
        "Educational Excellence Award 2023"
      ],
      image: "/api/placeholder/300/300", // Placeholder image
      quote: "Education is the most powerful weapon which you can use to change the world."
    },
    {
      id: 2,
      name: "Prof. Priya Sharma",
      position: "Academic Director",
      qualification: "M.Ed., M.Phil. in Curriculum Development",
      experience: "12+ Years",
      specialization: "Curriculum Design & Student Assessment",
      achievements: [
        "Designed innovative learning methodologies",
        "Published 25+ research papers",
        "Best Teacher Award 2022"
      ],
      image: "/api/placeholder/300/300", // Placeholder image
      quote: "Every student has the potential to excel; we just need to find the right key to unlock it."
    }
  ];

  return (
    <div className="w-full py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Meet Our Leadership</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Our experienced directors are committed to providing world-class education and nurturing future leaders.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
        {directors.map((director) => (
          <div
            key={director.id}
            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            {/* Director Image */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <UserGroupIcon className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Director Info */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{director.name}</h3>
              <p className="text-purple-300 font-semibold mb-1">{director.position}</p>
              <p className="text-gray-300 text-sm">{director.qualification}</p>
            </div>

            {/* Experience & Specialization */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white bg-opacity-5 rounded-lg p-3 text-center">
                <AcademicCapIcon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">Experience</p>
                <p className="text-gray-300 text-xs">{director.experience}</p>
              </div>
              <div className="bg-white bg-opacity-5 rounded-lg p-3 text-center">
                <StarIcon className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">Specialization</p>
                <p className="text-gray-300 text-xs">{director.specialization}</p>
              </div>
            </div>

            {/* Quote */}
            <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm italic text-center">
                "{director.quote}"
              </p>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-center">Key Achievements</h4>
              <ul className="space-y-2">
                {director.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">{achievement}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="text-center mt-12 max-w-4xl mx-auto px-4">
        <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-10">
          <h3 className="text-2xl font-bold text-white mb-4">Our Commitment</h3>
          <p className="text-gray-300 leading-relaxed">
            Under the visionary leadership of our directors, StepUp Education Institute has become a beacon of 
            excellence in education. With their combined expertise and passion for teaching, we continue to 
            innovate and adapt our methods to meet the evolving needs of our students, ensuring they are 
            well-prepared for the challenges of tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirectorCards;