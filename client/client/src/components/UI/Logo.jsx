import { TiMicrophoneOutline } from "react-icons/ti";

const Logo = () => {
  return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 hover:rotate-360 transition-all duration-500 ease-in-out rounded-xl bg-gradient-to-r  from-[#2BB6B6] via-[#1EBDD8] to-[#1EBDD8]/50 flex items-center justify-center transition-all duration-300 hover:scale-105">
              <span className="text-white text-lg"><TiMicrophoneOutline size={22}/></span>
            </div>
            <h1 className="text-lg font-semibold text-gray-800">
              InterviewAI
            </h1>
          </div>
  )
}

export default Logo