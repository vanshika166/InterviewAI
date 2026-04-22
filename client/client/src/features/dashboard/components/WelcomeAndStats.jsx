import { MdOutlineDoNotDisturbOnTotalSilence, MdOutlineAccessTime } from "react-icons/md";
import { AiOutlineRise } from "react-icons/ai";
import { PiMedal } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

const WelcomeAndStats = () => {
const [timeTaken, setTimeTaken] = useState("")
  const data = useSelector((state)=>state.interview?.interviewStats)

  console.log(data)

useEffect(() => {
  if (!data?.totalTime) return; 

  const seconds = Number(data.totalTime);

  if (isNaN(seconds)) return; 

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    setTimeTaken(`${hours} hrs`);
  } else {
    setTimeTaken(`${minutes} min`);
  }

}, [data]); 


  const stats = [
    { icon: <MdOutlineDoNotDisturbOnTotalSilence size={24} />, stat: data?.totalInterviews,title:"Total Interviews" },
    { icon: <AiOutlineRise size={24} />, stat: data?.averageScore,title:"Average Score" },
    { icon: <MdOutlineAccessTime size={24} />, stat: timeTaken || '0 min',title:"Practice Time" },
    { icon: <PiMedal size={24} />, stat: data?.bestScore,title:"High Score" },

  ]
  return (
    <div className="space-y-8 w-full">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome back, John!
        </h1>
        <p className="text-gray-600 mt-1">
          Ready to practice your interview skills?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, index) => {
            return <div key={index} className="bg-white rounded-2xl px-8 py-6  shadow-2xs hover:-translate-y-2 hover:shadow-lg hover:shadow-black/10 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{s.stat||0}</p>
                </div>
                <div className="w-12 h-12 font-bold bg-[#DEF6F8] text-[#1EBDD8] rounded-xl hover:rotate-8 transition-all duration-300  hover:scale-105 flex items-center justify-center">
                  {s.icon}
                </div>
              </div>
            </div>
          })}

        </div>
    </div>
  );
};

export default WelcomeAndStats;
