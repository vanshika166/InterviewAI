import React, { useEffect, useState } from 'react'

const OverAllPerformace = ({ data }) => {
  const [overallReview, setOverallreview] = useState('')

  useEffect(() => {
    if (data <= 3) {
      setOverallreview("Your performance indicates that there is significant room for improvement. It’s important to revisit fundamental concepts, focus on clarity while answering, and practice structured responses to build confidence.")
    } else if (data <= 5) {
      setOverallreview("You made a decent attempt, but there are areas that need improvement. Strengthening your core concepts and improving the way you communicate your answers will help you perform better.")
    } else if (data <= 7) {
      setOverallreview("Overall, this was a good performance with a solid understanding of key concepts. With a bit more refinement and better articulation, you can significantly improve your impact.")
    } else if (data <= 9) {
      setOverallreview("You delivered a very strong performance, demonstrating clear understanding and confidence in most areas. A few minor improvements can help you reach an even higher level.")
    }
    else {
      setOverallreview("This was an outstanding performance with excellent clarity, confidence, and problem-solving ability. You are well-prepared and interview-ready.")
    }
  }, [data])

return (
  <div className="p-4 sm:p-6 lg:p-8 ">

    {/* 🔹 Heading */}
    <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5">
      Overall Interview Review
    </h2>

    {/* 🔹 Content */}
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
      {overallReview}
    </p>

    {/* 🔹 Footer */}
    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 
                      border-t border-[#1EBDD8]/20 
                      flex flex-col sm:flex-row 
                      items-start sm:items-center 
                      justify-between gap-3 sm:gap-4 
                      text-xs sm:text-sm">

      {/* Interviewer */}
      <div>
        <span className="text-gray-500">Interviewer:</span>
        <span className="ml-2 font-medium text-gray-800">
           Interview AI Analytics
        </span>
      </div>

      {/* Status */}
      <div className="text-[#1EBDD8] font-medium">
        {data >= 8 ?"Candidate Highly Recommended for Next Round":data >=5?"Candidate Almost Ready for the Next Round":"Candidate Needs Improvement Before Proceeding"}
      </div>

    </div>

  </div>
)
}

export default OverAllPerformace