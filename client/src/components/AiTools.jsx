import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="px-4 sm:px-8 lg:px-16 xl:px-24 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-gray-800 text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            AI That Works for You
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience the power of intelligent automation tailored to your needs.
            From writing content to generating images and code, our AI tools are
            designed to boost your productivity, spark creativity, and simplify
            your workflow — all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {AiToolsData.map((tool, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => user && navigate(tool.path)}
            >
              <div className="mb-5">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
                  }}
                >
                  <tool.Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-gray-900">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-gray-500 flex items-center">
                  <span>Get started</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>


        {!user && (
          <div className="text-center mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-4">
              Sign in to start using our AI tools and boost your productivity
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Sign In to Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTools;