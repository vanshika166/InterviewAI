import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Logo from "../UI/Logo";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../../App.jsx";
import { setUserData } from "../../redux/userSlice.js";
import { setInterviewList, setInterviewStats } from "../../redux/interviewSlice.js";

const Navbar = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);

  return (
    <div className="fixed top-0 left-0 w-full z-20 h-16 
      flex items-center justify-between 
      px-4 sm:px-6 md:px-10
      bg-white/60 backdrop-blur-lg 
      border-b border-blue-100/50">

      {/* 🔹 Logo */}
      <div className="flex items-center">
        <Logo />
      </div>

      {/* 🔹 Actions */}
      {!userData ? (
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => navigate("/auth")}
            className="bg-[#1EBDD8] text-white 
              text-xs sm:text-sm 
              px-3 sm:px-5 py-2 rounded-lg font-medium
              shadow-md shadow-[#1EBDD8]/30
              transition-all duration-150 transform
              hover:scale-105 hover:shadow-lg hover:shadow-[#1EBDD8]/40
              active:scale-95"
          >
            Get Started
          </button>
        </div>
      ) : (
        <UserNav user={userData} />
      )}
    </div>
  );
};

export default Navbar;

const UserNav = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initial = user?.name?.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        serverURL + "/api/auth/logout",
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(setUserData(null));
        dispatch(setInterviewStats(null))
        dispatch(setInterviewList(null))
        navigate("/");
      }
    } catch (error) {
      console.log("logout error: ", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2BB6B6] via-[#1EBDD8] to-[#1EBDD8]/50 text-white flex items-center justify-center font-semibold cursor-pointer select-none transition hover:scale-105"
      >
        {initial}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl p-3 animate-fadeIn">

          {/* Credits */}
          <div className="bg-[#2EBDDB]/10 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-700">Credits</span>
            <span className="text-sm font-bold text-[#2EBDDB]">
              {user?.credits|| 0}
            </span>
          </div>

          {/* Options */}
          <div className="flex flex-col text-sm">
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition"
            >
              Dashboard
            </button>

            <button
              onClick={() => handleNavigation("/history")}
              className="px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition"
            >
              History
            </button>

            <button
              onClick={() => handleNavigation("/pricing")}
              className="px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition"
            >
              Buy Credits
            </button>

            <div className="h-2"></div>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-left text-red-500 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
