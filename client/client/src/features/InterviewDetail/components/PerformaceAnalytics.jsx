import {  FiBarChart2, } from 'react-icons/fi';

const PerformaceAnalytics = ({data}) => {
  return (
    <div>
        <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
          <FiBarChart2 size={24} /> Performance Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { skill: "Communication", score: data?.communication },
            { skill: "Correctness", score: data?.correctness },
            { skill: "Confidence", score: data?.confidence }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100">
              <div className="flex justify-between mb-4">
                <span className="font-medium text-gray-700">{item.skill}</span>
                <span className="font-bold text-[#1EBDD8]">{item.score}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full  overflow-hidden">
                <div 
                  className="h-2 bg-[#1EBDD8] rounded-full" 
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default PerformaceAnalytics