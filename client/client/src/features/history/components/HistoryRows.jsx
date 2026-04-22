import { FiSearch, FiFilter, FiDownload, FiClock, FiCalendar, FiCheckCircle, FiEye } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { serverURL } from '../../../App.jsx'
import { useSelector } from 'react-redux';
const HistoryRows = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const interviewList = useSelector((state) => state.interview?.interviewList)
  const [filteredList, setFilteredList] = useState(interviewList)

  useEffect(() => {
    if (!interviewList) return

    let updatedList = [...interviewList];

    // filter query:
    if (filterType !== "all") {
      updatedList = updatedList.filter((l) => l?.mode === filterType)
    }

    // search query:
    if (searchQuery.trim() !== "") {
      updatedList = updatedList.filter((l) => l?.mode.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    setFilteredList(updatedList)
  }, [filterType, interviewList, searchQuery])

  const filterOptions = [
    { value: 'all', label: 'All Type' },
    { value: 'Technical', label: 'Technical' },
    { value: 'HR', label: 'HR' },
    { value: 'Behavioral', label: 'Behavioral' }
  ];

  return (
    <div className='w-full'>

      {/* 🔹 Filter Section */}
      <div className="w-full p-2 mx-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 
                        bg-white rounded-xl border border-gray-100 px-4 sm:px-6 py-4">

          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0FDFA] border border-transparent focus:border-[#77E1E0]/30 
                         pl-10 sm:pl-11 py-2.5 sm:py-3 rounded-2xl text-sm outline-none"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#F0FDFA] 
                          rounded-2xl w-full sm:w-auto">
            <FiFilter size={16} className="text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 outline-none w-full"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>


        </div>
      </div>

      {/* 🔹 History List */}
      <div className='mt-6 flex flex-col gap-4 w-full'>
        {filteredList && filteredList.length > 0 ? (filteredList.map((i) => {
          return <InterviewCard key={i._id} data={i} />
        })) : (
          <div className="w-full text-center py-10 text-gray-400">
            No interviews found 😕
          </div>
        )
        }
      </div>
    </div>
  );
};

export default HistoryRows;





const InterviewCard = ({ data }) => {
  const navigate = useNavigate()
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const finalScore = Math.floor((data?.finalScore / 10) * 100)
  return (
    <div key={data?._id} className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 
                    hover:shadow-md transition-all">

      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

        {/* Left */}
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {data?.mode} Interview
          </h3>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FiCalendar size={14} />
              {formatDate(data?.createdAt)}
            </div>
            <div className={`flex items-center gap-1 bg-emerald-100 ${data?.status === "incomplete"?"bg-red-100 text-red-600":"text-emerald-700"} px-2.5 py-1 rounded-full text-xs`}>
              <FiCheckCircle size={14} />
              {data?.status}
            </div>
          </div>

          <div className="mt-4 text-xs sm:text-sm text-gray-600">
            <p>Excellent problem-solving skills demonstrated</p>
            <p className="mt-2 text-gray-500">{data?.questions?.length || 0} questions</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4">

          {/* Score */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 
                          bg-emerald-50 border border-emerald-200 
                          rounded-2xl flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl font-bold text-emerald-600">
              {finalScore || 0}%
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-600">
              Score
            </span>
          </div>

          {/* Button */}
          <button
            onClick={() => navigate(`/details/${data?._id}`)}
            className="flex items-center gap-2 px-3 sm:px-5 py-2 
                             border border-[#06B6D4]/50 rounded-xl text-xs sm:text-sm 
                             text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white transition">
            <FiEye size={16} />
            View
          </button>

        </div>
      </div>
    </div>
  );
};