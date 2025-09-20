import React from 'react';

const testimonialData = [
  {
    id: 1,
    name: 'Donald Jackman',
    role: 'Content Creator',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    testimonial: "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    rating: 5
  },
  {
    id: 2,
    name: 'Richard Nelson',
    role: 'Instagram Influencer',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    testimonial: "The AI-powered features have transformed my content creation process. What used to take hours now takes minutes!",
    rating: 5
  },
  {
    id: 3,
    name: 'James Washington',
    role: 'Marketing Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
    testimonial: "Outstanding tool for our marketing campaigns. The quality and speed of content generation is simply amazing.",
    rating: 5
  }
];

const StarIcon = ({ filled = true }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? "#FFD700" : "none"} 
    stroke={filled ? "#FFD700" : "#e5e7eb"} 
    strokeWidth="2"
    className="transition-colors duration-200"
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const StarRating = ({ rating }) => (
  <div className="flex items-center justify-center gap-1 mb-4">
    {[...Array(5)].map((_, index) => (
      <StarIcon key={index} filled={index < rating} />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="absolute -top-4 left-8">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6 pt-4">
        <div className="relative mb-4">
          <img 
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100" 
            src={testimonial.image} 
            alt={`${testimonial.name} profile`}
            loading="lazy"
          />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {testimonial.name}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {testimonial.role}
          </p>
        </div>
      </div>

      <StarRating rating={testimonial.rating} />
      <blockquote className="text-gray-600 text-center leading-relaxed italic">
        "{testimonial.testimonial}"
      </blockquote>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

const Testimonial = () => {
  return (
    <section className="py-16 bg-gradient-to-br">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Testimonials
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Creators</span> Say
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their content creation process with our AI-powered tools.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonialData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="flex -space-x-2">
              {testimonialData.map((testimonial, index) => (
                <img
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src={testimonial.image}
                  alt=""
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              Join <span className="text-blue-600 font-semibold">10,000+</span> happy creators
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;