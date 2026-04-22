import { MdOutlineAccessTime } from "react-icons/md";
import { AiOutlineRise } from "react-icons/ai";
import { PiMedal } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { useEffect, useState } from "react";
import axios from 'axios';
import { serverURL } from "../../../App";
import { useSelector } from "react-redux";

const HistoryStats = () => {
  const data = useSelector((state) => state.interview?.interviewStats)
  const [timeTaken, setTimeTaken] = useState("")

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
    { icon: <SlCalender size={24} />, stat: data?.totalInterviews, title: "Total Sessions" },
    { icon: <AiOutlineRise size={24} />, stat: `${data?.averageScore || 0}`, title: "Average Score" },
    { icon: <MdOutlineAccessTime size={24} />, stat: timeTaken || '0 min', title: "Total Time" },
    { icon: <PiMedal size={24} />, stat: data?.bestScore, title: "Best Score" },
  ]
  return (
    <div className="space-y-8 w-full">
      {/* History Section */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Interview History
        </h1>
        <p className="text-gray-600 mt-1">
          Track your progress and review past sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((s, index) => {
          return <div key={index} className="bg-white rounded-2xl px-8 py-6  shadow-2xs hover:-translate-y-2 hover:shadow-lg hover:shadow-black/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{s.stat || 0}</p>
              </div>
              <div className="w-12 h-12 font-bold bg-[#DEF6F8] text-[#1EBDD8] rounded-xl hover:rotate-8 transition-all duration-300  hover:scale-105 flex items-center justify-center">
                {s.icon}
              </div>
            </div>
          </div>
        })}

      </div>
    </div>
  )
}

export default HistoryStats
