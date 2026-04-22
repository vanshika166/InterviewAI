import { FiCheckCircle } from 'react-icons/fi';

const QuestionCard = ({question,index}) => {
  return (
    <div className="bg-white rounded-3xl 
                    p-4 sm:p-6 lg:p-7 
                    border border-gray-100">

      <div className="flex gap-3 sm:gap-5">

        {/* 🔹 Number */}
        <div className="w-7 h-7 sm:w-9 sm:h-9 
                        bg-[#1EBDD8]/10 text-[#1EBDD8] 
                        rounded-xl sm:rounded-2xl 
                        flex items-center justify-center 
                        font-bold text-sm sm:text-xl flex-shrink-0">
          {index}
        </div>

        {/* 🔹 Content */}
        <div className="flex-1">

          {/* Question */}
          <p className="text-sm sm:text-base font-medium text-gray-800 leading-relaxed">
            {question?.question}
          </p>

          {/* Answer */}
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-[#1EBDD8]">
              Your Answer:
            </span>{' '}
            {question?.answer}
          </div>
          {/* feedback */}
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 bg-[#2EBDDB]/10 rounded-lg p-3 leading-relaxed">
            <span className="font-semibold text-[#1EBDD8]">
              AI Feedback:
            </span>{' '}
            {question?.feedback}
          </div>

          {/* Tag */}
          <div className="mt-3 sm:mt-4 inline-flex flex-wrap items-center gap-2 
                          
                          px-3 sm:px-5 py-1.5 
                          rounded-xl sm:rounded-2xl 
                          text-xs sm:text-sm">
            <FiCheckCircle size={16} className='text-[#1EBDD8]' />
            Strong explanation • {question?.correctness}/10
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuestionCard;