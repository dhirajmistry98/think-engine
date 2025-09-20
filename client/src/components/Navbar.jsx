import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();
  return (
    <div
      className="fixed z-5 w-full backdrop-blur-xl items-center flex justify-between
py-4 px-4 sm:px-10 cursor-pointer"
    >
      <img
        src={assets.logo}
        alt=""
        className="w-32 sm:w-40 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center rounded-full text-sm bg-primary text-white px-8 py-2.5 cursor-pointer"
        >
          Start Now <ArrowRight className="w-3 h-3 ml-2" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
