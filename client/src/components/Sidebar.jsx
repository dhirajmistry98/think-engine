import React from "react";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Code,
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titiles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/community", label: "Community", Icon: House },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
    { to: "/ai/review-resume", label: "Review Resume", Icon: FileText},
  { to: "/ai/ai-code", label: "AI Code", Icon: Code },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative top-0 left-0 h-full z-50
          bg-white/95 backdrop-blur-xl border-r border-gray-200/50
          flex flex-col justify-between items-center
          shadow-xl md:shadow-none
          transition-all duration-300 ease-out
          
          /* Mobile: Icon-only sidebar */
          w-16 md:w-60
          
          /* Mobile transform */
          ${sidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          
          /* Desktop: Always visible */
          md:translate-x-0
        `}
      >
        {/* Top Section */}
        <div className="w-full flex flex-col items-center">
          {/* User Profile - Desktop only */}
          <div className="hidden md:flex my-7 flex-col items-center gap-2">
            <div className="relative group">
              <img
                src={user.imageUrl}
                alt="User avatar"
                className="w-20 h-20 object-cover rounded-full ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-200"></div>
            </div>
            <h1 className="text-center text-sm font-medium text-gray-800">
              {user.fullName}
            </h1>
          </div>

          {/* User Profile - Mobile only (small icon) */}
          <div className="md:hidden mt-4 mb-6">
            <img
              src={user.imageUrl}
              alt="User avatar"
              className="w-10 h-10 object-cover rounded-full ring-2 ring-white shadow-md"
            />
          </div>

          {/* Navigation */}
          <div className="w-full px-2 md:px-6 text-sm text-gray-600 font-medium space-y-1">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/ai"}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `relative group flex items-center rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                  /* Mobile: Icon only */
                  w-12 h-12 justify-center md:w-full md:h-auto md:justify-start md:px-4 md:py-3 md:gap-3
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 transition-colors duration-200 ${
                        isActive ? "text-white" : ""
                      }`}
                    />
                    {/* Label - Desktop only */}
                    <span className="hidden md:inline-block font-medium">
                      {label}
                    </span>
                    
                    {/* Tooltip for mobile */}
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden whitespace-nowrap z-10">
                      {label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full border-t border-gray-200/50 p-4 flex items-center justify-center md:justify-between">
          {/* Desktop: Full profile section */}
          <div
            onClick={openUserProfile}
            className="hidden md:flex gap-3 items-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200 group"
          >
            <img 
              src={user.imageUrl} 
              className="w-9 h-9 rounded-full ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-200" 
              alt="" 
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-medium text-gray-800 truncate">
                {user.firstName}
              </h1>
              <p className="text-xs text-gray-500">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>{" "}
                plan
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={signOut}
            className="relative group flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            
            {/* Tooltip for mobile */}
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden whitespace-nowrap z-10">
              Sign Out
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;