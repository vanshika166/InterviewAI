import { IoPlayOutline } from "react-icons/io5";
import { MdOutlineAutoGraph } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import axios from 'axios'
import { serverURL } from "../../../App.jsx"
import { toast } from "sonner";

const DashboardContent = () => {
  const navigate = useNavigate()
  const interviewList = useSelector((state) => state.interview?.interviewList)
  const user = useSelector((state)=>state.user.userData);
  const history = interviewList?.slice(0, 3)
  const [score, setScore] = useState(null)
  const sessions = [
    {id: "Technical", name: "Technical interview", para: "Coding questions and problem solving" },
    {id: "Behavioral", name: "Behavioral interview", para: "Communication and real-life scenario questions" },
    {id: "Case-study", name: "Case study", para: "Business scenarios and analytics" }
  ];


  useEffect(() => {
    const userProgress = async () => {
      try {
        const result = await axios.post(serverURL + '/api/interview/user-progress', {}, { withCredentials: true })
        setScore(result.data)
      } catch (error) {
        console.log(`user progress error: ${error}`)
      }
    }
    userProgress()
  }, [])

  const handleNavigate = (id)=>{
    if(user?.credits<0 || user?.credits === 0){
      toast.info("Your credits are over. Upgrade to continue.")
    }else{
      navigate(`/interview/${id}`)
    }
  }


  const progress = [
    { name: "Communication", score: score?.communication },
    { name: "Correctness", score: score?.correctness },
    { name: "Confidence", score: score?.confidence }
  ];



  return (
    <div className=" w-full flex flex-col lg:flex-row gap-4">

      {/* LEFT */}
      <div className="w-full lg:w-[67%] flex flex-col gap-4">

        {/* Practice */}
        <div className="bg-gradient-to-b from-[#F1FAFC] to-white border border-[#71DDDE]/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">

          <div className="mb-4">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800">
              Start a New Practice Session
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Choose an interview type to begin practicing
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {sessions.map((session, index) => (
              <div
              onClick={()=>handleNavigate(session.id)}
                key={index}
                className="flex items-center gap-3 sm:gap-4 bg-white hover:bg-[#CCFBF1] 
                rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all cursor-pointer shadow-sm"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl 
                  bg-gradient-to-r from-[#3CC3D8] to-[#84E9E1] 
                  flex items-center justify-center">
                  <IoPlayOutline className="text-white" />
                </div>

                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                    {session.name}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                    {session.para}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
    <div>
      <h2 className="text-base sm:text-lg font-semibold text-gray-900">
        Recent Interviews
      </h2>
      <p className="text-gray-600 text-sm">
        Your latest practice sessions
      </p>
    </div>

    <button
      onClick={() => navigate("/history")}
      className="self-start sm:self-auto px-4 py-2 text-sm 
      text-[#3CC3D8] hover:bg-[#2EBDDB] hover:text-white transition-all duration-200 border border-[#3CC3D8] rounded-xl">
      View All
    </button>
  </div>

  {/* 🔽 Conditional Rendering */}
  {history && history.length > 0 ? (
    <div className="flex flex-col gap-3 sm:gap-4">
      {history.map((h, i) => (
        <div key={i}
          className="flex items-center justify-between 
          bg-white hover:bg-[#E5FDF8] 
          rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all"
        >
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {`${h.mode} Interview`}
            </h3>
            <div className="flex gap-3 text-gray-500 text-xs sm:text-sm mt-1">
              <span>🕒 {h.min} min</span>
              <span>{formatDistanceToNow(new Date(h.createdAt).toLocaleString())}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl sm:text-2xl font-semibold text-[#3CC3D8]">
              {Math.floor((h.finalScore / 10) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-gray-500 text-sm sm:text-base">
        No interview history yet
      </p>
      <p className="text-gray-400 text-xs mt-1">
        Start your first interview to see results here 🚀
      </p>
    </div>
  )}
</div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-[33%] flex flex-col gap-4">

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 hover:shadow-md">

          {/* progress */}
          <div className="mb-5">
            <h1 className="text-base sm:text-lg font-medium text-gray-900">
              Your Progress
            </h1>
            <p className="text-gray-600 text-sm">
              Keep up the great work!
            </p>
          </div>

          <div className="space-y-5">
            {progress.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{p.name}</span>
                  <span className="font-medium">{p.score || 0}%</span>
                </div>

                <div className="h-2 bg-[#1EBDD8]/10 rounded-full">
                  <div
                    className="h-full bg-[#1EBDD8] rounded-full"
                    style={{ width: `${p.score || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="bg-[#F0FEFB] mt-4 rounded-2xl p-4 sm:p-6 ">

          <div className="flex items-center gap-2 mb-4">
            <MdOutlineAutoGraph className="text-[#1EBDD8]" size={20} />
            <h2 className="text-base sm:text-lg font-semibold">
              Quick Tip
            </h2>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            Focus on improving <span className="font-semibold text-[#14B8A6]">answer clarity</span> — structure your responses in clear steps and avoid vague explanations to make a stronger impact in interviews.
          </p>

        </div>
      </div>

    </div>
  );
};

export default DashboardContent;