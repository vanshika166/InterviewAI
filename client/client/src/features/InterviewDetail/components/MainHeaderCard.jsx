import { FiClock, FiAward } from 'react-icons/fi';

const MainHeaderCard = ({data}) => {
  return (
    <div className="bg-white rounded-3xl 
                    p-4 sm:p-6 lg:p-8 
                    shadow-sm border border-gray-100 
                    flex flex-col lg:flex-row 
                    gap-6 sm:gap-8 items-start lg:items-center">

      {/* 🔹 Left Content */}
      <div className="flex-1 w-full">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
          {data?.mode} Interview
        </h1>

        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600">
          Excellent problem-solving skills demonstrated
        </p>

        <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-6 flex-wrap">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FiClock size={18} />
            {data?.totalQuestions} questions answered
          </div>
        </div>
      </div>

      {/* 🔹 Score Box */}
      <div className="w-full lg:w-auto flex justify-center lg:justify-end">
        <div className="bg-emerald-50 border border-emerald-200 
                        w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 
                        rounded-3xl flex flex-col items-center justify-center">

          <span className="text-3xl sm:text-5xl lg:text-7xl font-bold text-emerald-600">
            {data?.finalScore}
          </span>

          <div className="mt-3 sm:mt-4 lg:mt-6 
                          bg-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 
                          rounded-xl sm:rounded-2xl shadow-sm 
                          flex items-center gap-2">
            <FiAward className="text-emerald-600" size={18} />
            <span className="text-xs sm:text-sm font-semibold text-emerald-700">
              Overall Score
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MainHeaderCard;