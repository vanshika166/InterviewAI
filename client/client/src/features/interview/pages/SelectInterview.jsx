import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { serverURL } from '../../../App.jsx';
import { FaBriefcase, FaUser, FaFileAlt, FaMagic } from "react-icons/fa";
import { toast } from "sonner";

const SelectInterview = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [mode, setMode] = useState(type);
  const [analysing, setAnalysing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [loading, setLoading] = useState(false)

  // RESUME ANALYSIS:
  const handleResume = async () => {
    try {
      setAnalysing(true);
      let formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await axios.post(
        serverURL + "/api/interview/resume-analysis",
        formData,
        { withCredentials: true }
      );

      setRole(response.data.role || "");
      setExperience(response.data.experience || "");
      setSkills(response.data.skills || []);
      setProjects(response.data.projects || []);
      setResumeText(response.data.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.log(`handle resume error: ${error}`);
    } finally {
      setAnalysing(false);
    }
  };

  // HANDLE FILE SELECTION: 
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("PDF only");
    }
  };

  // START INTERVIEW AND GENERATE QUESTIONS:
  const handleInterviewStart = async () => {
    setLoading(true)
    try {
      const response = await axios.post(serverURL + '/api/interview/generate-questions', { role, experience, mode, resumeText, projects, skills }, { withCredentials: true })
      console.log(response.data)
      if (response.data && response.data.credits < 50) {
        toast("You're out of credits ⚠️", {
          description: "Upgrade your plan to continue your interview practice.",
        });
      }
      localStorage.setItem("interviewData", JSON.stringify(response.data))
      navigate(`/interview/${type}/start-practice`)
      setLoading(false)
      setLoading(false)
    } catch (error) {
      console.log("handle interview start: ", error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col lg:flex-row">

        <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-10 text-white bg-gradient-to-br from-[#1bbada] via-[#37c2db] to-[#78d8e9] overflow-hidden">

          {/* 🔵 Glow background effects */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/10 rounded-full blur-3xl"></div>

          {/* 🔥 Content */}
          <div className="relative z-10">

            {/* TITLE */}
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              Crack Interviews <br /> Smarter with AI
            </h1>

            <p className="text-sm sm:text-base opacity-90 mb-8 max-w-sm">
              Get personalized interview questions, analyze your resume, and improve with real-time feedback.
            </p>

            {/* FEATURES */}
            <div className="space-y-4">

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaBriefcase />
                </div>
                <div>
                  <p className="text-sm font-semibold">Role-based Questions</p>
                  <span className="text-xs opacity-80">
                    Tailored to your job profile
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaMagic />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Resume Analysis</p>
                  <span className="text-xs opacity-80">
                    Extract skills & projects instantly
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaUser />
                </div>
                <div>
                  <p className="text-sm font-semibold">Real Interview Experience</p>
                  <span className="text-xs opacity-80">
                    Practice like actual interviews
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 🔻 Bottom subtle text */}
          <p className="relative z-10 text-xs opacity-70 mt-10">
            Built for developers preparing for real-world interviews 🚀
          </p>
        </div>

        {/* ⚪ RIGHT PANEL */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center">

          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800">
            Interview Setup
          </h2>

          {/* ROLE */}
          <div className="relative mb-4">
            <FaBriefcase className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Job Role"
              className="w-full h-12 pl-10 pr-3 rounded-xl border border-gray-200 focus:border-[#2EBDDB] focus:ring-2 focus:ring-[#2EBDDB]/20 outline-none"
            />
          </div>

          {/* EXPERIENCE */}
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Experience"
              className="w-full h-12 pl-10 pr-3 rounded-xl border border-gray-200 focus:border-[#2EBDDB] focus:ring-2 focus:ring-[#2EBDDB]/20 outline-none"
            />
          </div>

          {/* MODE */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full mb-4 h-12 px-3 rounded-xl border border-gray-200 focus:border-[#2EBDDB] focus:ring-2 focus:ring-[#2EBDDB]/20 outline-none"
          >
            <option value="Technical">Technical</option>
            <option value="Case-study">Case study</option>
            <option value="Behavioral">Behavioral</option>
          </select>

          {/* FILE INPUT */}
          <div className={`${analysisDone ? "hidden" : "block"} mb-5`}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div
              onClick={!selectedFile ? () => fileInputRef.current.click() : undefined}
              className="w-full min-h-[120px] border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#2EBDDB] hover:bg-[#2EBDDB]/5 px-3 text-center transition"
            >
              <FaFileAlt className="text-xl text-[#2EBDDB] mb-2" />

              {selectedFile ? (
                <>
                  <p className="text-sm font-medium text-gray-700 break-all">
                    {selectedFile.name}
                  </p>

                  <span className="text-xs text-gray-400 mb-2">
                    Tap to change file
                  </span>

                  {!analysisDone && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResume();
                      }}
                      disabled={analysing}
                      className={`mt-1 px-4 py-1.5 rounded-lg text-xs font-medium text-white
                  ${analysing ? "bg-gray-400" : "bg-[#2EBDDB]"}`}
                    >
                      {analysing ? "Analysing..." : "Analyze Resume"}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 font-medium">
                    Upload your resume
                  </p>
                  <span className="text-xs text-gray-400">
                    PDF only • Max 5MB
                  </span>
                </>
              )}
            </div>
          </div>

          {/* RESULT */}
          {analysisDone && (
            <div className="bg-gray-50  p-4 rounded-xl text-sm mb-4 overflow-x-auto">
              <p className="font-semibold text-gray-800 mb-3">
                Resume Analysis Result
              </p>

              {projects.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    PROJECTS
                  </p>
                  <ul className="list-disc ml-5 text-gray-700">
                    {projects.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    SKILLS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white rounded-md text-xs text-gray-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleInterviewStart}
            disabled={!role || !experience || loading}
            className="w-full bg-[#2EBDDB] text-white py-2.5 rounded-xl font-medium disabled:bg-gray-400"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default SelectInterview;