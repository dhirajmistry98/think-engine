import React from "react";
import bg from "../assets/gradientBackground.png";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartCreating = () => {
    navigate("/ai");
  };

  const handleWatchDemo = () => {
    console.log("Watch demo clicked");
  };

  return (
    <section
      className="px-4 sm:px-32 relative flex flex-col w-full justify-center items-center bg-cover bg-center bg-no-repeat min-h-screen"
      style={{ backgroundImage: `url(${bg})` }}
      aria-label="Hero section"
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold leading-tight">
            From idea to impact <br />
            <span className="text-primary bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              AI creates it all
            </span>
          </h1>
          
          <p className="mt-6 max-w-xs sm:max-w-lg 2xl:max-w-xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
            Transform your content creation with our premium AI toolkit. Write
            compelling articles, generate stunning visuals, and streamline your
            workflow—effortlessly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleStartCreating}
            className="group flex items-center justify-center rounded-lg text-sm sm:text-base bg-primary hover:bg-primary-dark text-white px-8 py-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Start creating with AI tools"
          >
            <span>Start creating</span>
            <svg 
              className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            onClick={handleWatchDemo}
            className="group flex items-center justify-center border-2 border-gray-300 hover:border-primary rounded-lg text-sm sm:text-base bg-white hover:bg-gray-50 text-gray-700 hover:text-primary px-8 py-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Watch product demo"
          >
            <svg 
              className="mr-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Watch Demo</span>
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <img 
            src={assets.user_group} 
            alt="User avatars" 
            className="h-8 w-auto"
            loading="lazy"
          />
          <span className="text-sm sm:text-base font-medium">
            Trusted by <span className="text-primary font-semibold">10,000+</span> creators
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;