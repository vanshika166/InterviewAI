import { FaArrowLeft } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StartInterviewNav = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-white via-white to-blue-50/30 border-b border-[#1EBDD8]/20 flex items-center justify-between shadow-sm">

            {/* Left Button */}
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gray-100/80 transition-all group"
            >
                <FaArrowLeft className="text-base sm:text-lg group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm sm:text-base whitespace-nowrap">
                    Exit interview
                </span>
            </button>
        </div>
    );
};

export default StartInterviewNav;