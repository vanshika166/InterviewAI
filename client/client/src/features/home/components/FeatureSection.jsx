import { FiMic, FiUsers } from "react-icons/fi";
import { IoAnalytics, IoRibbonOutline, IoDocumentTextOutline } from "react-icons/io5";

const FeatureSection = () => {

  const features = [
    {
      icon: <FiMic size={22} />,
      title: "Voice Interviews",
      dex: "Practice with AI using voice recognition for a realistic interview experience"
    },
    {
      icon: "5",
      title: "Resume based Interview",
      dex: "Project specific questions based on your resume "
    },
    {
      icon: <IoAnalytics size={22} />,
      title: "History Analytics",
      dex: "Track your progress with detailed analytics and insights on your performance"
    },
    {
      icon: <FiUsers size={22} />,
      title: "Expert Feedback",
      dex: "Receive AI-powered feedback on your answers, tone, and communication style"
    },
    {
      icon: <IoRibbonOutline size={22} />,
      title: "Interview Templates",
      dex: "Choose from various interview mode: Techical interview, HR interview, Confidence detection etc"
    },
    {
      icon: <IoDocumentTextOutline size={22} />,
      title: "Download Report PDF",
      dex: "Download AI Interview Performance Report in PDF"
    }
  ]
  return (
    <div className='w-full flex flex-col items-center gap-8 justify-center py-20'>
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-4">

        {/* 🔥 Small Badge */}
        <div className="px-4 py-1 rounded-full text-xs font-medium 
    bg-[#2BB6B6]/10 text-[#2BB6B6] border border-[#2BB6B6]/20">
          Features
        </div>

        {/* 🧠 Heading */}
        <h1 className="text-3xl font-Montserrat md:text-5xl font-semibold text-gray-800 tracking-tight leading-tight max-w-2xl">
          Everything You Need to{" "}
          <span className="bg-gradient-to-r from-[#2BB6B6] to-[#1EBDD8] bg-clip-text text-transparent">
            Succeed
          </span>
        </h1>

        {/* 📝 Subtext */}
        <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">
          Our AI-powered platform provides comprehensive tools to help you prepare,
          practice, and perform better in every interview.
        </p>

      </div>

      {/* feature cards */}
      <div className="w-full mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        {features.map((item, i) => (
          <div
            key={i}
            className="group relative p-6 rounded-2xl 
      bg-white/70 backdrop-blur-xl border border-gray-100
      transition-all duration-300
      hover:-translate-y-2 hover:shadow-lg hover:shadow-[#1EBDD8]/20"
          >

            {/* 🔵 Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl 
        bg-[#2BB6B6]/20 text-[#2BB6B6] mb-4
        group-hover:bg-[#2BB6B6] group-hover:text-white
        transition-all duration-300">
              {item.icon}
            </div>

            {/* 🧠 Title */}
            <h3 className="text-lg font-Montserrat font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>

            {/* 📝 Description */}
            <p className="text-sm text-gray-500 leading-relaxed">
              {item.dex}
            </p>

            {/* ✨ Hover Glow Border */}
            <div className="absolute inset-0 rounded-2xl border border-transparent 
        group-hover:border-[#1EBDD8]/30 transition-all duration-300"></div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default FeatureSection