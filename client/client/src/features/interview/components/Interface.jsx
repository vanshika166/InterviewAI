import { useEffect, useRef, useState } from "react";
import { FiMic } from "react-icons/fi";
import ProgressBar from "../../../components/UI/ProgressBar.jsx";
import axios from 'axios';
import { serverURL } from '../../../App.jsx'
import { useNavigate } from "react-router-dom";


const Interface = () => {
  const navigate = useNavigate();
  // Get interview data from localStorage
  const interviewData = JSON.parse(localStorage.getItem("interviewData"));
  const interviewId = interviewData?.interviewId;
  //  States
  const [isIntroPhase, setIsIntroPhase] = useState(true)
  const recognifRef = useRef(null)
  const [isAIPlaying, setIsAIPlaying] = useState(false)
  const [currentquestion, setCurrentquestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("")
  const [timeLeft, setTimeLeft] = useState(
    Number(interviewData?.questions?.[currentquestion]?.timelimit
      && interviewData?.questions?.[currentquestion]?.timelimit
    )
  );
  const [isRecording, setIsRecording] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtitle, setSubtitle] = useState("")
  const [showFeedback, setShowFeedback] = useState(false);
  const progress = Math.floor(((currentquestion) / interviewData?.questions.length) * 100)



  console.log(`time limit: ${timeLeft}`)

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // try female voice first:
      const femaleVoice = voices.find((v) => v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("samantha") || v.name.toLowerCase().includes("female"));

      if (femaleVoice) {
        setSelectedVoice(femaleVoice)
        return;
      }
      //  try male voices:
      let maleVoice = voices.find((v) => v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark") || v.name.toLowerCase().includes("male"));

      if (maleVoice) {
        setSelectedVoice(maleVoice)
        return;
      }

      // fallback assume first voice of female:

      setSelectedVoice(voices[0])
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])


  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        console.warn("Speech synthesis not available or no voice selected");
        resolve()
        return;
      }

      window.speechSynthesis.cancel()
      //  add pause after commas and expressions:
      const humanText = text.replace(/,/g, ", ....").replace(/\./g, ". ...");

      const uttrance = new SpeechSynthesisUtterance(humanText);
      uttrance.voice = selectedVoice;
      uttrance.pitch = 1;
      uttrance.rate = 0.95;
      uttrance.volume = 1;

      uttrance.onstart = () => {
        setIsAIPlaying(true)
        stopMic();
      }

      uttrance.onend = () => {
        setIsAIPlaying(false)
        if (isRecording) {
          startMic()
        }
        resolve()
      }

      window.speechSynthesis.speak(uttrance)
    })
  }


  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(`Welcome! We're glad to have you here.`)

        await speakText(`This AI-powered interview is designed to assess your skills, thought process, and problem-solving approach in a comfortable and structured way. Take your time to understand each question and respond confidently—there are no trick questions, just an opportunity to showcase your abilities.
Make sure you're in a quiet environment, stay focused, and be yourself.
Let’s get started—wishing you the best of luck!.`);
        setIsIntroPhase(false);
      } else if (currentquestion >= 0) {
        // wait a bit before speaking the question
        await new Promise(r => setTimeout(r, 800));
      }

      if (currentquestion === interviewData?.questions.length - 1) {
        await speakText(`Alright! this might be the difficult question.`);
      }
      await speakText(interviewData?.questions[currentquestion]?.question);

      if (isRecording) {
        startMic()
      }
    }
    runIntro();

  }, [selectedVoice, isIntroPhase, currentquestion])


  // Reset timer when question changes
  useEffect(() => {
    if (isIntroPhase) return;

    const question = interviewData?.questions?.[currentquestion];

    const limit = question?.timeLimit ?? question?.timelimit ?? 60;

    setTimeLeft(Number(limit) || 60);
  }, [currentquestion]);

  // Timer countdown
  useEffect(() => {
    if (isIntroPhase || isSubmitting || isAIPlaying || feedback !== "") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, isSubmitting, currentquestion]);


  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onerror = (e) => {
      console.log("Mic error:", e);
    };

    recognifRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognifRef.current && !isAIPlaying) {
      try {
        recognifRef.current.start();
      } catch (error) { }
    }
  };

  const stopMic = () => {
    if (recognifRef.current) {
      recognifRef.current.stop();
    }
  }

  const toggleMic = () => {
    if (isRecording) {
      stopMic()
    } else {
      startMic()
    }
    setIsRecording(!isRecording)
  };

  // submit the answer and get feedback from AI:
  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(serverURL + '/api/interview/submit-answer', {
        interviewId,
        questionIndex: currentquestion,
        answer,
        timeTaken: interviewData.questions[currentquestion].timelimit - timeLeft
      },
        { withCredentials: true })
      console.log(result.data)
      setFeedback(result.data)
      await speakText(result.data.feedback)
      setShowFeedback(true)
      setIsSubmitting(false)

    } catch (error) {
      console.log(`submit answer error: ${error}`)
      setIsSubmitting(false)
    }
  }

  const handleNextQuestion = async () => {
    setAnswer("")
    setFeedback("")
    setShowFeedback(false)
    if (currentquestion >= interviewData.questions.length - 1) {
      finishInterview();
      return;
    }
    await speakText("Alright ! Let's move to the next question.");
    setCurrentquestion(currentquestion + 1)
    setTimeout(() => {
      if (isRecording) {
        startMic()
      }
    }, 500);
  }

  const finishInterview = async () => {
    stopMic()
    setIsRecording(false)
    try {
      const result = await axios.post(serverURL + '/api/interview/interview-report', { interviewId }, { withCredentials: true })
      console.log(result.data)
      localStorage.setItem("interviewReport", JSON.stringify(result.data))
      navigate(`/details/${interviewId}`)
    } catch (error) {
      console.log(`finish intreview error: ${error}`)
    }
  }

  useEffect(() => {
    if (isIntroPhase) return
    // if (!currentquestion) return

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer()
    }

  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognifRef.current) {
        recognifRef.current.stop()
        recognifRef.current.abort()
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  console.log(`interview Data: ${interviewData}`)



  // 🛑 Safety check
  if (!interviewData) {
    return <div className="text-center mt-10">No Interview Data Found</div>;
  }

  return (
    <div className="bg-[#FCFDFD] w-full px-4 py-4 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start justify-center">

      {/* ================= LEFT SIDE (AI CARD) ================= */}
      <div className="w-full lg:w-[350px]">

        <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-sm border border-gray-100">

          <div className="p-6 flex flex-col items-center">

            {/* 👤 Avatar */}
            <div className={`w-24 h-24 sm:w-28 sm:h-28 bg-[#2EBDDB] rounded-full flex items-center justify-center shadow-md ${isAIPlaying ? "animate-pulse" : "animate-none"} transition-all duration-300 ${isAIPlaying ? "shadow-lg shadow-[#2EBDDB]" : "shadow-none"}`}>
              <svg
                className="w-14 h-14 sm:w-16 sm:h-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7"
                />
              </svg>
            </div>

            {/* 🧠 AI Name + Status */}
            <div className="mt-4 text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Alex
              </h1>
              <p className="text-sm sm:text-base text-[#2EBDDB] font-medium">
                {isAIPlaying ? "AI speaking..." : ""}
              </p>
            </div>

            {/* User Info */}
            <div className="w-full bg-gray-50 rounded-2xl p-4 mt-5 text-sm space-y-3">

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Username</span>
                <span className="font-medium text-gray-800">
                  {interviewData.username}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 flex flex-col items-center">
              <ProgressBar
                timeLeft={timeLeft}
                totalTime={
                  Number(interviewData?.questions?.[currentquestion]?.timelimit
                    && interviewData?.questions?.[currentquestion]?.timelimit)
                }
              />

              <p className="text-xs text-gray-400 mt-2">
                Time Remaining
              </p>
            </div>

            {/* Question Status */}
            <div className="mt-6 flex w-full justify-center gap-x-5 items-center text-sm sm:text-base">
              <p className="text-gray-500">
                Question{" "}
                <span className="font-semibold text-gray-900">
                  {currentquestion + 1}
                </span>
              </p>

              <p className="text-gray-500">
                Total{" "}
                <span className="font-semibold text-gray-900">
                  {interviewData.questions.length}
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (QUESTION AREA) ================= */}
      <div className="w-full lg:flex-1 max-w-4xl flex flex-col gap-4 sm:gap-5">

        {/*  Top Progress */}
        <div className="p-4 sm:p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">

          <div className="flex justify-between text-xs sm:text-sm mb-2">
            <span className="text-gray-600">
              Question {currentquestion + 1} of {interviewData.questions.length}
            </span>
            <span className="text-cyan-600">{progress}%</span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-black rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/*  Question Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 shadow-sm">

          <div className="inline-block bg-cyan-500 text-white text-xs px-3 py-1 rounded-full mb-3">
            Current Question
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-gray-800 font-medium leading-relaxed">
            {interviewData.questions[currentquestion].question}
          </p>

        </div>

        {/*  Answer Section */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

          <div className="p-4 sm:p-6">

            <h3 className="text-gray-800 font-semibold text-base sm:text-lg mb-3">
              Your Answer
            </h3>

            {/*  Textarea */}
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={showFeedback}
              placeholder="Type your answer or use mic..."
              className="w-full h-44 sm:h-52 bg-gray-50 rounded-2xl p-4 pr-16 text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#2EBDDB] disabled:bg-gray-100 disabled:opacity-60"
            />

            <p className="text-xs text-gray-400 mt-3 text-center">
              💡 Speak naturally. Edit later if needed....
            </p>
          </div>

          {/* 🎤 Bottom Action Area - Show Submit/Next/Finish based on state */}
          <div className="flex justify-between items-center w-full px-3 py-2">

            {/* Mic Button - Only show when not showing feedback */}
            {!showFeedback && (
              <button
                onClick={() => toggleMic()}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-md transition ${isRecording
                  ? "bg-red-500 scale-110"
                  : "bg-[#2EBDDB] hover:scale-105"
                  }`}
              >
                <FiMic
                  size={26}
                  className={`${isRecording && "animate-pulse"} text-white`}
                />
              </button>
            )}

            {/* Submit/Next/Finish Button */}
            {!showFeedback ? (
              <button
                onClick={submitAnswer}
                disabled={isSubmitting}
                className={`px-6 py-2.5 rounded-xl bg-[#2EBDDB] disabled:bg-gray-400 text-white text-sm font-medium shadow-sm transition hover:bg-[#27a9c4] active:scale-95`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className={`px-6 py-2.5 rounded-xl ${currentquestion >= interviewData.questions.length - 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-[#2EBDDB] hover:bg-[#27a9c4]'} text-white text-sm font-medium shadow-sm transition active:scale-95`}
              >
                {currentquestion >= interviewData.questions.length - 1 ? '🎉 Finish' : 'Next Question'}
              </button>
            )}

          </div>
        </div>

        {/*  Feedback Section - Show after submit */}
        {showFeedback && feedback && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-cyan-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex gap-3 items-start">
              <div className="text-2xl">💭</div>
              <div className="flex-1">
                <h4 className="text-gray-800 font-semibold text-base sm:text-lg mb-2">
                  Feedback
                </h4>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {feedback.feedback || feedback}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interface;