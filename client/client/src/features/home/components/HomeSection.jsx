import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HomeSection = () => {
  const navigate = useNavigate()
const user = useSelector((state)=>state.user.userData)
  const credits = useSelector((state)=>state.user.userCredits)
  const handleNavigation = () => {
    if (user) {
      if (credits && credits < 50) {
        toast.info("Your credits are over. Upgrade to continue.")
      } else {
        navigate("/interview/Technical")
      }
    } else {
      navigate("/auth")
    }
  }
  return (
    <section className="relative w-full p-2 flex items-center justify-center overflow-hidden bg-[#F7F9FB] mt-5 ">

      {/* 🔵 Soft Blurred Background */}
      <div className="absolute inset-0">
        <img
          src="/bg-pattern.png"
          alt="bg"
          className="w-full h-full object-cover opacity-30 blur-2xl scale-110"
        />
      </div>

      {/* 🌫 Light Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 backdrop-blur-sm"></div>

      {/* ✨ Content */}
      <div className="relative z-10 w-full text-center px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* 🚀 Small Badge */}
          <div className="inline-block mb-6 sm:mb-8 md:mb-10 px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full 
            bg-[#CCFBF1] text-[#1BB9D5] border border-[#2BB6B6]/20 font-medium">
            🤖 Practice Interview with AI
          </div>

          {/* 🧠 Heading */}
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-Montserrat font-semibold text-gray-800 leading-tight sm:leading-snug md:leading-tight tracking-tight mb-4 sm:mb-6">
            Master Your Interview Skills with
            <br />
            <span className="bg-gradient-to-r from-[#1BB9D5] to-[#5FD4DC] to-[#95F3E3] bg-clip-text text-transparent">
              AI-Powered Practice
            </span>
          </h1>

          {/* 📝 Subtext */}
          <p className="text-gray-500 text-md sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0">
            Practice real interview questions, get instant AI feedback, and boost
            your confidence with smart, personalized sessions.
          </p>

          {/* 🎯 Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-5">

            <button
              onClick={() => handleNavigation()}
              className="w-full sm:w-auto bg-gradient-to-r from-[#2BB6B6] to-[#1EBDD8] text-white px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-xl font-medium text-sm sm:text-base
              shadow-lg shadow-[#1EBDD8]/30
              transition-all duration-200 transform
              hover:scale-105 hover:shadow-xl hover:shadow-[#1EBDD8]/40
              active:scale-95">
              Start Practicing Now
            </button>

            <button
              onClick={() => navigate("/pricing")}
              className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm sm:text-base
              backdrop-blur-md bg-white/40
              hover:bg-[#2BB6B6]/20 hover:text-[#2BB6B6] hover:border-[#2BB6B6] transition-all duration-200
              hover:scale-105">
              View Pricing
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;