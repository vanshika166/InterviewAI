import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CTAsection = () => {
  const user = useSelector((state) => state.user.userData)
    const credits = useSelector((state)=>state.user.userCredits)
  const navigate = useNavigate()

  const handleNavigation = () => {
    if (user) {
      if(credits && credits<50){
        toast.info("Your credits are over. Upgrade to continue.")
      }else{
        navigate("/interview/Technical")
      }
    }else{
      navigate("/auth")
    } 
  }
  return (
    <section className="w-full py-20 px-2 lg:px-6 flex justify-center bg-[#F7F9FB]">

      <div className="w-full max-w-5xl rounded-3xl p-12 text-center
        bg-gradient-to-br from-[#E6F7F8] via-[#F0FBFB] to-[#EAF7F8]
        border border-[#2BB6B6]/20
        shadow-lg shadow-[#1EBDD8]/10
        relative overflow-hidden"
      >

        {/* ✨ subtle glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#2BB6B6]/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1EBDD8]/20 blur-3xl rounded-full"></div>

        {/* 🧠 Heading */}
        <h2 className="text-3xl font-Montserrat md:text-4xl font-semibold text-gray-800 tracking-tight">
          Ready to Ace Your Next Interview?
        </h2>

        {/* 📝 Subtext */}
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Join thousands of professionals who have improved their interview
          skills with InterviewAI and land their dream jobs faster.
        </p>

        {/* 🚀 Button */}
        <div className="mt-8">
          <button
            onClick={() => handleNavigation()}
            className="bg-gradient-to-r from-[#2BB6B6] to-[#1EBDD8] 
            text-white px-8 py-3 rounded-xl font-medium
            shadow-lg shadow-[#1EBDD8]/30
            transition-all duration-200
            hover:scale-105 text-sm lg:text-md hover:shadow-xl hover:shadow-[#1EBDD8]/40
            active:scale-95">
            Start Your Free Practice Session
          </button>
        </div>

      </div>
    </section>
  );
};

export default CTAsection;